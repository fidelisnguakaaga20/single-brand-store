// src/app/admin/products/[id]/edit/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Server action: update product
async function updateProduct(formData: FormData) {
  "use server";

  const productIdRaw = formData.get("productId");
  const productId = Number(productIdRaw);

  if (!productId || Number.isNaN(productId)) {
    console.error("[UPDATE_PRODUCT] Invalid productId", productIdRaw);
    return;
  }

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const tagLine = String(formData.get("tagLine") ?? "").trim();
  const basePriceRaw = formData.get("basePrice");
  const currency = String(formData.get("currency") ?? "USD").trim() || "USD";

  const isNew = formData.get("isNew") === "on";
  const isBestSeller = formData.get("isBestSeller") === "on";
  const isLimitedEdition = formData.get("isLimitedEdition") === "on";
  const onSale = formData.get("onSale") === "on";

  if (!name) {
    console.error("[UPDATE_PRODUCT] Missing name");
    return;
  }

  let slug = slugInput || slugify(name);
  if (!slug) slug = slugify(`product-${productId}`);

  const basePrice = Number(basePriceRaw ?? 0);

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        tagLine: tagLine || null,
        basePrice: basePrice > 0 ? basePrice : 0,
        currency,
        isNew,
        isBestSeller,
        isLimitedEdition,
        onSale,
      },
    });
  } catch (error) {
    console.error("[UPDATE_PRODUCT_ERROR]", error);
    return;
  }

  revalidatePath("/admin");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}

export default async function AdminEditProductPage({ params }: EditPageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (!productId || Number.isNaN(productId)) {
    notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit product
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Adjust name, pricing, and flags. Variants and collections can be
            wired later if needed.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-800 hover:bg-gray-50"
        >
          Back to products
        </Link>
      </header>

      <form
        action={updateProduct}
        className="space-y-6 rounded-xl border bg-white p-4 sm:p-6"
      >
        <input type="hidden" name="productId" value={product.id} />

        {/* Basic info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              defaultValue={product.name}
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Slug
            </label>
            <input
              name="slug"
              defaultValue={product.slug}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
            />
            <p className="mt-1 text-xs text-gray-500">
              Used in the product URL. If changed, existing links may break.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Currency
            </label>
            <input
              name="currency"
              defaultValue={product.currency}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">
            Tagline
          </label>
          <input
            name="tagLine"
            defaultValue={product.tagLine ?? ""}
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
          />
        </div>

        {/* Pricing */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Base price
            </label>
            <input
              name="basePrice"
              type="number"
              min={0}
              defaultValue={product.basePrice}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
            />
          </div>
        </div>

        {/* Flags */}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              name="isNew"
              defaultChecked={product.isNew}
              className="h-4 w-4 rounded border-gray-300 text-gray-900"
            />
            Mark as New Arrival
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              name="isBestSeller"
              defaultChecked={product.isBestSeller}
              className="h-4 w-4 rounded border-gray-300 text-gray-900"
            />
            Mark as Best Seller
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              name="isLimitedEdition"
              defaultChecked={product.isLimitedEdition}
              className="h-4 w-4 rounded border-gray-300 text-gray-900"
            />
            Mark as Limited Edition
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              name="onSale"
              defaultChecked={product.onSale}
              className="h-4 w-4 rounded border-gray-300 text-gray-900"
            />
            Mark as On Sale
          </label>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-800 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-gray-700"
          >
            Save changes
          </button>
        </div>
      </form>
    </main>
  );
}

