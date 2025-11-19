"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export type ProductCardModel = {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: string;
  tagLine?: string | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  isLimitedEdition?: boolean;
};

type ProductCardProps = {
  product: ProductCardModel;
  index: number;
};

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.article
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 transition-colors hover:border-fuchsia-500/60"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: EASE_OUT, // typed tuple, no TS error
      }}
    >
      {/* Image / visual placeholder (AI images come later) */}
      <div className="relative aspect-[4/5] w-full bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black opacity-90" />
        <div className="relative flex h-full items-center justify-center px-4 text-center">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300">
            Product image coming in polish stage
          </span>
        </div>

        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-emerald-950">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-amber-950">
            Best seller
          </span>
        )}
        {product.isLimitedEdition && (
          <span className="absolute bottom-3 left-3 rounded-full border border-fuchsia-400/70 bg-fuchsia-500/20 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-fuchsia-100">
            Limited
          </span>
        )}
      </div>

      {/* Text content */}
      <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-2">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold text-slate-50 hover:underline"
        >
          {product.name}
        </Link>

        {product.tagLine && (
          <p className="line-clamp-2 text-[0.75rem] text-slate-400">
            {product.tagLine}
          </p>
        )}

        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-50">
            {formatMoney(product.price, product.currency)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { motion } from "framer-motion";

// export type ProductCardModel = {
//   id: number;
//   name: string;
//   slug: string;
//   price: number;
//   currency: string;
//   tagLine: string | null;
//   isNew: boolean;
//   isBestSeller: boolean;
//   isLimitedEdition: boolean;
// };

// type ProductCardProps = {
//   product: ProductCardModel;
//   index?: number;
// };

// const variants = {
//   hidden: { opacity: 0, y: 16 },
//   visible: (i: number) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.35,
//       delay: i * 0.04,
//       ease: [0.16, 1, 0.3, 1]
//     },
//   }),
// };

// function getBadgeLabel(p: ProductCardModel): string | null {
//   if (p.isLimitedEdition) return "Limited";
//   if (p.isBestSeller) return "Best Seller";
//   if (p.isNew) return "New";
//   return null;
// }

// function getProductImageSrc(slug: string) {
//   // maps directly to /public/images/products/<slug>-1.avif
//   return `/images/products/${slug}-1.png`;
// }

// export function ProductCard({ product, index = 0 }: ProductCardProps) {
//   const badge = getBadgeLabel(product);

//   return (
//     <motion.article
//       className="group flex flex-col rounded-3xl border border-slate-800 bg-slate-900/40 overflow-hidden hover:border-fuchsia-500/60 transition-colors"
//       variants={variants}
//       initial="hidden"
//       animate="visible"
//       custom={index}
//     >
//       <Link href={`/product/${product.slug}`} className="block">
//         <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900">
//           {/* Real product image */}
//           <Image
//             src={getProductImageSrc(product.slug)}
//             alt={product.name}
//             fill
//             className="object-cover transition-transform duration-500 group-hover:scale-105"
//             sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
//           />

//           {/* Glow overlay */}
//           <div className="pointer-events-none absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-[radial-gradient(circle_at_20%_20%,rgba(248,250,252,0.4),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(251,113,133,0.45),transparent_55%)]" />

//           {/* Badge */}
//           {badge && (
//             <span className="absolute right-4 top-4 inline-flex items-center rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-fuchsia-300">
//               {badge}
//             </span>
//           )}
//         </div>
//       </Link>

//       {/* Content */}
//       <div className="flex flex-1 flex-col gap-2 p-4">
//         <div className="flex items-start justify-between gap-2">
//           <div className="space-y-1">
//             <h3 className="text-sm md:text-base font-semibold leading-snug">
//               <Link
//                 href={`/product/${product.slug}`}
//                 className="hover:text-fuchsia-300 transition-colors"
//               >
//                 {product.name}
//               </Link>
//             </h3>
//             {product.tagLine && (
//               <p className="text-[11px] md:text-xs text-slate-400 line-clamp-2">
//                 {product.tagLine}
//               </p>
//             )}
//           </div>
//           <div className="text-right text-sm md:text-base font-semibold text-slate-50">
//             {product.currency}{" "}
//             <span className="tabular-nums">{product.price}</span>
//           </div>
//         </div>

//         <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-400">
//           <span className="inline-flex items-center gap-1">
//             <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
//             In stock
//           </span>
//           <Link
//             href={`/product/${product.slug}`}
//             className="text-[11px] font-medium text-fuchsia-300 hover:text-fuchsia-200"
//           >
//             View product →
//           </Link>
//         </div>
//       </div>
//     </motion.article>
//   );
// }

