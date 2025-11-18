// src/app/admin/orders/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15/16: params is a Promise in server components
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isFinite(id)) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      promotion: true,
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const paidStatuses = ["PAID", "SHIPPED", "DELIVERED"] as const;
  const isPaid = paidStatuses.includes(
    order.status as (typeof paidStatuses)[number]
  );

  const lineTotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const discountRaw = lineTotal - order.total;
  const discount = discountRaw > 0 ? discountRaw : 0;

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order #{order.id}
          </h1>
          <p className="text-sm text-gray-600">
            {order.createdAt.toLocaleString()} ·{" "}
            <span className="font-medium">{order.status}</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {isPaid
              ? "Included in revenue analytics."
              : "Not yet counted as paid revenue."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-800 hover:bg-gray-50"
          >
            Back to orders
          </Link>
        </div>
      </header>

      {/* Customer / summary */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white px-4 py-4 text-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Customer
          </h2>
          <p className="mt-2 text-gray-900">
            {order.user?.name ?? order.user?.email ?? "Guest checkout"}
          </p>
          {order.user?.email && (
            <p className="mt-1 text-xs text-gray-500">{order.user.email}</p>
          )}
        </div>
        <div className="rounded-xl border bg-white px-4 py-4 text-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
            Payment &amp; totals
          </h2>
          <dl className="mt-2 space-y-1 text-xs text-gray-700">
            <div className="flex justify-between">
              <dt>Line total</dt>
              <dd>{formatMoney(lineTotal, order.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Discount</dt>
              <dd>
                {discount > 0
                  ? `-${formatMoney(discount, order.currency)}`
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between font-medium">
              <dt>Total</dt>
              <dd>{formatMoney(order.total, order.currency)}</dd>
            </div>
            <div className="flex justify-between pt-1">
              <dt>Status</dt>
              <dd>{order.status}</dd>
            </div>
            <div className="flex justify-between pt-1">
              <dt>Promo</dt>
              <dd>
                {order.promotion
                  ? order.promotion.code.toUpperCase()
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between pt-1">
              <dt>Stripe intent</dt>
              <dd className="truncate">
                {order.stripePaymentIntentId ?? "—"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Items */}
      <section className="rounded-xl border bg-white px-4 py-4 text-sm">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Items
        </h2>
        <div className="mt-3 space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50 px-3 py-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500">
                  Qty {item.quantity}
                  {item.variant && (
                    <>
                      {" · "}
                      {item.variant.size} / {item.variant.color}
                    </>
                  )}
                </p>
              </div>
              <div className="text-right text-xs text-gray-800">
                <p>
                  Unit: {formatMoney(item.unitPrice, order.currency)}
                </p>
                <p className="font-medium">
                  Line:{" "}
                  {formatMoney(
                    item.unitPrice * item.quantity,
                    order.currency
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
