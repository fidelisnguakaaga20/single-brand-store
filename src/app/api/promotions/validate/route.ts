// src/app/api/promotions/validate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type CheckoutItem = {
  productId: number;
  variantId?: number | null;
  quantity: number;
};

async function computeCartSubtotal(items: CheckoutItem[]) {
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

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) continue;

    const variant = item.variantId ? variantMap.get(item.variantId) : null;
    const unitPrice = variant?.price ?? product.basePrice;

    subtotal += unitPrice * item.quantity;

    if (!currency) {
      currency = product.currency || "USD";
    }
  }

  return { subtotal, currency: currency ?? "USD" };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const codeRaw = body.code as string | undefined;
    const items = body.items as CheckoutItem[] | undefined;

    if (!codeRaw || typeof codeRaw !== "string") {
      return NextResponse.json(
        { error: "Promo code is required." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided to validate promotion." },
        { status: 400 }
      );
    }

    const now = new Date();
    const normalizedCode = codeRaw.trim().toUpperCase();

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

    const { subtotal, currency } = await computeCartSubtotal(items);

    if (subtotal <= 0) {
      return NextResponse.json(
        { error: "Cart subtotal must be greater than zero." },
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

    let discountAmount = 0;

    if (promotion.type === "PERCENT") {
      discountAmount = Math.round((subtotal * promotion.value) / 100);
    } else {
      discountAmount = promotion.value;
    }

    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    const totalAfterDiscount = subtotal - discountAmount;

    return NextResponse.json({
      promotion: {
        id: promotion.id,
        code: promotion.code,
        type: promotion.type,
        value: promotion.value,
        minOrderAmount: promotion.minOrderAmount,
      },
      currency,
      subtotal,
      discountAmount,
      totalAfterDiscount,
    });
  } catch (error) {
    console.error("[PROMOTION_VALIDATE_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to validate promotion." },
      { status: 500 }
    );
  }
}


