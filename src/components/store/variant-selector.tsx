"use client";

import { useMemo, useState } from "react";
import type { ProductVariant } from "@prisma/client";

type VariantSelectorProps = {
  variants: ProductVariant[];
  currency: string;
};

const LOW_STOCK_THRESHOLD = 3;

export function VariantSelector({ variants, currency }: VariantSelectorProps) {
  if (!variants || variants.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4 text-xs text-amber-200">
        Variant data is missing for this product in the static.
      </div>
    );
  }

  const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const colors = Array.from(new Set(variants.map((v) => v.color)));

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] ?? "");

  const selectedVariant: ProductVariant | undefined = useMemo(() => {
    const exact = variants.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );
    return exact ?? variants[0];
  }, [variants, selectedSize, selectedColor]);

  if (!selectedVariant) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4 text-xs text-amber-200">
        Variant data is missing for this product in the static.
      </div>
    );
  }

  const inStock = selectedVariant.stock > 0;
  const stockLabel = !inStock
    ? "Out of stock"
    : selectedVariant.stock <= LOW_STOCK_THRESHOLD
    ? `Low stock · ${selectedVariant.stock} left`
    : "In stock";

  const stockColorClass = !inStock
    ? "text-rose-300"
    : selectedVariant.stock <= LOW_STOCK_THRESHOLD
    ? "text-amber-300"
    : "text-emerald-300";

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Price and stock row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xl md:text-2xl font-semibold text-slate-50">
          {currency}{" "}
          <span className="tabular-nums">{selectedVariant.price}</span>
        </div>
        <div className="text-xs md:text-sm font-medium flex flex-col items-end gap-1">
          <span className={stockColorClass}>{stockLabel}</span>
          <span className="text-[11px] text-slate-400">
            SKU: {selectedVariant.sku}
          </span>
        </div>
      </div>

      {/* Size selector */}
      <div className="space-y-2">
        <p className="text-xs md:text-sm text-slate-200 font-medium">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isActive = size === selectedSize;
            const disabledForAllColors = !variants.some(
              (v) => v.size === size && v.stock > 0
            );

            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                disabled={disabledForAllColors}
                className={[
                  "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs md:text-sm font-medium transition-colors",
                  disabledForAllColors
                    ? "border-slate-700 text-slate-500 cursor-not-allowed opacity-50"
                    : isActive
                    ? "border-fuchsia-400 bg-fuchsia-500/10 text-fuchsia-100"
                    : "border-slate-700 text-slate-100 hover:border-fuchsia-400 hover:text-fuchsia-200",
                ].join(" ")}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color selector */}
      <div className="space-y-2">
        <p className="text-xs md:text-sm text-slate-200 font-medium">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const isActive = color === selectedColor;
            const disabledForAllSizes = !variants.some(
              (v) => v.color === color && v.stock > 0
            );

            return (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                disabled={disabledForAllSizes}
                className={[
                  "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-[11px] md:text-xs font-medium transition-colors",
                  disabledForAllSizes
                    ? "border-slate-700 text-slate-500 cursor-not-allowed opacity-50"
                    : isActive
                    ? "border-fuchsia-400 bg-fuchsia-500/10 text-fuchsia-100"
                    : "border-slate-700 text-slate-100 hover:border-fuchsia-400 hover:text-fuchsia-200",
                ].join(" ")}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!inStock}
          className={[
            "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm md:text-base font-semibold transition-colors",
            inStock
              ? "bg-fuchsia-500 text-slate-950 hover:bg-fuchsia-400"
              : "bg-slate-800 text-slate-500 cursor-not-allowed",
          ].join(" ")}
        >
          {inStock ? "Add to cart" : "Out of stock"}
        </button>
        <p className="text-[11px] md:text-xs text-slate-400">
          Cart and Stripe checkout come later. Right now this button only
          reflects stock for the selected variant.
        </p>
      </div>
    </div>
  );
}

