/* Seed script for Single Brand Store: collections, products, variants, tags, promotions */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const collectionsData = [
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "Fresh drops just in — designed for this season.",
  },
  {
    slug: "best-sellers",
    name: "Best Sellers",
    description: "Most-loved essentials our customers keep coming back for.",
  },
  {
    slug: "men",
    name: "Men",
    description: "Tailored pieces and everyday staples for him.",
  },
  {
    slug: "women",
    name: "Women",
    description: "Statement silhouettes and refined wardrobe foundations.",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Finish the look with bags, caps, and sunglasses.",
  },
  {
    slug: "limited-editions",
    name: "Limited Editions",
    description: "Small-batch experimental pieces in very limited runs.",
  },
];

const productsData = [
  {
    name: "Luxe Satin Slip Dress",
    slug: "luxe-satin-slip-dress",
    tagLine: "Bias-cut satin with a soft glow for night-out energy.",
    basePrice: 140,
    currency: "USD",
    isNew: true,
    isBestSeller: true,
    isLimitedEdition: false,
    onSale: false,
    collections: ["women", "new-arrivals", "best-sellers"],
    tags: ["dress", "evening", "women"],
    variants: [
      {
        sku: "DRS-SLIP-XS-ROSE",
        size: "XS",
        color: "Rose Glow",
        price: 140,
        stock: 3,
      },
      {
        sku: "DRS-SLIP-S-ROSE",
        size: "S",
        color: "Rose Glow",
        price: 140,
        stock: 6,
      },
      {
        sku: "DRS-SLIP-M-ONYX",
        size: "M",
        color: "Black Onyx",
        price: 145,
        stock: 0,
      },
      {
        sku: "DRS-SLIP-L-ONYX",
        size: "L",
        color: "Black Onyx",
        price: 145,
        stock: 2,
      },
    ],
  },
  {
    name: "Shadow Tech Sneakers",
    slug: "shadow-tech-sneakers",
    tagLine: "Lightweight cushioning with a sculpted, futuristic sole.",
    basePrice: 185,
    currency: "USD",
    isNew: true,
    isBestSeller: true,
    isLimitedEdition: false,
    onSale: false,
    collections: ["men", "new-arrivals", "best-sellers"],
    tags: ["sneakers", "men", "footwear"],
    variants: [
      {
        sku: "SNK-SHD-41-OBS",
        size: "EU 41",
        color: "Obsidian",
        price: 185,
        stock: 8,
      },
      {
        sku: "SNK-SHD-42-OBS",
        size: "EU 42",
        color: "Obsidian",
        price: 185,
        stock: 4,
      },
      {
        sku: "SNK-SHD-43-ICE",
        size: "EU 43",
        color: "Ice Grey",
        price: 190,
        stock: 1,
      },
    ],
  },
  {
    name: "Prism Logo Hoodie",
    slug: "prism-logo-hoodie",
    tagLine: "Oversized fleece with embossed prism logo across the chest.",
    basePrice: 110,
    currency: "USD",
    isNew: true,
    isBestSeller: false,
    isLimitedEdition: false,
    onSale: false,
    collections: ["men", "new-arrivals"],
    tags: ["hoodie", "sweatshirt", "men"],
    variants: [
      {
        sku: "TOP-PRISM-S-STN",
        size: "S",
        color: "Stone",
        price: 110,
        stock: 5,
      },
      {
        sku: "TOP-PRISM-M-STN",
        size: "M",
        color: "Stone",
        price: 110,
        stock: 0,
      },
      {
        sku: "TOP-PRISM-L-INK",
        size: "L",
        color: "Ink Navy",
        price: 115,
        stock: 2,
      },
    ],
  },
  {
    name: "Luminous Sculpt Bodysuit",
    slug: "luminous-sculpt-bodysuit",
    tagLine: "Second-skin fit with subtle contour panels.",
    basePrice: 95,
    currency: "USD",
    isNew: false,
    isBestSeller: false,
    isLimitedEdition: false,
    onSale: false,
    collections: ["women"],
    tags: ["bodysuit", "women"],
    variants: [
      {
        sku: "TOP-LUMI-XS-GPH",
        size: "XS",
        color: "Graphite",
        price: 95,
        stock: 4,
      },
      {
        sku: "TOP-LUMI-S-GPH",
        size: "S",
        color: "Graphite",
        price: 95,
        stock: 0,
      },
      {
        sku: "TOP-LUMI-M-IRS",
        size: "M",
        color: "Iris",
        price: 99,
        stock: 6,
      },
    ],
  },
  {
    name: "Halo Mini Crossbody",
    slug: "halo-mini-crossbody",
    tagLine: "Curved mini bag with magnetic flap and metallic hardware.",
    basePrice: 130,
    currency: "USD",
    isNew: true,
    isBestSeller: false,
    isLimitedEdition: false,
    onSale: false,
    collections: ["accessories", "new-arrivals"],
    tags: ["bag", "crossbody", "accessories"],
    variants: [
      {
        sku: "BAG-HALO-OS-CRM",
        size: "One Size",
        color: "Soft Cream",
        price: 130,
        stock: 7,
      },
      {
        sku: "BAG-HALO-OS-INK",
        size: "One Size",
        color: "Ink Black",
        price: 130,
        stock: 2,
      },
    ],
  },
  {
    name: "Eclipse Frame Sunglasses",
    slug: "eclipse-frame-sunglasses",
    tagLine: "Sculpted acetate frames with soft gradient lenses.",
    basePrice: 85,
    currency: "USD",
    isNew: false,
    isBestSeller: true,
    isLimitedEdition: false,
    onSale: false,
    collections: ["accessories", "best-sellers"],
    tags: ["sunglasses", "accessories"],
    variants: [
      {
        sku: "ACC-ECLP-OS-SMK",
        size: "One Size",
        color: "Smoke Fade",
        price: 85,
        stock: 10,
      },
      {
        sku: "ACC-ECLP-OS-AMB",
        size: "One Size",
        color: "Amber Tint",
        price: 85,
        stock: 0,
      },
    ],
  },
  {
    name: "Chromatic Foil Bomber",
    slug: "chromatic-foil-bomber",
    tagLine: "Foil-finish shell with tonal rib trims and hidden zip.",
    basePrice: 210,
    currency: "USD",
    isNew: false,
    isBestSeller: false,
    isLimitedEdition: true,
    onSale: false,
    collections: ["limited-editions", "men"],
    tags: ["jacket", "outerwear", "men"],
    variants: [
      {
        sku: "OUT-FOIL-M-GPH",
        size: "M",
        color: "Graphite Foil",
        price: 210,
        stock: 1,
      },
      {
        sku: "OUT-FOIL-L-GPH",
        size: "L",
        color: "Graphite Foil",
        price: 210,
        stock: 0,
      },
    ],
  },
  {
    name: "Iridescent Sequin Blazer",
    slug: "iridescent-sequin-blazer",
    tagLine:
      "Sharp tailoring with glassy sequins that catch low light.",
    basePrice: 260,
    currency: "USD",
    isNew: false,
    isBestSeller: true,
    isLimitedEdition: true,
    onSale: false,
    collections: ["limited-editions", "women", "best-sellers"],
    tags: ["blazer", "outerwear", "women"],
    variants: [
      {
        sku: "OUT-SEQ-S-AUR",
        size: "S",
        color: "Aurora",
        price: 260,
        stock: 0,
      },
      {
        sku: "OUT-SEQ-M-AUR",
        size: "M",
        color: "Aurora",
        price: 260,
        stock: 3,
      },
      {
        sku: "OUT-SEQ-L-ONYX",
        size: "L",
        color: "Midnight Onyx",
        price: 265,
        stock: 2,
      },
    ],
  },
  {
    name: "Everyday Essentials Tee",
    slug: "everyday-essentials-tee",
    tagLine:
      "Heavyweight cotton tee with clean neckline and dropped shoulders.",
    basePrice: 55,
    currency: "USD",
    isNew: false,
    isBestSeller: true,
    isLimitedEdition: false,
    onSale: false,
    collections: ["men", "best-sellers"],
    tags: ["tee", "top", "men"],
    variants: [
      {
        sku: "TOP-TEE-S-WHT",
        size: "S",
        color: "Soft White",
        price: 55,
        stock: 9,
      },
      {
        sku: "TOP-TEE-M-WHT",
        size: "M",
        color: "Soft White",
        price: 55,
        stock: 0,
      },
      {
        sku: "TOP-TEE-L-COAL",
        size: "L",
        color: "Coal",
        price: 59,
        stock: 4,
      },
    ],
  },
  {
    name: "Cloudform Relaxed Jeans",
    slug: "cloudform-relaxed-jeans",
    tagLine: "Soft denim in a relaxed, puddled fit through the leg.",
    basePrice: 135,
    currency: "USD",
    isNew: true,
    isBestSeller: false,
    isLimitedEdition: false,
    onSale: false,
    collections: ["men", "new-arrivals"],
    tags: ["jeans", "denim", "men"],
    variants: [
      {
        sku: "BTM-CLOUD-30-ICE",
        size: "30",
        color: "Ice Wash",
        price: 135,
        stock: 2,
      },
      {
        sku: "BTM-CLOUD-32-ICE",
        size: "32",
        color: "Ice Wash",
        price: 135,
        stock: 5,
      },
      {
        sku: "BTM-CLOUD-34-INK",
        size: "34",
        color: "Deep Ink",
        price: 139,
        stock: 0,
      },
    ],
  },
  {
    name: "Skyline Ribbed Knit Dress",
    slug: "skyline-ribbed-knit-dress",
    tagLine: "Ribbed knit that hugs the body with a fluted hem.",
    basePrice: 150,
    currency: "USD",
    isNew: false,
    isBestSeller: false,
    isLimitedEdition: false,
    onSale: false,
    collections: ["women"],
    tags: ["dress", "knit", "women"],
    variants: [
      {
        sku: "DRS-SKY-S-SND",
        size: "S",
        color: "Sandstone",
        price: 150,
        stock: 4,
      },
      {
        sku: "DRS-SKY-M-SND",
        size: "M",
        color: "Sandstone",
        price: 150,
        stock: 3,
      },
      {
        sku: "DRS-SKY-L-INK",
        size: "L",
        color: "Ink",
        price: 155,
        stock: 0,
      },
    ],
  },
  {
    name: "Vector Logo Cap",
    slug: "vector-logo-cap",
    tagLine: "Curved-brim cap with 3D embroidered logo.",
    basePrice: 45,
    currency: "USD",
    isNew: true,
    isBestSeller: true,
    isLimitedEdition: false,
    onSale: false,
    collections: ["accessories", "best-sellers", "new-arrivals"],
    tags: ["cap", "hat", "accessories"],
    variants: [
      {
        sku: "ACC-CAP-OS-BLK",
        size: "One Size",
        color: "Black",
        price: 45,
        stock: 10,
      },
      {
        sku: "ACC-CAP-OS-STN",
        size: "One Size",
        color: "Stone",
        price: 45,
        stock: 2,
      },
      {
        sku: "ACC-CAP-OS-COB",
        size: "One Size",
        color: "Cobalt",
        price: 45,
        stock: 0,
      },
    ],
  },
];

