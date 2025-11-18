// src/app/admin/promotions/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminPromotionDetailPage({
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

  const promo = await prisma.promotion.findUnique({
    where: { id },
    include: {
      orders: true,
    },
  });

  // If the promotion doesn't exist, show a friendly message instead of 404
  if (!promo) {
    return (
      <main className="mx-auto max-w-xl space-y-6 px-4 py-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            No Promotion Yet
          </h1>
          <p className="text-sm text-gray-600">
            There is no promotion with this ID in the database yet. This route
            is wired correctly; seed or create a promo to see full details.
          </p>
        </header>

        <div className="rounded-xl border bg-white px-4 py-4 text-sm text-gray-700">
          <p className="text-xs text-gray-600">
            Use the Promotions list or your Prisma seed script / DB UI to add
            a promotion, then revisit this page with the correct ID.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/promotions"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-800 hover:bg-gray-50"
          >
            Back to promotions
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Promotion {promo.code.toUpperCase()}
        </h1>
        <p className="text-sm text-gray-600">
          Basic overview of this discount. You can extend this later with edit
          controls or order breakdowns.
        </p>
      </header>

      <section className="rounded-xl border bg-white px-4 py-4 text-sm text-gray-800">
        <dl className="space-y-2 text-xs">
          <div className="flex justify-between">
            <dt>Code</dt>
            <dd className="font-mono">{promo.code}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Type</dt>
            <dd>{promo.type}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Value</dt>
            <dd>
              {promo.type === "PERCENT"
                ? `${promo.value}%`
                : promo.value.toString()}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Min order amount</dt>
            <dd>{promo.minOrderAmount ?? "—"}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Active</dt>
            <dd>{promo.isActive ? "Yes" : "No"}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Starts</dt>
            <dd>
              {promo.startsAt
                ? promo.startsAt.toISOString().slice(0, 10)
                : "—"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Ends</dt>
            <dd>
              {promo.endsAt
                ? promo.endsAt.toISOString().slice(0, 10)
                : "—"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Linked orders</dt>
            <dd>{promo.orders.length}</dd>
          </div>
        </dl>
      </section>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/promotions"
          className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-800 hover:bg-gray-50"
        >
          Back to promotions
        </Link>
      </div>
    </main>
  );
}

