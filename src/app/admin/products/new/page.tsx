// src/app/admin/products/new/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Server action: create a new product + one default variant
async function createProduct(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const tagLine = String(formData.get("tagLine") ?? "").trim();
  const basePriceRaw = formData.get("basePrice");
  const currency = String(formData.get("currency") ?? "USD").trim() || "USD";
  const stockRaw = formData.get("stock");

  const isNew = formData.get("isNew") === "on";
  const isBestSeller = formData.get("isBestSeller") === "on";
  const isLimitedEdition = formData.get("isLimitedEdition") === "on";
  const onSale = formData.get("onSale") === "on";

  if (!name) {
    console.error("[CREATE_PRODUCT] Missing name");
    return;
  }

  let baseSlug = slugInput || slugify(name);
  if (!baseSlug) {
    baseSlug = slugify(`product-${Date.now()}`);
  }

  // Ensure slug is unique (avoid Prisma P2002)
  let slug = baseSlug;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) break;

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const basePrice = Number(basePriceRaw ?? 0);
  const stock = Number(stockRaw ?? 0);

  try {
    // 1) Create the product
    const product = await prisma.product.create({
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

    // 2) Create a simple default variant
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: `SKU-${product.id}-${Date.now().toString(36).toUpperCase()}`,
        size: "One Size",
        color: "Standard",
        price: basePrice > 0 ? basePrice : product.basePrice,
        stock: stock >= 0 ? stock : 0,
      },
    });
  } catch (error) {
    console.error("[CREATE_PRODUCT_ERROR]", error);
    return;
  }

  // Refresh pages that depend on products
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  // Back to products list
  redirect("/admin/products");
}

export default function AdminNewProductPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            New product
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a new catalog item. Slug will be auto-unique to avoid
            database errors.
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
        action={createProduct}
        className="space-y-6 rounded-xl border bg-white p-4 sm:p-6"
      >
        {/* Basic info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
              placeholder="Everyday Essentials Tee"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Slug (optional)
            </label>
            <input
              name="slug"
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
              placeholder="everyday-essentials-tee"
            />
            <p className="mt-1 text-xs text-gray-500">
              If left blank, we&apos;ll generate it from the name.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Currency
            </label>
            <input
              name="currency"
              defaultValue="USD"
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
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
            placeholder="Heavyweight cotton tee with clean neckline and dropped shoulders."
          />
        </div>

        {/* Pricing & stock */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Base price
            </label>
            <input
              name="basePrice"
              type="number"
              min={0}
              required
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
              placeholder="55"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Initial stock (default variant)
            </label>
            <input
              name="stock"
              type="number"
              min={0}
              defaultValue={0}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 placeholder:text-gray-400 focus:border-gray-900"
              placeholder="10"
            />
          </div>
        </div>

        {/* Flags */}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              name="isNew"
              className="h-4 w-4 rounded border-gray-300 text-gray-900"
            />
            Mark as New Arrival
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              name="isBestSeller"
              className="h-4 w-4 rounded border-gray-300 text-gray-900"
            />
            Mark as Best Seller
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              name="isLimitedEdition"
              className="h-4 w-4 rounded border-gray-300 text-gray-900"
            />
            Mark as Limited Edition
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              name="onSale"
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
            Create product
          </button>
        </div>
      </form>
    </main>
  );
}


