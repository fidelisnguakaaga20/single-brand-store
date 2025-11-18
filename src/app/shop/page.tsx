// src/app/shop/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  ProductCard,
  type ProductCardModel,
} from "@/components/store/product-card";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the full Single Brand Store catalog with filters, search and sorting.",
};

// Enable ISR for better performance + fresh data
export const revalidate = 60;

type RawSearchParams = {
  [key: string]: string | string[] | undefined;
};

type PageProps = {
  searchParams: Promise<RawSearchParams>;
};

function getArrayParam(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

// Map Prisma product -> ProductCardModel for the shared card component
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

export default async function ShopPage(props: PageProps) {
  // Next 16: searchParams is a Promise – resolve it first
  const rawSearchParams = await props.searchParams;

  const searchTerm =
    typeof rawSearchParams.search === "string"
      ? rawSearchParams.search.trim()
      : "";

  const collectionSlug =
    typeof rawSearchParams.collection === "string"
      ? rawSearchParams.collection.trim()
      : "";

  const sort =
    typeof rawSearchParams.sort === "string" && rawSearchParams.sort.length > 0
      ? rawSearchParams.sort
      : "newest";

  const minPriceRaw =
    typeof rawSearchParams.minPrice === "string"
      ? rawSearchParams.minPrice
      : "";
  const maxPriceRaw =
    typeof rawSearchParams.maxPrice === "string"
      ? rawSearchParams.maxPrice
      : "";

  const minPrice = minPriceRaw
    ? Number.parseInt(minPriceRaw, 10)
    : undefined;
  const maxPrice = maxPriceRaw
    ? Number.parseInt(maxPriceRaw, 10)
    : undefined;

  const tagSlugs = getArrayParam(rawSearchParams.tag);

  const where: any = {};

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      { tagLine: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  if (collectionSlug) {
    where.collections = {
      some: {
        collection: {
          slug: collectionSlug,
        },
      },
    };
  }

  if (typeof minPrice === "number" || typeof maxPrice === "number") {
    where.basePrice = {};
    if (typeof minPrice === "number") {
      where.basePrice.gte = minPrice;
    }
    if (typeof maxPrice === "number") {
      where.basePrice.lte = maxPrice;
    }
  }

  if (tagSlugs.length > 0) {
    where.tags = {
      some: {
        tag: {
          slug: {
            in: tagSlugs,
          },
        },
      },
    };
  }

  let orderBy: any = { createdAt: "desc" };

  switch (sort) {
    case "price_asc":
      orderBy = { basePrice: "asc" };
      break;
    case "price_desc":
      orderBy = { basePrice: "desc" };
      break;
    case "best_sellers":
      orderBy = [
        { isBestSeller: "desc" as const },
        { createdAt: "desc" as const },
      ];
      break;
  }

  const [products, totalCount, collections, tags] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        variants: true,
        collections: {
          include: {
            collection: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.product.count({ where }),
    prisma.collection.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const cardProducts: ProductCardModel[] = products.map(toCardModel);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-slate-400">
              Single Brand Store
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              Shop
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Showing {totalCount} product{totalCount === 1 ? "" : "s"}
              {searchTerm ? (
                <>
                  {" "}
                  for <span className="font-semibold">“{searchTerm}”</span>
                </>
              ) : null}
              {collectionSlug ? (
                <>
                  {" "}
                  in{" "}
                  <span className="font-semibold">
                    {collections.find((c) => c.slug === collectionSlug)?.name ??
                      collectionSlug}
                  </span>
                </>
              ) : null}
              .
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Link
              href="/"
              className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 hover:border-slate-500 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/collections/new-arrivals"
              className="hidden rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 hover:border-slate-500 hover:text-white sm:inline-flex"
            >
              New Arrivals
            </Link>
          </div>
        </header>

        {/* Filters & Search */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
          <form
            className="flex flex-col gap-4"
            method="GET"
            aria-label="Search and filter products"
          >
            {/* Row 1: Search + Sort */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400"
                >
                  Search
                </label>
                <input
                  id="search"
                  name="search"
                  defaultValue={searchTerm}
                  placeholder="Search by name, description, or vibe…"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-slate-400"
                />
              </div>

              <div className="w-full sm:w-52">
                <label
                  htmlFor="sort"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400"
                >
                  Sort by
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={sort}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-slate-400"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price — Low to high</option>
                  <option value="price_desc">Price — High to low</option>
                  <option value="best_sellers">Best sellers</option>
                </select>
              </div>
            </div>

            {/* Row 2: Collection + Price range */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="w-full sm:w-64">
                <label
                  htmlFor="collection"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-slate-400"
                >
                  Collection
                </label>
                <select
                  id="collection"
                  name="collection"
                  defaultValue={collectionSlug}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 outline-none focus:border-slate-400"
                >
                  <option value="">All collections</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.slug}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-1 flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-slate-400">
                  Price range (USD)
                </span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    id="minPrice"
                    name="minPrice"
                    defaultValue={minPriceRaw}
                    placeholder="Min"
                    className="w-24 flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-slate-400"
                  />
                  <span className="self-center text-xs text-slate-500">—</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    id="maxPrice"
                    name="maxPrice"
                    defaultValue={maxPriceRaw}
                    placeholder="Max"
                    className="w-24 flex-1 rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-50 outline-none placeholder:text-slate-500 focus:border-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Tags */}
            <div className="flex flex-col gap-2">
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-slate-400">
                Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const checked = tagSlugs.includes(tag.slug);
                  return (
                    <label
                      key={tag.id}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium ${
                        checked
                          ? "border-sky-400 bg-sky-500/10 text-sky-100"
                          : "border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="tag"
                        value={tag.slug}
                        defaultChecked={checked}
                        className="sr-only"
                      />
                      {tag.name}
                    </label>
                  );
                })}
                {tags.length === 0 && (
                  <span className="text-xs text-slate-500">
                    No tags defined yet.
                  </span>
                )}
              </div>
            </div>

            {/* Row 4: Actions */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-950 hover:bg-white"
                >
                  Apply filters
                </button>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:border-slate-500 hover:text-white"
                >
                  Clear
                </Link>
              </div>

              <p className="text-[0.7rem] text-slate-500">
                All controls work on mobile — filters stack neatly and remain
                tap-friendly.
              </p>
            </div>
          </form>
        </section>

        {/* Product grid */}
        <section aria-label="Product grid" className="space-y-4">
          {cardProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-4 py-10 text-center text-sm text-slate-400">
              No products match your filters. Try clearing some filters or using
              a different search term.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {cardProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

