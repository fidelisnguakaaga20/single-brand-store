"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/app/cart-provider";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections/new-arrivals", label: "Collections" },
  { href: "/cart", label: "Cart" },
  { href: "/account", label: "Account" },
  { href: "/login", label: "Login" },        // NEW: visible login
  { href: "/admin", label: "Dashboard" },    // RENAMED: Admin → Dashboard
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { totalQuantity } = useCart();

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="layout-container flex items-center justify-between h-16 md:h-20">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={closeMenu}
        >
          <Image
            src="/images/brand/logo-light.png"
            alt="Single Brand Store logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
            priority
          />
          <span className="font-semibold tracking-tight text-lg md:text-xl">
            Single Brand Store
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const isCart = link.href === "/cart";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1 transition-colors hover:text-fuchsia-300 ${
                  active ? "text-fuchsia-400 font-medium" : "text-slate-200"
                }`}
              >
                <span>{link.label}</span>
                {isCart && totalQuantity > 0 && (
                  <span className="inline-flex min-w-5 justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-semibold text-slate-950">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-1.5 text-sm font-medium hover:border-fuchsia-400 hover:text-fuchsia-200 transition-colors"
          >
            Start shopping
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-2 text-sm font-medium hover:border-fuchsia-400 hover:text-fuchsia-200 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950">
          <nav className="layout-container py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const isCart = link.href === "/cart";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-slate-800 text-fuchsia-300"
                      : "text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  <span>{link.label}</span>
                  <div className="flex items-center gap-2">
                    {isCart && totalQuantity > 0 && (
                      <span className="inline-flex min-w-5 justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-semibold text-slate-950">
                        {totalQuantity}
                      </span>
                    )}
                    {active && (
                      <span className="text-[10px] uppercase text-slate-400">
                        Now
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Mobile CTA buttons */}
            <div className="mt-2 flex flex-col gap-2">
              <Link
                href="/shop"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-fuchsia-400 transition-colors"
              >
                Start shopping
              </Link>
              <Link
                href="/cart"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:border-fuchsia-400 hover:text-fuchsia-200 transition-colors"
              >
                <span>View cart</span>
                {totalQuantity > 0 && (
                  <span className="ml-2 inline-flex min-w-5 justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-semibold text-slate-950">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

