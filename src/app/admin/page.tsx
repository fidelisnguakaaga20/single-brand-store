// src/app/admin/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatMoney(amount: number, currency = "USD") {
  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export default async function AdminHomePage() {
  const [orders, productCount, promotionsCount] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count(),
    prisma.promotion.count(),
  ]);

  const totalOrders = orders.length;
  const activeOrders = orders.filter(
    (order) => order.status !== "CANCELLED"
  ).length;

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

  let totalRevenue = 0;
  let last7DaysRevenue = 0;
  let todayRevenue = 0;

  for (const order of paidOrders) {
    totalRevenue += order.total;

    if (order.createdAt >= sevenDaysAgo) {
      last7DaysRevenue += order.total;
    }

    if (order.createdAt >= startOfToday) {
      todayRevenue += order.total;
    }
  }

  const todayOrders = paidOrders.filter(
    (order) => order.createdAt >= startOfToday
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Admin overview
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Live snapshot pulled directly from Orders, Products and Promotions
            tables.
          </p>
        </div>
        <div className="text-right text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
          <p>Stage 8</p>
          <p className="mt-0.5 text-[0.65rem] tracking-[0.2em]">
            Analytics &amp; overview
          </p>
        </div>
      </div>

      {/* Top metric cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Total revenue */}
        <section className="rounded-xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            Total revenue
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {formatMoney(totalRevenue, currency)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Sum of all paid / shipped / delivered orders.
          </p>
        </section>

        {/* Orders count */}
        <section className="rounded-xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            Orders
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {totalOrders}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {activeOrders} active · {totalOrders - activeOrders} cancelled
          </p>
        </section>

        {/* Today */}
        <section className="rounded-xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            Today
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {formatMoney(todayRevenue, currency)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {todayOrders} paid order{todayOrders === 1 ? "" : "s"} since
            midnight.
          </p>
        </section>

        {/* Catalog & promos */}
        <section className="rounded-xl border bg-white px-4 py-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
            Catalog &amp; promos
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {productCount}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Products in catalog · {promotionsCount} promo
            {promotionsCount === 1 ? "" : "s"} configured.
          </p>
        </section>
      </div>

      {/* Revenue last 7 days */}
      <section className="rounded-xl border bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
              Revenue (last 7 days)
            </p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {formatMoney(last7DaysRevenue, currency)}
            </p>
          </div>
          <div className="text-xs text-gray-500">
            <p>
              Includes all paid / shipped / delivered orders created in the last
              7 days.
            </p>
            <p className="mt-1">
              Use the Orders page to drill into individual customers and
              receipts.
            </p>
          </div>
        </div>
      </section>

      {/* Quick navigation actions */}
      <section className="rounded-xl border bg-white px-4 py-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
              Next actions
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Jump into orders, tune promotions, or sanity-check recent
              activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/orders"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-gray-700"
            >
              View all orders
            </Link>
            <Link
              href="/admin/promotions"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-800 hover:bg-gray-50"
            >
              Manage promotions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

