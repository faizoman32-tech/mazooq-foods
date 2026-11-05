// scripts/build-products-ts.mjs
// Generates src/data/products.ts from server/catalog.js + a small per-product
// metadata table (description, story, ingredients, nutrition, origin, etc.)
// that lives in this file. The pricing/variant/tier data is the source of
// truth from server/catalog.js (which is itself auto-built from admin data).
//
// Run:  node scripts/build-products-ts.mjs
//
// Why this exists: src/data/products.ts is the React-time fallback catalog
// used when neither Supabase nor data/admin-store.json has products. It MUST
// stay in sync with server/catalog.js, otherwise customer vs retailer prices
// drift. This script enforces that sync.

import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOG } from '../server/catalog.js';

const here = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(here, '../src/data/products.ts');

// Per-product metadata that doesn't live in catalog.js (catalog.js only stores
// name/category/variants/retailerPricing). These values are real Mazooq
// content derived from the existing codebase (RetailerPortalView calculator,
// ContactView FAQs, QuickViewModal expectations). Adjust as needed.
const META = {
  'mazooq-premium-gold-tea': {
    categoryLabel: 'Assam Black Tea',
    subtitle: '100% Assam CTC — strong, brisk, full-bodied',
    tag: 'Best Seller',
    description: 'A robust, full-bodied Assam CTC tea that yields a deep amber liquor with malty notes — the perfect base for milk chai. Single-estate sourced from the Brahmaputra valley.',
    story: 'Hand-plucked from certified estate gardens along the Brahmaputra river, then processed using the CTC (Crush, Tear, Curl) method to deliver a strong, brisk cup that holds its character even with milk and spices.',
    origin: 'Amingaon, Guwahati, Kamrup District, Assam - 781031',
    fssaiNumber: '10326002000025',
    ingredients: '100% Assam Black Tea (CTC)',
    preparationOrUsage: 'Boil 1 tsp with 120ml water + 80ml milk for 3-4 minutes. Add sugar to taste.',
    nutrition: { calories: '0 kcal', protein: '0g', carbs: '0g', fat: '0g', sodium: '0mg' },
  },
  'mazooq-royal-leaf-tea': {
    categoryLabel: 'Assam Orthodox Tea',
    subtitle: 'Whole-leaf orthodox — fragrant & nuanced',
    description: 'A fragrant, golden-liquored orthodox Assam tea for the discerning palate. Notes of honey and dried fruit with a clean, brisk finish.',
    story: 'Crafted using the traditional orthodox method which preserves the integrity of the whole leaf, allowing complex aromatic notes to develop slowly across multiple steeps.',
    origin: 'Amingaon, Guwahati, Kamrup District, Assam - 781031',
    fssaiNumber: '10326002000025',
    ingredients: '100% Assam Black Tea (Orthodox)',
    preparationOrUsage: 'Steep 1 tsp in 95°C water for 3-5 minutes. Best enjoyed without milk.',
    nutrition: { calories: '0 kcal', protein: '0g', carbs: '0g', fat: '0g', sodium: '0mg' },
  },
  'mazooq-masala-chai-blend': {
    categoryLabel: 'Spiced Assam Chai',
    subtitle: 'CTC tea + freshly ground spices',
    tag: 'House Favourite',
    description: 'Pre-blended Assam CTC tea with cardamom, ginger, cinnamon, clove & black pepper — ready-to-brew masala chai in one scoop.',
    story: 'Our master blender balances the spice profile so that no single ingredient dominates; the result is a chai that tastes as authentic as the street-side kulhad chai of Banaras.',
    origin: 'Amingaon, Guwahati, Kamrup District, Assam - 781031',
    fssaiNumber: '10326002000025',
    ingredients: 'Assam CTC tea, cardamom, ginger, cinnamon, clove, black pepper',
    preparationOrUsage: 'Boil 1 tsp with 100ml water + 100ml milk + sugar. Simmer 4 minutes, strain, serve.',
    nutrition: { calories: '2 kcal', protein: '0g', carbs: '0g', fat: '0g', sodium: '1mg' },
  },
  'mazooq-green-tea': {
    categoryLabel: 'Assam Green Tea',
    subtitle: 'Whole-leaf green tea — delicate & vegetal',
    description: 'A delicate Assam green tea with grassy, vegetal notes and a soft golden-yellow cup. Naturally rich in antioxidants.',
    story: 'Sourced from the same estates as our black teas but processed without oxidation, preserving the natural catechins and delicate aroma.',
    origin: 'Amingaon, Guwahati, Kamrup District, Assam - 781031',
    fssaiNumber: '10326002000025',
    ingredients: '100% Assam Green Tea',
    preparationOrUsage: 'Steep 1 tsp in 80°C water for 2-3 minutes. Do not use boiling water.',
    nutrition: { calories: '0 kcal', protein: '0g', carbs: '0g', fat: '0g', sodium: '0mg' },
  },
  'mazooq-premium-dates': {
    categoryLabel: 'Premium Soft Dates',
    subtitle: 'Soft, caramel-sweet everyday dates',
    description: 'Plump, soft-textured premium dates with a caramel-sweet finish — perfect for daily snacking, baking, and smoothies.',
    story: 'Selected for uniform plumpness and natural sweetness without any glucose coating or syrup infusion.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Premium Soft Dates',
    preparationOrUsage: 'Ready to eat. Refrigerate after opening for best freshness.',
    nutrition: { calories: '282 kcal', protein: '2.5g', carbs: '75g', fat: '0.4g', sodium: '2mg' },
  },
  'mazooq-medjool-dates': {
    categoryLabel: 'Royal Medjool',
    subtitle: 'Large, soft, royal Medjool dates',
    tag: 'Premium',
    description: 'The king of dates — large, soft, and luxuriously sweet with notes of toffee and honey. Sourced from select Jordan Valley harvests.',
    story: 'Medjool dates are considered the finest in the world; each piece is hand-sorted for size, plumpness, and skin integrity.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Medjool Dates',
    preparationOrUsage: 'Ready to eat. Pairs beautifully with coffee or as a natural dessert.',
    nutrition: { calories: '277 kcal', protein: '1.8g', carbs: '75g', fat: '0.2g', sodium: '1mg' },
  },
  'mazooq-ajwa-dates': {
    categoryLabel: 'Sacred Ajwa',
    subtitle: 'Madinah Ajwa — dark, firm, prized',
    tag: 'Premium',
    description: 'Authentic Madinah Ajwa dates — dark, firm-textured, with a unique bittersweet profile prized across the Arabian peninsula.',
    story: 'Sourced directly from Madinah historic date farms, Ajwa dates are revered for their distinctive flavor and texture.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Ajwa Dates',
    preparationOrUsage: 'Ready to eat. Best consumed at room temperature.',
    nutrition: { calories: '281 kcal', protein: '2.3g', carbs: '76g', fat: '0.3g', sodium: '1mg' },
  },
  'mazooq-stuffed-dates': {
    categoryLabel: 'Stuffed Gourmet',
    subtitle: 'Soft dates stuffed with almond & cashew',
    description: 'Premium soft dates hand-stuffed with whole almonds and cashews — an elegant ready-to-serve delicacy for festive tables.',
    story: 'Each date is sliced and hand-filled in our Kerala facility to ensure perfect nut-to-fruit ratio in every bite.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Premium dates, almonds, cashews',
    preparationOrUsage: 'Ready to eat. Serve at room temperature for best flavor.',
    nutrition: { calories: '320 kcal', protein: '4g', carbs: '68g', fat: '4g', sodium: '3mg' },
  },
  'mazooq-premium-cashews': {
    categoryLabel: 'Whole Cashews W240',
    subtitle: 'Premium grade W240 whole cashews',
    tag: 'Best Seller',
    description: 'Buttery, ivory-white W240 grade whole cashews with a clean crunch and natural creamy sweetness.',
    story: 'Sourced directly from Kerala coastal cashew belt; graded W240 (240 kernels per pound) for consistent size and quality.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Whole Cashews (W240 grade)',
    preparationOrUsage: 'Ready to eat. Store in airtight container away from sunlight.',
    nutrition: { calories: '553 kcal', protein: '18g', carbs: '30g', fat: '44g', sodium: '12mg' },
  },
  'mazooq-salted-cashews': {
    categoryLabel: 'Roasted Salted',
    subtitle: 'Slow-roasted with Himalayan pink salt',
    description: 'Whole cashews slow-roasted in small batches with a touch of Himalayan pink salt for an addictive savory-sweet balance.',
    story: 'Roasted at low temperature to preserve the natural oils and creamy texture without becoming oily or rancid.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Cashews, Himalayan pink salt, sunflower oil',
    preparationOrUsage: 'Ready to eat. Best within 30 days of opening.',
    nutrition: { calories: '560 kcal', protein: '17g', carbs: '29g', fat: '45g', sodium: '420mg' },
  },
  'mazooq-premium-almonds': {
    categoryLabel: 'Whole Almonds',
    subtitle: 'Whole California-grade almonds',
    description: 'Plump, sweet, whole almonds with a satisfying snap — rich in protein, fiber, and vitamin E.',
    story: 'Selected for uniform plumpness and clean skin; ideal for daily snacking, baking, and garnishing.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Whole Almonds',
    preparationOrUsage: 'Ready to eat. Soak overnight for easier digestion.',
    nutrition: { calories: '579 kcal', protein: '21g', carbs: '22g', fat: '50g', sodium: '1mg' },
  },
  'mazooq-golden-raisins': {
    categoryLabel: 'Golden Raisins',
    subtitle: 'Sun-dried golden kishmish',
    description: 'Plump, sun-dried golden raisins with a delicate floral sweetness — ideal for baking, trail mixes, and festive cooking.',
    story: 'Sulfur-treated sun-drying preserves the bright golden hue while concentrating the natural fruit sugars.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Golden Raisins (with permitted preservative E220)',
    preparationOrUsage: 'Ready to eat. Wash before use in baking.',
    nutrition: { calories: '299 kcal', protein: '3g', carbs: '79g', fat: '0.5g', sodium: '11mg' },
  },
  'mazooq-kerala-banana-chips': {
    categoryLabel: 'Kerala Banana Chips',
    subtitle: 'Thin-sliced, fried in pure coconut oil',
    tag: 'Best Seller',
    description: 'Authentic Kerala-style banana chips — thin-sliced raw Nendran bananas fried in 100% cold-pressed coconut oil with a touch of pink salt.',
    story: 'Made in our Palakkad facility using the legendary Nendran banana variety native to Kerala, fried exclusively in pure coconut oil (no palm oil).',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Nendran banana, coconut oil, pink salt, turmeric',
    preparationOrUsage: 'Ready to eat. Consume within 7 days of opening for crunch.',
    nutrition: { calories: '536 kcal', protein: '2g', carbs: '58g', fat: '32g', sodium: '380mg' },
  },
  'mazooq-peri-peri-banana-chips': {
    categoryLabel: 'Spiced Banana Chips',
    subtitle: 'Fiery peri peri seasoned',
    description: 'Banana chips coated in a smoky peri peri spice blend — heat, smoke, and crunch in every bite.',
    story: 'Our signature peri peri blend balances African bird eye chili with smoked paprika and a hint of citrus.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Banana, coconut oil, peri peri spice blend (chili, paprika, garlic, lemon, oregano), salt',
    preparationOrUsage: 'Ready to eat. Best paired with chilled beverages.',
    nutrition: { calories: '540 kcal', protein: '2g', carbs: '57g', fat: '32g', sodium: '450mg' },
  },
  'mazooq-black-pepper-banana-chips': {
    categoryLabel: 'Peppered Banana Chips',
    subtitle: 'Bold cracked black pepper',
    description: 'Banana chips dusted generously with cracked Tellicherry black pepper — warm, woody heat with citrus undertones.',
    story: 'Uses authentic Tellicherry peppercorns from Kerala Malabar coast, the world premier pepper origin.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Banana, coconut oil, black pepper, salt, turmeric',
    preparationOrUsage: 'Ready to eat. Pairs well with tea or coffee.',
    nutrition: { calories: '538 kcal', protein: '2g', carbs: '57g', fat: '32g', sodium: '410mg' },
  },
  'mazooq-tapioca-chips': {
    categoryLabel: 'Tapioca Chips',
    subtitle: 'Crunchy Kerala kappa chips',
    description: 'Thin-sliced sun-dried tapioca (kappa) fried in coconut oil — extra crunchy with a clean, starchy sweetness.',
    story: 'A Kerala homestead classic; tapioca is soaked, sliced, sun-dried, then fried in small batches.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Tapioca, coconut oil, salt, turmeric',
    preparationOrUsage: 'Ready to eat. Excellent with evening chai.',
    nutrition: { calories: '510 kcal', protein: '1g', carbs: '64g', fat: '27g', sodium: '380mg' },
  },
  'mazooq-turmeric-powder': {
    categoryLabel: 'High-Curcumin Turmeric',
    subtitle: 'Lakadong variety — 7%+ curcumin',
    tag: 'Premium',
    description: 'Stone-ground Lakadong turmeric from Meghalaya — prized for its deep orange color, earthy aroma, and curcumin content above 7%.',
    story: 'Lakadong is globally recognized as one of the finest turmeric varieties; we source directly from tribal farmer cooperatives in the Jaintia Hills.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: '100% Lakadong Turmeric Powder',
    preparationOrUsage: 'Add 1/2 tsp to curries, milk, or smoothies. Pairs with black pepper for absorption.',
    nutrition: { calories: '354 kcal', protein: '8g', carbs: '65g', fat: '10g', sodium: '38mg' },
  },
  'mazooq-kashmiri-chilli-powder': {
    categoryLabel: 'Kashmiri Chilli',
    subtitle: 'Vibrant red, mild heat',
    description: 'Sun-dried Kashmiri chillies ground to a brilliant red powder — prized for color with mild, fragrant heat (1500-2000 SHU).',
    story: 'Authentic Kashmiri chillies give curries their signature deep red color without overwhelming heat.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: '100% Kashmiri Chilli Powder',
    preparationOrUsage: 'Add 1 tsp to curries for rich red color. Adjust to taste.',
    nutrition: { calories: '282 kcal', protein: '14g', carbs: '54g', fat: '6g', sodium: '30mg' },
  },
  'mazooq-garam-masala': {
    categoryLabel: 'Garam Masala Blend',
    subtitle: '11 spices, stone-ground',
    description: 'A regal 11-spice garam masala — stone-ground in small batches to preserve volatile aromatics. Cardamom-forward with a warm, complex finish.',
    story: 'Our family recipe balances eleven whole spices, dry-roasted separately and ground fresh to retain aromatic integrity.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Cardamom, cinnamon, clove, black pepper, cumin, coriander, bay leaf, fennel, mace, nutmeg, star anise',
    preparationOrUsage: 'Add 1 tsp at the end of cooking to preserve aroma. Do not overcook.',
    nutrition: { calories: '275 kcal', protein: '11g', carbs: '40g', fat: '12g', sodium: '40mg' },
  },
  'mazooq-indian-chai-spice': {
    categoryLabel: 'Chai Spice Mix',
    subtitle: 'Ready-to-brew chai masala powder',
    description: 'A finely milled chai masala blend — add a pinch to boiling tea for an instant aromatic uplift.',
    story: 'A concentrated all-in-one blend; a small pinch transforms ordinary milk tea into aromatic masala chai.',
    origin: 'Nellaya, Ottappalam, Palakkad, Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Ginger, cardamom, cinnamon, clove, black pepper, nutmeg',
    preparationOrUsage: 'Add 1/4 tsp per cup of boiling chai. Strain and serve.',
    nutrition: { calories: '290 kcal', protein: '6g', carbs: '55g', fat: '8g', sodium: '35mg' },
  },
};

