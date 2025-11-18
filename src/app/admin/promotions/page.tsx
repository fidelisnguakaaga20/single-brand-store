// src/app/admin/promotions/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Promotions</h1>
          <p className="text-sm text-gray-600">
            These promo codes can be applied on the checkout page. Creation /
            editing flows start here.
          </p>
        </div>
        <Link
          href="/admin/promotions/new"
          className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-gray-700"
        >
          New promotion
        </Link>
      </header>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Code</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-right">Value</th>
              <th className="px-3 py-2 text-right">Min order</th>
              <th className="px-3 py-2 text-left">Active</th>
              <th className="px-3 py-2 text-left">Starts</th>
              <th className="px-3 py-2 text-left">Ends</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-6 text-center text-gray-500"
                >
                  No promotions yet. Seed some via Prisma or create them from
                  this admin area later.
                </td>
              </tr>
            )}
            {promotions.map((promo) => (
              <tr key={promo.id} className="border-t text-gray-800">
                <td className="px-3 py-2 text-xs">
                  <Link
                    href={`/admin/promotions/${promo.id}`}
                    className="font-mono underline-offset-2 hover:underline"
                  >
                    {promo.code.toUpperCase()}
                  </Link>
                </td>
                <td className="px-3 py-2 text-xs">{promo.type}</td>
                <td className="px-3 py-2 text-right text-xs">
                  {promo.type === "PERCENT"
                    ? `${promo.value}%`
                    : promo.value.toString()}
                </td>
                <td className="px-3 py-2 text-right text-xs">
                  {promo.minOrderAmount ?? "—"}
                </td>
                <td className="px-3 py-2 text-xs">
                  {promo.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-3 py-2 text-xs">
                  {promo.startsAt
                    ? promo.startsAt.toISOString().slice(0, 10)
                    : "—"}
                </td>
                <td className="px-3 py-2 text-xs">
                  {promo.endsAt
                    ? promo.endsAt.toISOString().slice(0, 10)
                    : "—"}
                </td>
                <td className="px-3 py-2 text-right text-xs">
                  <Link
                    href={`/admin/promotions/${promo.id}`}
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
    </div>
  );
}
