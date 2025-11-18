"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export type ProductCardModel = {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  tagLine: string | null;
  isNew: boolean;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
};

type ProductCardProps = {
  product: ProductCardModel;
  index?: number;
};

const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      delay: i * 0.04,
      ease: "easeOut",
    },
  }),
};

function getBadgeLabel(p: ProductCardModel): string | null {
  if (p.isLimitedEdition) return "Limited";
  if (p.isBestSeller) return "Best Seller";
  if (p.isNew) return "New";
  return null;
}

function getProductImageSrc(slug: string) {
  // maps directly to /public/images/products/<slug>-1.avif
  return `/images/products/${slug}-1.png`;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const badge = getBadgeLabel(product);

  return (
    <motion.article
      className="group flex flex-col rounded-3xl border border-slate-800 bg-slate-900/40 overflow-hidden hover:border-fuchsia-500/60 transition-colors"
      variants={variants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900">
          {/* Real product image */}
          <Image
            src={getProductImageSrc(product.slug)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />

          {/* Glow overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-[radial-gradient(circle_at_20%_20%,rgba(248,250,252,0.4),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(251,113,133,0.45),transparent_55%)]" />

          {/* Badge */}
          {badge && (
            <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-fuchsia-300">
              {badge}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-sm md:text-base font-semibold leading-snug">
              <Link
                href={`/product/${product.slug}`}
                className="hover:text-fuchsia-300 transition-colors"
              >
                {product.name}
              </Link>
            </h3>
            {product.tagLine && (
              <p className="text-[11px] md:text-xs text-slate-400 line-clamp-2">
                {product.tagLine}
              </p>
            )}
          </div>
          <div className="text-right text-sm md:text-base font-semibold text-slate-50">
            {product.currency}{" "}
            <span className="tabular-nums">{product.price}</span>
          </div>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            In stock
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="text-[11px] font-medium text-fuchsia-300 hover:text-fuchsia-200"
          >
            View product →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