const IMG_BASE = '/photos';

function variantWeight(size) {
  // Parse "250g" / "1kg" / "100g" / "50g" -> grams
  const m = /^(\d+)\s*(g|kg)$/i.exec(String(size).trim());
  if (!m) return 0;
  const n = Number(m[1]);
  return m[2].toLowerCase() === 'kg' ? n * 1000 : n;
}

const products = Object.entries(CATALOG).map(([id, p], idx) => {
  const meta = META[id];
  if (!meta) {
    throw new Error(`Missing META entry for product id "${id}". Add it to scripts/build-products-ts.mjs`);
  }
  const variants = Object.entries(p.variants).map(([size, price]) => ({
    size,
    price,
    weightInGrams: variantWeight(size),
  }));
  // Image filename matches the actual file on disk under
  // public/photos/. The on-disk files do NOT carry the leading
  // "mazooq-" prefix (e.g. "premium-gold-tea.png", not
  // "mazooq-premium-gold-tea.png"), so we strip it before forming the URL.
  // IMPORTANT: Render/Linux are case-sensitive, so this MUST exactly match
  // the lowercase, hyphenated filename on disk.
  const imageFile = id.replace(/^mazooq-/, '') + '.png';
  return {
    id,
    name: p.name,
    category: p.category,
    ...meta,
    variants,
    image: `${IMG_BASE}/${imageFile}`,
    sortIndex: idx + 1,
    retailerPricing: p.retailerPricing || [],
    ...(p.retailerPricingSize ? { retailerPricingSize: p.retailerPricingSize } : {}),
  };
});

