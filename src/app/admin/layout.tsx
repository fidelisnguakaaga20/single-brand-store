// src/app/admin/layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/promotions", label: "Promotions" },
    { href: "/admin/analytics", label: "Analytics" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      <aside className="w-full border-b bg-white md:w-64 md:border-b-0 md:border-r">
        <div className="border-b px-4 py-4">
          <Link href="/" className="block">
            <span className="text-lg font-semibold tracking-tight">
              Store Admin
            </span>
            <span className="block text-xs text-gray-500">
              Single-brand fashion store
            </span>
          </Link>
        </div>
        <nav className="flex flex-row gap-2 overflow-x-auto px-2 py-3 md:flex-col">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/shop"
            className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            View storefront
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}


