// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CheckoutItem = {
  productId: number;
  variantId?: number | null;
  quantity: number;
};

type CheckoutBody = {
  items: CheckoutItem[];
  promoCode?: string | null;
  userId?: string | null;
};

// Helper: fetch products/variants and compute subtotal + line items
async function buildPricing(items: CheckoutItem[]) {
  const productIds = Array.from(new Set(items.map((i) => i.productId)));
  const variantIds = Array.from(
    new Set(
      items
        .map((i) => i.variantId)
        .filter((id): id is number => typeof id === "number")
    )
  );

  const [products, variants] = await Promise.all([
    prisma.product.findMany({
      where: { id: { in: productIds } },
    }),
    prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
    }),
  ]);

  const productMap = new Map(products.map((p) => [p.id, p]));
  const variantMap = new Map(variants.map((v) => [v.id, v]));

  let subtotal = 0;
  let currency: string | null = null;

  const lineItems: {
    productId: number;
    variantId: number | null;
    quantity: number;
    unitPrice: number;
  }[] = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) continue;

    const variant = item.variantId ? variantMap.get(item.variantId) : null;
    const unitPrice = variant?.price ?? product.basePrice;

    subtotal += unitPrice * item.quantity;

    if (!currency) {
      currency = product.currency || "USD";
    }

    lineItems.push({
      productId: item.productId,
      variantId: item.variantId ?? null,
      quantity: item.quantity,
      unitPrice,
    });
  }

  return { subtotal, currency: currency ?? "USD", lineItems };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody | null;

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or invalid payload." },
        { status: 400 }
      );
    }

    const { items, promoCode, userId } = body;

    // 1) Compute pricing from DB
    const { subtotal, currency, lineItems } = await buildPricing(items);

    if (subtotal <= 0) {
      return NextResponse.json(
        { error: "Subtotal must be greater than zero." },
        { status: 400 }
      );
    }

    // 2) Optional promotion
    let discountAmount = 0;
    let promotionId: number | null = null;

    if (promoCode) {
      const now = new Date();
      const normalizedCode = promoCode.trim().toUpperCase();

      const promotion = await prisma.promotion.findFirst({
        where: {
          code: normalizedCode,
          isActive: true,
          AND: [
            {
              OR: [{ startsAt: null }, { startsAt: { lte: now } }],
            },
            {
              OR: [{ endsAt: null }, { endsAt: { gte: now } }],
            },
          ],
        },
      });

      if (!promotion) {
        return NextResponse.json(
          { error: "Invalid or expired promo code." },
          { status: 400 }
        );
      }

      if (
        promotion.minOrderAmount != null &&
        subtotal < promotion.minOrderAmount
      ) {
        return NextResponse.json(
          {
            error: `This code requires a minimum order of ${currency} ${promotion.minOrderAmount}.`,
          },
          { status: 400 }
        );
      }

      if (promotion.type === "PERCENT") {
        discountAmount = Math.round((subtotal * promotion.value) / 100);
      } else {
        discountAmount = promotion.value;
      }

      if (discountAmount > subtotal) {
        discountAmount = subtotal;
      }

      promotionId = promotion.id;
    }

    const total = subtotal - discountAmount;

    // 3) Persist Order + OrderItem rows
    const order = await prisma.order.create({
      data: {
        userId: userId ?? null,
        status: "PLACED",
        total,
        currency,
        promotionId,
        items: {
          create: lineItems.map((li) => ({
            productId: li.productId,
            variantId: li.variantId,
            quantity: li.quantity,
            unitPrice: li.unitPrice,
          })),
        },
      },
    });

    // 4) Return info so client can redirect to /checkout/success
    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        status: order.status,
        subtotal,
        discountAmount,
        total,
        currency,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error during checkout." },
      { status: 500 }
    );
  }
}


