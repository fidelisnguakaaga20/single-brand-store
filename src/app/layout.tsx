import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "./cart-provider";
import { SiteShell } from "./site-shell";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Single Brand Store",
    template: "%s | Single Brand Store",
  },
  description:
    "Single-brand e-commerce storefront with real variants, inventory, promotions, analytics, and an admin dashboard.",
  openGraph: {
    title: "Single Brand Store",
    description:
      "High-impact single-brand fashion storefront with real variants, inventory, promotions, and admin tools.",
    url: "/",
    siteName: "Single Brand Store",
    type: "website",
    images: ["/images/brand/og-single-brand-store.png"], // NEW: OG image
  },
  twitter: {
    card: "summary_large_image",
    title: "Single Brand Store",
    description:
      "Single-brand fashion store with real variants, inventory and admin dashboard.",
    images: ["/images/brand/og-single-brand-store.png"], // NEW: Twitter image
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 antialiased">
        <CartProvider>
          <SiteShell>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  );
}

