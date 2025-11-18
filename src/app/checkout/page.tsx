"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/app/cart-provider";
import { CheckoutButton } from "@/components/CheckoutButton";

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(0)}`;
}

type AppliedPromo = {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  currency: string;
  subtotal: number;
  discountAmount: number;
  totalAfterDiscount: number;
};

export default function CheckoutPage() {
  const { items, totalAmount, totalQuantity } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

  const currency = items[0]?.currency ?? "USD";

  async function handleApplyPromo() {
    if (items.length === 0) {
      setPromoError("Your cart is empty.");
      return;
    }

    const trimmed = promoCode.trim();
    if (!trimmed) {
      setPromoError("Enter a promo code.");
      return;
    }

    try {
      setPromoLoading(true);
      setPromoError(null);

      const payload = {
        code: trimmed,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setAppliedPromo(null);
        setPromoError(data?.error ?? "Unable to apply promo code.");
        return;
      }

      setAppliedPromo({
        code: data.promotion.code,
        type: data.promotion.type,
        value: data.promotion.value,
        currency: data.currency ?? currency,
        subtotal: data.subtotal,
        discountAmount: data.discountAmount,
        totalAfterDiscount: data.totalAfterDiscount,
      });
      setPromoError(null);
    } catch (err) {
      console.error(err);
      setAppliedPromo(null);
      setPromoError("Unexpected error while applying promo code.");
    } finally {
      setPromoLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Checkout
        </h1>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-8 text-sm text-slate-300">
          <p>Your cart is currently empty.</p>
          <p className="mt-2">
            Start by adding a product to your cart, then return here to place a
             order.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
            >
              Go to shop
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:border-slate-500"
            >
              View cart
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const displaySubtotal =
    appliedPromo?.subtotal != null ? appliedPromo.subtotal : totalAmount;
  const displayDiscount = appliedPromo?.discountAmount ?? 0;
  const displayTotal =
    appliedPromo?.totalAfterDiscount != null
      ? appliedPromo.totalAfterDiscount
      : totalAmount;

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
      {/* Left: items overview (mobile-first) */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Checkout
        </h1>
        <p className="text-sm text-slate-400">
          {totalQuantity} item{totalQuantity === 1 ? "" : "s"} ·{" "}
          {formatMoney(totalAmount, currency)}
        </p>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {item.name}
                </Link>
                <div className="text-xs text-slate-400">
                  <span>Qty: {item.quantity}</span>
                  {(item.size || item.color) && <span className="mx-1">•</span>}
                  {item.size && <span>Size: {item.size}</span>}
                  {item.size && item.color && <span className="mx-1">•</span>}
                  {item.color && <span>Color: {item.color}</span>}
                </div>
              </div>
              <div className="text-right text-sm font-medium">
                {formatMoney(item.price * item.quantity, item.currency)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: summary + promo + Place order button */}
      <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <h2 className="text-lg font-semibold">Order summary</h2>

        {/* Promo code card */}
        <div className="space-y-2 rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
          <label
            htmlFor="promoCode"
            className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-400"
          >
            Promo code
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="promoCode"
              name="promoCode"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code e.g. WELCOME10"
              className="flex-1 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none placeholder:text-slate-500 focus:border-slate-400"
            />
            <button
              type="button"
              onClick={handleApplyPromo}
              disabled={promoLoading}
              className="inline-flex items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {promoLoading ? "Applying…" : "Apply"}
            </button>
          </div>
          {promoError && (
            <p className="text-xs text-rose-400" role="alert">
              {promoError}
            </p>
          )}
          {appliedPromo && !promoError && (
            <p className="text-xs text-emerald-300">
              Code{" "}
              <span className="font-semibold">{appliedPromo.code}</span>{" "}
              applied —{" "}
              {appliedPromo.type === "PERCENT"
                ? `${appliedPromo.value}% off`
                : `${appliedPromo.currency} ${appliedPromo.value} off`}
              .
            </p>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal</span>
            <span>{formatMoney(displaySubtotal, currency)}</span>
          </div>

          {displayDiscount > 0 && (
            <div className="flex justify-between text-emerald-300">
              <span>Discount</span>
              <span>-{formatMoney(displayDiscount, currency)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-400">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-sm font-medium">
          <span>Total</span>
          <span>{formatMoney(displayTotal, currency)}</span>
        </div>

        <CheckoutButton
          items={items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            quantity: item.quantity,
          }))}
          total={displayTotal}
          currency={currency}
          promoCode={appliedPromo?.code ?? null}
        />

        <p className="text-xs text-slate-500">
          This is a checkout: an order is saved in your database, and
          you&apos;re redirected to a success page. Stripe card payments can be
          wired on top later.
        </p>

        <div className="flex flex-wrap gap-2 text-[0.7rem] text-slate-500">
          <Link
            href="/cart"
            className="rounded-full border border-slate-700 px-3 py-1.5 font-medium hover:border-slate-500"
          >
            Back to cart
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-slate-700 px-3 py-1.5 font-medium hover:border-slate-500"
          >
            Continue shopping
          </Link>
        </div>
      </aside>
    </section>
  );
}