/** Global promotions (Stage 7) */
const promotionsData = [
  {
    code: "WELCOME10",
    type: "PERCENT",
    value: 10,
    minOrderAmount: 0,
    startsAt: null,
    endsAt: null,
    isActive: true,
  },
  {
    code: "SPEND300_20",
    type: "PERCENT",
    value: 20,
    minOrderAmount: 300,
    startsAt: null,
    endsAt: null,
    isActive: true,
  },
  {
    code: "TAKE50",
    type: "FIXED",
    value: 50,
    minOrderAmount: 350,
    startsAt: null,
    endsAt: null,
    isActive: true,
  },
];

function buildTagsFromProducts() {
  const tagSet = new Map();
  for (const p of productsData) {
    for (const tag of p.tags) {
      if (!tagSet.has(tag)) {
        const slug = tag.toLowerCase().replace(/\s+/g, "-");
        tagSet.set(tag, { name: tag, slug });
      }
    }
  }
  return Array.from(tagSet.values());
}

async function main() {
  console.log("Clearing existing data...");

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productOnCollection.deleteMany({});
  await prisma.productTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.promotion.deleteMany({});

  console.log("Seeding collections...");
  const collectionBySlug = {};
  for (const c of collectionsData) {
    const created = await prisma.collection.create({ data: c });
    collectionBySlug[c.slug] = created;
  }

  console.log("Seeding tags...");
  const tagsData = buildTagsFromProducts();
  const tagByName = {};
  for (const t of tagsData) {
    const created = await prisma.tag.create({ data: t });
    tagByName[t.name] = created;
  }

  console.log("Seeding products + variants + relations...");
  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        tagLine: p.tagLine,
        basePrice: p.basePrice,
        currency: p.currency,
        isNew: p.isNew,
        isBestSeller: p.isBestSeller,
        isLimitedEdition: p.isLimitedEdition,
        onSale: p.onSale,
      },
    });

    // Variants
    for (const v of p.variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: v.sku,
          size: v.size,
          color: v.color,
          price: v.price,
          stock: v.stock,
        },
      });
    }

    // Collections
    for (const cSlug of p.collections) {
      const col = collectionBySlug[cSlug];
      if (!col) continue;

      await prisma.productOnCollection.create({
        data: {
          productId: product.id,
          collectionId: col.id,
        },
      });
    }

    // Tags
    for (const tagName of p.tags) {
      const tag = tagByName[tagName];
      if (!tag) continue;

      await prisma.productTag.create({
        data: {
          productId: product.id,
          tagId: tag.id,
        },
      });
    }
  }

  console.log("Seeding promotions...");
  for (const promo of promotionsData) {
    await prisma.promotion.create({
      data: {
        code: promo.code,
        type: promo.type,
        value: promo.value,
        minOrderAmount: promo.minOrderAmount,
        startsAt: promo.startsAt,
        endsAt: promo.endsAt,
        isActive: promo.isActive,
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

