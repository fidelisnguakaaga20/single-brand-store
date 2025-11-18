// src/app/checkout/cancel/page.tsx
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        Payment cancelled
      </h1>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-8 text-sm text-slate-200">
        <p>Your Stripe test payment was cancelled or not completed.</p>
        <p className="mt-2 text-slate-400">
          You can review your cart, adjust quantities, or try checking out
          again. No real money is charged in this.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
          >
            Back to cart
          </Link>
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:border-slate-500"
          >
            Try checkout again
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:border-slate-500"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
