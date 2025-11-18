// src/app/admin/analytics/products/page.tsx
import { prisma } from "@/lib/prisma";

function formatMoney(amount: number, currency = "USD") {
  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export default async function AdminAnalyticsProductsPage() {
  const items = await prisma.orderItem.findMany({
    include: {
      product: true,
      order: true,
    },
  });

  const paidStatuses = ["PAID", "SHIPPED", "DELIVERED"] as const;

  const byProduct = new Map<
    number,
    {
      id: number;
      name: string;
      slug: string;
      revenue: number;
      quantity: number;
      currency: string;
    }
  >();

  for (const item of items) {
    if (
      !paidStatuses.includes(
        item.order.status as (typeof paidStatuses)[number]
      )
    ) {
      continue;
    }

    const revenue = item.unitPrice * item.quantity;
    const existing = byProduct.get(item.productId);
    if (existing) {
      existing.revenue += revenue;
      existing.quantity += item.quantity;
    } else {
      byProduct.set(item.productId, {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        revenue,
        quantity: item.quantity,
        currency: item.order.currency,
      });
    }
  }

  const topProducts = Array.from(byProduct.values()).sort(
    (a, b) => b.revenue - a.revenue
  );

  const currency = topProducts[0]?.currency ?? "USD";

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Top products by revenue
        </h1>
        <p className="text-sm text-gray-600">
          Aggregated from paid / shipped / delivered orders. Use this to sanity
          check data and see which SKUs sell the most.
        </p>
      </header>

      <section className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Product</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-right">Revenue</th>
              <th className="px-3 py-2 text-right">Units sold</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-6 text-center text-gray-500"
                >
                  No paid orders yet. Complete a few checkouts to populate
                  this table.
                </td>
              </tr>
            )}
            {topProducts.map((prod) => (
              <tr key={prod.id} className="border-t text-gray-800">
                <td className="px-3 py-2 text-xs font-medium">
                  {prod.name}
                </td>
                <td className="px-3 py-2 text-xs text-gray-500">
                  {prod.slug}
                </td>
                <td className="px-3 py-2 text-right text-xs">
                  {formatMoney(prod.revenue, currency)}
                </td>
                <td className="px-3 py-2 text-right text-xs">
                  {prod.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
