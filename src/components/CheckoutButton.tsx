// src/components/CheckoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CheckoutItem = {
  productId: number;
  variantId: number | null;
  quantity: number;
};

type CheckoutButtonProps = {
  items: CheckoutItem[];
  total: number;
  currency: string;
  promoCode?: string | null;
};

export function CheckoutButton({
  items,
  total,
  currency,
  promoCode,
}: CheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          promoCode: promoCode ?? null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Checkout failed.");
        return;
      }

      if (!data?.orderId) {
        setError("Missing orderId in checkout response.");
        return;
      }

      router.push(`/checkout/success?orderId=${data.orderId}`);
    } catch (err) {
      console.error("CheckoutButton error:", err);
      setError("Unexpected error during checkout.");
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !items.length || total <= 0;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Placing order…" : `Place demo order (${currency} ${total.toFixed(0)})`}
      </button>
      {error && (
        <p className="text-xs text-rose-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

