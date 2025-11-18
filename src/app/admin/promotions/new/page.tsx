// src/app/admin/promotions/new/page.tsx
import Link from "next/link";

export default function AdminPromotionNewPage() {
  return (
    <main className="mx-auto max-w-xl space-y-6 px-4 py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          New promotion
        </h1>
        <p className="text-sm text-gray-600">
          
        </p>
      </header>

      <section className="rounded-xl border bg-white px-4 py-4 text-sm text-gray-700">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          
        </p>
        <p className="mt-2">
          
        </p>
        <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
          <li>Code (string, unique)</li>
          <li>Type (percent / fixed)</li>
          <li>Value</li>
          <li>Minimum order amount</li>
          <li>Start / end dates</li>
          <li>Active toggle</li>
        </ul>
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
