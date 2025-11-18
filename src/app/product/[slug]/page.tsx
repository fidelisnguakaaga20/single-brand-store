import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetail from "./product-detail";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return {
      title: "Product not found",
      description: "The requested product could not be found.",
    };
  }

  const title = product.name;
  const description =
    product.tagLine ??
    product.description ??
    "Explore this product at Single Brand Store.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/product/${product.slug}`,
      // ✅ FIX: Next.js does NOT allow "product" here.
      // Use a valid type like "website" (or omit type entirely).
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: {
        orderBy: { price: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const plainProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    tagLine: product.tagLine,
    basePrice: product.basePrice,
    currency: product.currency,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
    isLimitedEdition: product.isLimitedEdition,
    onSale: product.onSale,
    variants: product.variants.map((v) => ({
      id: v.id,
      productId: v.productId,
      sku: v.sku,
      size: v.size,
      color: v.color,
      price: v.price,
      stock: v.stock,
    })),
  };

  const prices = product.variants.length
    ? product.variants.map((v) => v.price)
    : [product.basePrice];

  const lowPrice = Math.min(...prices);
  const highPrice = Math.max(...prices);
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.tagLine ?? undefined,
    sku: product.variants[0]?.sku ?? undefined,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.currency,
      lowPrice,
      highPrice,
      availability:
        totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <ProductDetail product={plainProduct} />
      <script
        type="application/ld+json"
        // JSON-LD for SEO
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}

