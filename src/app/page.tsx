import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ProductCard,
  type ProductCardModel,
} from "@/components/store/product-card";

function toCardModel(p: any): ProductCardModel {
  const variantPrices = p.variants?.map((v: any) => v.price) ?? [];
  const price =
    variantPrices.length > 0 ? Math.min(...variantPrices) : p.basePrice;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price,
    currency: p.currency,
    tagLine: p.tagLine,
    isNew: p.isNew,
    isBestSeller: p.isBestSeller,
    isLimitedEdition: p.isLimitedEdition,
  };
}

export default async function HomePage() {
  const [newArrivalsRaw, bestSellersRaw, limitedRaw] = await Promise.all([
    prisma.product.findMany({
      where: { isNew: true },
      include: { variants: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isBestSeller: true },
      include: { variants: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isLimitedEdition: true },
      include: { variants: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const newArrivals = newArrivalsRaw.map(toCardModel);
  const bestSellers = bestSellersRaw.map(toCardModel);
  const limited = limitedRaw.map(toCardModel);

  return (
    <section className="flex flex-col gap-8 md:gap-10">
      <div className="grid items-stretch gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-fuchsia-600/20 via-slate-900 to-sky-500/20 p-6 md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(251,113,133,0.7),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.6),transparent_55%),radial-gradient(circle_at_50%_120%,rgba(14,116,144,0.9),transparent_60%)] opacity-40" />
          <div className="relative max-w-xl space-y-4 md:space-y-6">
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
              New arrivals, best sellers{" "}
              <br className="hidden md:block" />
              and limited editions in one place.
            </h1>
            <p className="max-w-md text-sm text-slate-200 md:text-base">
              Discover the latest pieces, pick your size and color, and check
              out in a few clicks.
            </p>
            <div className="mt-1 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-fuchsia-400 md:text-base"
              >
                Shop now
              </Link>
              <Link
                href="/collections/new-arrivals"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/30 bg-slate-950/20 px-4 py-2 text-xs font-medium text-slate-100 transition-colors hover:border-fuchsia-400 hover:text-fuchsia-200 md:text-sm"
              >
                View new arrivals
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-full border border-slate-200/40 bg-slate-950/30 px-4 py-2 text-xs font-medium text-slate-100 transition-colors hover:border-sky-400 hover:text-sky-200 md:text-sm"
              >
                Admin dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300 md:p-5 md:text-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-slate-400">
                  Browse by collection
                </p>
              </div>
              <Link
                href="/shop"
                className="hidden text-[0.7rem] text-fuchsia-300 underline-offset-4 hover:text-fuchsia-200 hover:underline sm:inline-block"
              >
                Open shop →
              </Link>
            </div>
            <div className="mt-3 flex flex-nowrap gap-2 overflow-x-auto pb-1">
              <CollectionChip
                label="New Arrivals"
                href="/collections/new-arrivals"
              />
              <CollectionChip
                label="Best Sellers"
                href="/collections/best-sellers"
              />
              <CollectionChip label="Men" href="/collections/men" />
              <CollectionChip label="Women" href="/collections/women" />
              <CollectionChip
                label="Accessories"
                href="/collections/accessories"
              />
              <CollectionChip
                label="Limited Editions"
                href="/collections/limited-editions"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <ProductSection
          title="New Arrivals"
          subtitle="Just landed — the latest fabrics, washes, and silhouettes."
          href="/collections/new-arrivals"
          products={newArrivals}
        />
        <ProductSection
          title="Best Sellers"
          subtitle="Pieces people keep buying on repeat."
          href="/collections/best-sellers"
          products={bestSellers}
        />
        <ProductSection
          title="Limited Editions"
          subtitle="Small-batch experiments with elevated materials."
          href="/collections/limited-editions"
          products={limited}
        />
      </div>
    </section>
  );
}

type ProductSectionProps = {
  title: string;
  subtitle: string;
  href: string;
  products: ProductCardModel[];
};

function ProductSection({
  title,
  subtitle,
  href,
  products,
}: ProductSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight md:text-2xl">
            {title}
          </h2>
          <p className="text-xs text-slate-300 md:text-sm">{subtitle}</p>
        </div>
        <Link
          href={href}
          className="text-xs font-medium text-fuchsia-300 underline-offset-4 hover:text-fuchsia-200 hover:underline md:text-sm"
        >
          View all {title.toLowerCase()} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

type CollectionChipProps = {
  label: string;
  href: string;
};

function CollectionChip({ label, href }: CollectionChipProps) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-[11px] font-medium text-slate-100 transition-colors hover:border-fuchsia-400 hover:text-fuchsia-200"
    >
      {label}
    </Link>
  );
}

