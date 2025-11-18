import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <div className="layout-container py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-slate-400">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Single Brand Store. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="hover:text-fuchsia-300 transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/account"
            className="hover:text-fuchsia-300 transition-colors"
          >
            Account
          </Link>
          <Link
            href="/admin"
            className="hover:text-fuchsia-300 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}

