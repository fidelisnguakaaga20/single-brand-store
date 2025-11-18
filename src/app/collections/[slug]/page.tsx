import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image"; // NEW: show collection hero banners

export const revalidate = 60;

type RawSearchParams = {
  [key: string]: string | string[] | undefined;
};

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
};
const COLLECTION_HERO_MAP: Record<string, string> = {
  "new-arrivals": "/images/collections/new-arrivals.png",
  "best-sellers": "/images/collections/best-sellers.png",
  men: "/images/collections/men.png",
  women: "/images/collections/women.png",
  accessories: "/images/collections/accessories.png",
  "limited-editions": "/images/collections/limited-editions.png",
};

function getArrayParam(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params;

  const collection = await prisma.collection.findUnique({
    where: { slug },
  });

  if (!collection) {
    return {
      title: "Collection not found",
      description: "The requested collection could not be found.",
    };
  }

  const title = `${collection.name} Collection`;
  const description =
    collection.description ??
    `Browse pieces from the ${collection.name} collection at Single Brand Store.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/collections/${collection.slug}`,
      type: "website",
    },
  };
}

export default async function CollectionPage(props: PageProps) {
  const [{ slug }, rawSearchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const collection = await prisma.collection.findUnique({
    where: { slug },
  });

  if (!collection) {
    notFound();
  }
  const heroSrc = COLLECTION_HERO_MAP[collection.slug] ?? null;

  const searchTerm =
    typeof rawSearchParams.search === "string" ? rawSearchParams.search.trim() : "";

  const sort =
    typeof rawSearchParams.sort === "string" && rawSearchParams.sort.length > 0
      ? rawSearchParams.sort
      : "newest";

  const minPriceRaw =
    typeof rawSearchParams.minPrice === "string" ? rawSearchParams.minPrice : "";
  const maxPriceRaw =
    typeof rawSearchParams.maxPrice === "string" ? rawSearchParams.maxPrice : "";

  const minPrice = minPriceRaw ? Number.parseInt(minPriceRaw, 10) : undefined;
  const maxPrice = maxPriceRaw ? Number.parseInt(maxPriceRaw, 10) : undefined;

  const tagSlugs = getArrayParam(rawSearchParams.tag);

  const where: any = {
    collections: {
      some: {
        collectionId: collection.id,
      },
    },
  };

  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
      { tagLine: { contains: searchTerm, mode: "insensitive" } },
    ];
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
    default:
      orderBy = { createdAt: "desc" };
  }

  const [products, totalCount, tags] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      include: {
        variants: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4">
          <nav className="text-[0.7rem] text-slate-500">
            <Link
              href="/"
              className="underline-offset-4 hover:text-slate-200 hover:underline"
            >
              Home
            </Link>
            <span className="mx-1.5 text-slate-600">/</span>
            <Link
              href="/shop"
              className="underline-offset-4 hover:text-slate-200 hover:underline"
            >
              Shop
            </Link>
            <span className="mx-1.5 text-slate-600">/</span>
            <span className="text-slate-300">{collection.name}</span>
          </nav>
          {heroSrc && (
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
              <Image
                src={heroSrc}
                alt={`${collection.name} collection hero`}
                width={1200}
                height={400}
                className="h-40 w-full object-cover sm:h-56 md:h-64"
                priority
              />
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.25em] text-slate-400">
                Collection
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                {collection.name}
              </h1>
              {collection.description && (
                <p className="mt-1 max-w-2xl text-sm text-slate-400">
                  {collection.description}
                </p>
              )}
              <p className="mt-1 text-sm text-slate-500">
                Showing {totalCount} item{totalCount === 1 ? "" : "s"}
                {searchTerm ? (
                  <>
                    {" "}
                    for <span className="font-semibold">“{searchTerm}”</span>
                  </>
                ) : null}
                .
              </p>
            </div>

            <Link
              href="/collections/new-arrivals"
              className="mt-1 inline-flex w-max items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:border-slate-500 hover:text-white sm:mt-0"
            >
              View New Arrivals
            </Link>
          </div>
        </header>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5">
        </section>
      </div>
    </main>
  );
}

