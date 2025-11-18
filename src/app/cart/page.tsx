"use client";

import Link from "next/link";
import { useCart } from "@/app/cart-provider";
import { CheckoutButton } from "@/components/CheckoutButton";

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(0)}`;
}

export default function CartPage() {
  const {
    items,
    totalAmount,
    totalQuantity,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const currency = items[0]?.currency ?? "USD";

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-10 text-center text-sm text-slate-300">
          <p>Your cart is empty.</p>
          <p className="mt-2">
            Browse the catalog and add a product to see it appear here.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/shop"
              className="rounded-full bg-slate-50 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200"
            >
              Go to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
      {/* Items */}
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Your cart</h1>
        <p className="text-sm text-slate-400">
          {totalQuantity} item{totalQuantity === 1 ? "" : "s"} in your cart.
        </p>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center"
            >
              <div className="flex-1 space-y-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {item.name}
                </Link>
                <div className="text-xs text-slate-400">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.size && item.color && <span className="mx-1">•</span>}
                  {item.color && <span>Color: {item.color}</span>}
                </div>
                <p className="text-sm font-medium">
                  {formatMoney(item.price, item.currency)}
                </p>
              </div>

              <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                {/* Quantity stepper */}
                <div className="flex items-center rounded-full border border-slate-700 bg-slate-950 px-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="px-3 py-2 text-sm text-slate-200"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={item.maxQuantity ?? undefined}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.id,
                        Number.isNaN(parseInt(e.target.value, 10))
                          ? 1
                          : parseInt(e.target.value, 10)
                      )
                    }
                    className="w-12 bg-transparent text-center text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.maxQuantity != null
                          ? Math.min(item.maxQuantity, item.quantity + 1)
                          : item.quantity + 1
                      )
                    }
                    className="px-3 py-2 text-sm text-slate-200"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-slate-400 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-slate-400 hover:text-red-400"
        >
          Clear cart
        </button>
      </section>

      {/* Summary */}
      <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <h2 className="text-lg font-semibold">Order summary</h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal</span>
            <span>{formatMoney(totalAmount, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-sm font-medium">
          <span>Total</span>
          <span>{formatMoney(totalAmount, currency)}</span>
        </div>

        <CheckoutButton
          items={items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            quantity: item.quantity,
          }))}
          total={totalAmount}
          currency={currency}
        />

        <p className="text-xs text-slate-500">

        </p>

        <Link
          href="/checkout"
          className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-100 hover:border-slate-500"
        >
          Go to checkout
        </Link>
      </aside>
    </div>
  );
}

