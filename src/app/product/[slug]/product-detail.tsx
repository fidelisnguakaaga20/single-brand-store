"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/app/cart-provider";

type Variant = {
  id: number;
  productId: number;
  sku: string;
  size: string | null;
  color: string | null;
  price: number;
  stock: number;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  tagLine: string | null;
  basePrice: number;
  currency: string;
  isNew: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  onSale: boolean;
  variants: Variant[];
};

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(0)}`;
}

function getProductImageSrc(slug: string) {
  // same naming convention as the card
  return `/images/products/${slug}-1.png`;
}

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();

  const sizes = useMemo(
    () =>
      Array.from(
        new Set(product.variants.map((v) => v.size).filter(Boolean))
      ) as string[],
    [product.variants]
  );

  const colors = useMemo(
    () =>
      Array.from(
        new Set(product.variants.map((v) => v.color).filter(Boolean))
      ) as string[],
    [product.variants]
  );

  const [size, setSize] = useState<string | null>(sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const [quantity, setQuantity] = useState(1);

  const activeVariant = useMemo(() => {
    return (
      product.variants.find((v) => {
        const sizeOk = sizes.length ? v.size === size : true;
        const colorOk = colors.length ? v.color === color : true;
        return sizeOk && colorOk;
      }) ||
      product.variants[0] ||
      null
    );
  }, [product.variants, size, color, sizes.length, colors.length]);

  const price = activeVariant?.price ?? product.basePrice;
  const stock = activeVariant?.stock ?? 0;

  let stockLabel = "Out of stock";
  if (stock > 10) stockLabel = "In stock";
  else if (stock > 0) stockLabel = "Low stock";

  const canAddToCart = stock > 0;

  function handleAddToCart() {
    if (!activeVariant || !canAddToCart) return;

    const safeQty = Math.max(1, Math.min(quantity, stock));

    addItem({
      id: `${product.id}-${activeVariant.id}`,
      productId: product.id,
      variantId: activeVariant.id,
      name: product.name,
      slug: product.slug,
      price,
      currency: product.currency,
      quantity: safeQty,
      maxQuantity: stock,
      size: activeVariant.size,
      color: activeVariant.color,
    });

    setQuantity(1);
  }

  return (
    <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-start">
      {/* Product image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <Image
          src={getProductImageSrc(product.slug)}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 40vw, 100vw"
        />

        {product.isLimitedEdition && (
          <span className="absolute left-4 top-4 rounded-full bg-fuchsia-500 px-3 py-1 text-xs font-semibold text-slate-950">
            Limited Edition
          </span>
        )}

        {product.isBestSeller && !product.isLimitedEdition && (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-400 px-3 py-1 text-xs font-semibold text-slate-950">
            Best Seller
          </span>
        )}

        {product.isNew &&
          !product.isBestSeller &&
          !product.isLimitedEdition && (
            <span className="absolute left-4 top-4 rounded-full bg-sky-400 px-3 py-1 text-xs font-semibold text-slate-950">
              New
            </span>
          )}
      </div>

      {/* Details */}
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Single Brand Store ·
          </p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {product.name}
          </h1>
          {product.tagLine && (
            <p className="text-sm text-slate-300">{product.tagLine}</p>
          )}
        </div>

        <p className="text-sm leading-relaxed text-slate-300">
          {product.description}
        </p>

        <div className="flex items-baseline justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-400">Price</p>
            <p className="text-2xl font-semibold">
              {formatMoney(price, product.currency)}
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p>{stockLabel}</p>
            {activeVariant?.sku && (
              <p className="mt-1">SKU: {activeVariant.sku}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {sizes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-200">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sizeOption) => (
                  <button
                    key={sizeOption}
                    type="button"
                    onClick={() => setSize(sizeOption)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      size === sizeOption
                        ? "border-slate-50 bg-slate-50 text-slate-950"
                        : "border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500"
                    }`}
                  >
                    {sizeOption}
                  </button>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-200">Color</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() => setColor(colorOption)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      color === colorOption
                        ? "border-slate-50 bg-slate-50 text-slate-950"
                        : "border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500"
                    }`}
                  >
                    {colorOption}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            {/* Quantity stepper */}
            <div className="flex items-center rounded-full border border-slate-700 bg-slate-950 px-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-sm text-slate-200"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={stock || undefined}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
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
                  setQuantity((q) =>
                    stock ? Math.min(stock, q + 1) : q + 1
                  )
                }
                className="px-3 py-2 text-sm text-slate-200"
              >
                +
              </button>
            </div>

            {/* Add to cart button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
            >
              {canAddToCart ? "Add to cart" : "Out of stock"}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            This is a cart running in your browser for Stage 5. In the next
            step, we will connect this cart to Stripe Checkout and persist
            orders in the database.
          </p>
        </div>
      </div>
    </section>
  );
}


