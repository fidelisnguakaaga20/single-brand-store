// src/app/admin/products/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      variants: true,
    },
  });

  return products;
}

// Server action: delete product safely with all relations
async function deleteProduct(formData: FormData) {
  "use server";

  const productIdRaw = formData.get("productId");
  const productId = Number(productIdRaw);

  if (!productId || Number.isNaN(productId)) {
    console.error("[DELETE_PRODUCT] Invalid productId", productIdRaw);
    return;
  }

  try {
    // Remove related rows in correct order
    await prisma.orderItem.deleteMany({
      where: { productId },
    });

    await prisma.productVariant.deleteMany({
      where: { productId },
    });

    await prisma.productOnCollection.deleteMany({
      where: { productId },
    });

    await prisma.productTag.deleteMany({
      where: { productId },
    });

    await prisma.product.delete({
      where: { id: productId },
    });
  } catch (error) {
    console.error("[DELETE_PRODUCT_ERROR]", error);
  }

  // Refresh admin and products pages
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage the catalog powering the storefront. Edit pricing, flags, or
            remove items entirely.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-800 hover:bg-gray-50"
          >
            Back to overview
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-gray-700"
          >
            + New product
          </Link>
        </div>
      </header>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Slug</th>
              <th className="px-4 py-2 text-left">Base price</th>
              <th className="px-4 py-2 text-left">Variants</th>
              <th className="px-4 py-2 text-left">Flags</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-2">
                  <Link
                    href={`/product/${product.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-gray-500">{product.slug}</td>
                <td className="px-4 py-2">
                  {product.basePrice} {product.currency}
                </td>
                <td className="px-4 py-2">{product.variants.length}</td>
                <td className="px-4 py-2 text-xs">
                  {product.isNew && (
                    <span className="mr-1 rounded bg-emerald-100 px-2 py-1 text-emerald-700">
                      New
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="mr-1 rounded bg-amber-100 px-2 py-1 text-amber-700">
                      Best seller
                    </span>
                  )}
                  {product.isLimitedEdition && (
                    <span className="mr-1 rounded bg-purple-100 px-2 py-1 text-purple-700">
                      Limited
                    </span>
                  )}
                  {product.onSale && (
                    <span className="rounded bg-rose-100 px-2 py-1 text-rose-700">
                      On sale
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="rounded-md border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <form action={deleteProduct}>
                      <input
                        type="hidden"
                        name="productId"
                        value={product.id}
                      />
                      <button
                        type="submit"
                        className="rounded-md border border-rose-200 px-3 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No products found. Use the &ldquo;New product&rdquo; button to
                  add your first item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

