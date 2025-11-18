export type CollectionSlug =
  | "new-arrivals"
  | "best-sellers"
  | "men"
  | "women"
  | "accessories"
  | "limited-editions";

export type ProductVariant = {
  id: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  stock: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  currency: "USD";
  collections: CollectionSlug[];
  tagLine: string;
  badge?: "New" | "Best Seller" | "Limited";
  variants: ProductVariant[];
};

export const COLLECTIONS: {
  slug: CollectionSlug;
  name: string;
  blurb: string;
}[] = [
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    blurb: "Fresh drops just in — designed for this season.",
  },
  {
    slug: "best-sellers",
    name: "Best Sellers",
    blurb: "Most-loved essentials our customers keep coming back for.",
  },
  {
    slug: "men",
    name: "Men",
    blurb: "Tailored pieces and everyday staples for him.",
  },
  {
    slug: "women",
    name: "Women",
    blurb: "Statement silhouettes and refined wardrobe foundations.",
  },
  {
    slug: "accessories",
    name: "Accessories",
    blurb: "Finish the look with bags, caps, and sunglasses.",
  },
  {
    slug: "limited-editions",
    name: "Limited Editions",
    blurb: "Small-batch experimental pieces in very limited runs.",
  },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Luxe Satin Slip Dress",
    slug: "luxe-satin-slip-dress",
    price: 140,
    currency: "USD",
    collections: ["women", "new-arrivals", "best-sellers"],
    tagLine: "Bias-cut satin with a soft glow for night-out energy.",
    badge: "New",
    variants: [
      {
        id: "slip-xs-rose",
        sku: "DRS-SLIP-XS-ROSE",
        size: "XS",
        color: "Rose Glow",
        price: 140,
        stock: 3,
      },
      {
        id: "slip-s-rose",
        sku: "DRS-SLIP-S-ROSE",
        size: "S",
        color: "Rose Glow",
        price: 140,
        stock: 6,
      },
      {
        id: "slip-m-onyx",
        sku: "DRS-SLIP-M-ONYX",
        size: "M",
        color: "Black Onyx",
        price: 145,
        stock: 0, // Out of stock example
      },
      {
        id: "slip-l-onyx",
        sku: "DRS-SLIP-L-ONYX",
        size: "L",
        color: "Black Onyx",
        price: 145,
        stock: 2,
      },
    ],
  },
  {
    id: 2,
    name: "Shadow Tech Sneakers",
    slug: "shadow-tech-sneakers",
    price: 185,
    currency: "USD",
    collections: ["men", "new-arrivals", "best-sellers"],
    tagLine: "Lightweight cushioning with a sculpted, futuristic sole.",
    badge: "Best Seller",
    variants: [
      {
        id: "sneaker-41-obsidian",
        sku: "SNK-SHD-41-OBS",
        size: "EU 41",
        color: "Obsidian",
        price: 185,
        stock: 8,
      },
      {
        id: "sneaker-42-obsidian",
        sku: "SNK-SHD-42-OBS",
        size: "EU 42",
        color: "Obsidian",
        price: 185,
        stock: 4,
      },
      {
        id: "sneaker-43-ice",
        sku: "SNK-SHD-43-ICE",
        size: "EU 43",
        color: "Ice Grey",
        price: 190,
        stock: 1,
      },
    ],
  },
  {
    id: 3,
    name: "Prism Logo Hoodie",
    slug: "prism-logo-hoodie",
    price: 110,
    currency: "USD",
    collections: ["men", "new-arrivals"],
    tagLine: "Oversized fleece with embossed prism logo across the chest.",
    variants: [
      {
        id: "hoodie-s-stone",
        sku: "TOP-PRISM-S-STN",
        size: "S",
        color: "Stone",
        price: 110,
        stock: 5,
      },
      {
        id: "hoodie-m-stone",
        sku: "TOP-PRISM-M-STN",
        size: "M",
        color: "Stone",
        price: 110,
        stock: 0,
      },
      {
        id: "hoodie-l-ink",
        sku: "TOP-PRISM-L-INK",
        size: "L",
        color: "Ink Navy",
        price: 115,
        stock: 2,
      },
    ],
  },
  {
    id: 4,
    name: "Luminous Sculpt Bodysuit",
    slug: "luminous-sculpt-bodysuit",
    price: 95,
    currency: "USD",
    collections: ["women"],
    tagLine: "Second-skin fit with subtle contour panels.",
    variants: [
      {
        id: "body-xs-graphite",
        sku: "TOP-LUMI-XS-GPH",
        size: "XS",
        color: "Graphite",
        price: 95,
        stock: 4,
      },
      {
        id: "body-s-graphite",
        sku: "TOP-LUMI-S-GPH",
        size: "S",
        color: "Graphite",
        price: 95,
        stock: 0,
      },
      {
        id: "body-m-iris",
        sku: "TOP-LUMI-M-IRS",
        size: "M",
        color: "Iris",
        price: 99,
        stock: 6,
      },
    ],
  },
  {
    id: 5,
    name: "Halo Mini Crossbody",
    slug: "halo-mini-crossbody",
    price: 130,
    currency: "USD",
    collections: ["accessories", "new-arrivals"],
    tagLine: "Curved mini bag with magnetic flap and metallic hardware.",
    variants: [
      {
        id: "halo-os-cream",
        sku: "BAG-HALO-OS-CRM",
        size: "One Size",
        color: "Soft Cream",
        price: 130,
        stock: 7,
      },
      {
        id: "halo-os-ink",
        sku: "BAG-HALO-OS-INK",
        size: "One Size",
        color: "Ink Black",
        price: 130,
        stock: 2,
      },
    ],
  },
  {
    id: 6,
    name: "Eclipse Frame Sunglasses",
    slug: "eclipse-frame-sunglasses",
    price: 85,
    currency: "USD",
    collections: ["accessories", "best-sellers"],
    tagLine: "Sculpted acetate frames with soft gradient lenses.",
    badge: "Best Seller",
    variants: [
      {
        id: "sun-os-smoke",
        sku: "ACC-ECLP-OS-SMK",
        size: "One Size",
        color: "Smoke Fade",
        price: 85,
        stock: 10,
      },
      {
        id: "sun-os-amber",
        sku: "ACC-ECLP-OS-AMB",
        size: "One Size",
        color: "Amber Tint",
        price: 85,
        stock: 0,
      },
    ],
  },
  {
    id: 7,
    name: "Chromatic Foil Bomber",
    slug: "chromatic-foil-bomber",
    price: 210,
    currency: "USD",
    collections: ["limited-editions", "men"],
    tagLine: "Foil-finish shell with tonal rib trims and hidden zip.",
    badge: "Limited",
    variants: [
      {
        id: "foil-m-graphite",
        sku: "OUT-FOIL-M-GPH",
        size: "M",
        color: "Graphite Foil",
        price: 210,
        stock: 1,
      },
      {
        id: "foil-l-graphite",
        sku: "OUT-FOIL-L-GPH",
        size: "L",
        color: "Graphite Foil",
        price: 210,
        stock: 0,
      },
    ],
  },
  {
    id: 8,
    name: "Iridescent Sequin Blazer",
    slug: "iridescent-sequin-blazer",
    price: 260,
    currency: "USD",
    collections: ["limited-editions", "women", "best-sellers"],
    tagLine: "Sharp tailoring with glassy sequins that catch low light.",
    badge: "Limited",
    variants: [
      {
        id: "blazer-s-aurora",
        sku: "OUT-SEQ-S-AUR",
        size: "S",
        color: "Aurora",
        price: 260,
        stock: 0,
      },
      {
        id: "blazer-m-aurora",
        sku: "OUT-SEQ-M-AUR",
        size: "M",
        color: "Aurora",
        price: 260,
        stock: 3,
      },
      {
        id: "blazer-l-onyx",
        sku: "OUT-SEQ-L-ONYX",
        size: "L",
        color: "Midnight Onyx",
        price: 265,
        stock: 2,
      },
    ],
  },
  {
    id: 9,
    name: "Everyday Essentials Tee",
    slug: "everyday-essentials-tee",
    price: 55,
    currency: "USD",
    collections: ["men", "best-sellers"],
    tagLine: "Heavyweight cotton tee with clean neckline and dropped shoulders.",
    badge: "Best Seller",
    variants: [
      {
        id: "tee-s-white",
        sku: "TOP-TEE-S-WHT",
        size: "S",
        color: "Soft White",
        price: 55,
        stock: 9,
      },
      {
        id: "tee-m-white",
        sku: "TOP-TEE-M-WHT",
        size: "M",
        color: "Soft White",
        price: 55,
        stock: 0,
      },
      {
        id: "tee-l-coal",
        sku: "TOP-TEE-L-COAL",
        size: "L",
        color: "Coal",
        price: 59,
        stock: 4,
      },
    ],
  },
  {
    id: 10,
    name: "Cloudform Relaxed Jeans",
    slug: "cloudform-relaxed-jeans",
    price: 135,
    currency: "USD",
    collections: ["men", "new-arrivals"],
    tagLine: "Soft denim in a relaxed, puddled fit through the leg.",
    variants: [
      {
        id: "jean-30-ice",
        sku: "BTM-CLOUD-30-ICE",
        size: "30",
        color: "Ice Wash",
        price: 135,
        stock: 2,
      },
      {
        id: "jean-32-ice",
        sku: "BTM-CLOUD-32-ICE",
        size: "32",
        color: "Ice Wash",
        price: 135,
        stock: 5,
      },
      {
        id: "jean-34-ink",
        sku: "BTM-CLOUD-34-INK",
        size: "34",
        color: "Deep Ink",
        price: 139,
        stock: 0,
      },
    ],
  },
  {
    id: 11,
    name: "Skyline Ribbed Knit Dress",
    slug: "skyline-ribbed-knit-dress",
    price: 150,
    currency: "USD",
    collections: ["women"],
    tagLine: "Ribbed knit that hugs the body with a fluted hem.",
    variants: [
      {
        id: "dress-s-sand",
        sku: "DRS-SKY-S-SND",
        size: "S",
        color: "Sandstone",
        price: 150,
        stock: 4,
      },
      {
        id: "dress-m-sand",
        sku: "DRS-SKY-M-SND",
        size: "M",
        color: "Sandstone",
        price: 150,
        stock: 3,
      },
      {
        id: "dress-l-ink",
        sku: "DRS-SKY-L-INK",
        size: "L",
        color: "Ink",
        price: 155,
        stock: 0,
      },
    ],
  },
  {
    id: 12,
    name: "Vector Logo Cap",
    slug: "vector-logo-cap",
    price: 45,
    currency: "USD",
    collections: ["accessories", "best-sellers", "new-arrivals"],
    tagLine: "Curved-brim cap with 3D embroidered logo.",
    variants: [
      {
        id: "cap-os-black",
        sku: "ACC-CAP-OS-BLK",
        size: "One Size",
        color: "Black",
        price: 45,
        stock: 10,
      },
      {
        id: "cap-os-stone",
        sku: "ACC-CAP-OS-STN",
        size: "One Size",
        color: "Stone",
        price: 45,
        stock: 2,
      },
      {
        id: "cap-os-cobalt",
        sku: "ACC-CAP-OS-COB",
        size: "One Size",
        color: "Cobalt",
        price: 45,
        stock: 0,
      },
    ],
  },
];

export function getCollectionBySlug(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}


