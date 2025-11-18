// src/app/admin/analytics/page.tsx
import { prisma } from "@/lib/prisma";

function formatMoney(amount: number, currency = "USD") {
  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export default async function AdminAnalyticsPage() {
  const [orders, productCount, collectionCount] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count(),
    prisma.collection.count(),
  ]);

  const paidStatuses = ["PAID", "SHIPPED", "DELIVERED"] as const;
  const paidOrders = orders.filter((order) =>
    paidStatuses.includes(order.status as (typeof paidStatuses)[number])
  );

  const currency =
    paidOrders[0]?.currency ?? orders[0]?.currency ?? "USD";

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const sevenDaysAgo = new Date(startOfToday);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const thirtyDaysAgo = new Date(startOfToday);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  let revenueLast7 = 0;
  let revenueLast30 = 0;
  let totalRevenue = 0;

  for (const order of paidOrders) {
    totalRevenue += order.total;
    if (order.createdAt >= sevenDaysAgo) {
      revenueLast7 += order.total;
    }
    if (order.createdAt >= thirtyDaysAgo) {
      revenueLast30 += order.total;
    }
  }

  const ordersLast7 = paidOrders.filter(
    (o) => o.createdAt >= sevenDaysAgo
  ).length;

  const avgOrderValue =
    paidOrders.length > 0
      ? totalRevenue / paidOrders.length
      : 0;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Analytics overview
        </h1>
        <p className="text-sm text-gray-600">
          High-level snapshot of revenue and order performance, powered by the
          Orders table.
        </p>
      </header>

      {/* KPI cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            Revenue (last 7 days)
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {formatMoney(revenueLast7, currency)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {ordersLast7} paid order
            {ordersLast7 === 1 ? "" : "s"} in the last week.
          </p>
        </div>

        <div className="rounded-xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            Revenue (last 30 days)
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {formatMoney(revenueLast30, currency)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Based on paid / shipped / delivered orders only.
          </p>
        </div>

        <div className="rounded-xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            Average order value
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {formatMoney(avgOrderValue, currency)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Across all paid orders to date.
          </p>
        </div>

        <div className="rounded-xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            Catalog footprint
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {productCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Products · {collectionCount} collections
          </p>
        </div>
      </section>

      {/* Hint to drill into products */}
      <section className="rounded-xl border bg-white px-4 py-4 text-sm text-gray-700">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          Next step
        </p>
        <p className="mt-2">
          Use the{" "}
          <span className="font-semibold">Top products</span> view to see which
          items drive the most revenue:
        </p>
        <p className="mt-1 text-xs text-gray-600">
          Go to{" "}
          <code className="rounded bg-gray-100 px-1">
            /admin/analytics/products
          </code>{" "}
          from the sidebar or by typing the URL directly.
        </p>
      </section>
    </main>
  );
}
