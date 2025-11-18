// src/app/admin/orders/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      promotion: true,
      items: true,
    },
  });

  return orders.map((order) => {
    const lineTotal = order.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const discountRaw = lineTotal - order.total;
    const discount = discountRaw > 0 ? discountRaw : 0;

    return {
      ...order,
      lineTotal,
      discount,
    };
  });
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-gray-600">
          Recent orders, including any applied promotion codes and
          discounts. Tap an order ID to see full details.
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2 text-left">Order</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Promo</th>
              <th className="px-4 py-2 text-right">Line total</th>
              <th className="px-4 py-2 text-right">Discount</th>
              <th className="px-4 py-2 text-right">Final total</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No orders yet.
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <tr key={order.id} className="border-t text-gray-800">
                <td className="px-4 py-2 text-xs text-gray-700">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-mono underline-offset-2 hover:underline"
                  >
                    #{order.id}
                  </Link>
                </td>
                <td className="px-4 py-2 text-xs">
                  {order.user?.name ?? order.user?.email ?? "Guest"}
                </td>
                <td className="px-4 py-2 text-xs">{order.status}</td>
                <td className="px-4 py-2 text-xs">
                  {order.promotion
                    ? order.promotion.code.toUpperCase()
                    : "—"}
                </td>
                <td className="px-4 py-2 text-xs text-right">
                  {order.lineTotal} {order.currency}
                </td>
                <td className="px-4 py-2 text-xs text-right text-emerald-600">
                  {order.discount > 0
                    ? `-${order.discount} ${order.currency}`
                    : "—"}
                </td>
                <td className="px-4 py-2 text-xs text-right font-medium">
                  {order.total} {order.currency}
                </td>
                <td className="px-4 py-2 text-xs text-gray-500">
                  {order.createdAt.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right text-xs">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 px-3 py-1.5 font-medium hover:bg-gray-50"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

