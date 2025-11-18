"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-provider";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`text-sm md:text-base px-3 py-2 rounded-full border border-slate-700/60 hover:bg-slate-800/70 transition ${
        active ? "bg-slate-100 text-slate-900" : "text-slate-100"
      }`}
    >
      {label}
    </Link>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { totalQuantity } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            className="text-lg font-semibold tracking-wide md:text-xl"
          >
            Single Brand Store
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            <NavLink href="/shop" label="Shop" />
            <NavLink href="/collections/new-arrivals" label="New Arrivals" />
            <NavLink href="/account" label="Account" />
            <NavLink href="/admin" label="Admin" />
            <Link
              href="/cart"
              className="relative flex items-center gap-1 rounded-full border border-slate-700/60 px-3 py-2 text-sm hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <span>Cart</span>
              {totalQuantity > 0 && (
                <span className="inline-flex min-w-5 justify-center rounded-full bg-emerald-400 px-1 text-xs font-semibold text-slate-950">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile: Cart button */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1 rounded-full border border-slate-700/60 px-3 py-2 text-sm md:hidden"
          >
            <span>Cart</span>
            {totalQuantity > 0 && (
              <span className="inline-flex min-w-5 justify-center rounded-full bg-emerald-400 px-1 text-xs font-semibold text-slate-950">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/70 bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Single Brand Store.</p>
          {/* <p>Stage 8 — Admin analytics &amp; overview (test mode).</p> */}
        </div>
      </footer>
    </div>
  );
}