// Emit TypeScript
const ts = `// AUTO-GENERATED from server/catalog.js + scripts/build-products-ts.mjs
// DO NOT EDIT BY HAND. To regenerate:
//   1. Update META in scripts/build-products-ts.mjs (descriptions, stories, etc.)
//   2. Run:  node scripts/build-products-ts.mjs
//
// Pricing/variants/retailer tiers come from server/catalog.js (the
// server-side source of truth, which itself is built from admin data).

export interface Variant {
  size: string;          // e.g. "250g"
  price: number;         // INR
  weightInGrams: number;
}

export interface PricingTier {
  minQty: number;       // inclusive (e.g. 10)
  maxQty: number | null; // inclusive (e.g. 24) - null means "no upper bound"
  pricePerUnit: number; // INR per unit (overrides variants[].price for approved retailers)
}

export interface Product {
  id: string;
  name: string;
  category: 'tea' | 'dates' | 'nuts' | 'snacks' | 'spices';
  categoryLabel: string;
  subtitle: string;
  tag?: string;
  description: string;
  story: string;
  origin: string;
  fssaiNumber?: string;
  ingredients: string;
  preparationOrUsage: string;
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    sodium: string;
  };
  variants: Variant[];
  image: string;
  isComingSoon?: boolean;
  hidden?: boolean;
  sortIndex?: number;
  retailerPricing?: PricingTier[];
  /** Pack size the retailerPricing tiers are quoted for; other sizes scale proportionally. */
  retailerPricingSize?: string;
}

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export const PRODUCT_MAP: Record<string, Product> = PRODUCTS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<string, Product>
);
`;

writeFileSync(outFile, ts, 'utf8');
console.log(`✓ Wrote ${outFile}`);
console.log(`  Products: ${products.length}`);
console.log(`  Total size: ${ts.length} chars`);
