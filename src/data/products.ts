// AUTO-GENERATED from server/catalog.js + scripts/build-products-ts.mjs
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

export const PRODUCTS: Product[] = [
  {
    "id": "mazooq-premium-gold-tea",
    "name": "Mazooq Premium Gold Tea",
    "category": "tea",
    "categoryLabel": "Assam Black Tea",
    "subtitle": "100% Assam CTC — strong, brisk, full-bodied",
    "tag": "Best Seller",
    "description": "A robust, full-bodied Assam CTC tea that yields a deep amber liquor with malty notes — the perfect base for milk chai. Single-estate sourced from the Brahmaputra valley.",
    "story": "Hand-plucked from certified estate gardens along the Brahmaputra river, then processed using the CTC (Crush, Tear, Curl) method to deliver a strong, brisk cup that holds its character even with milk and spices.",
    "origin": "Amingaon, Guwahati, Kamrup District, Assam - 781031",
    "fssaiNumber": "10326002000025",
    "ingredients": "100% Assam Black Tea (CTC)",
    "preparationOrUsage": "Boil 1 tsp with 120ml water + 80ml milk for 3-4 minutes. Add sugar to taste.",
    "nutrition": {
      "calories": "0 kcal",
      "protein": "0g",
      "carbs": "0g",
      "fat": "0g",
      "sodium": "0mg"
    },
    "variants": [
      {
        "size": "250g",
        "price": 199,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 379,
        "weightInGrams": 500
      },
      {
        "size": "1kg",
        "price": 699,
        "weightInGrams": 1000
      }
    ],
    "image": "/photos/premium-gold-tea.png",
    "sortIndex": 1,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 275
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 245
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 215
      }
    ]
  },
  {
    "id": "mazooq-royal-leaf-tea",
    "name": "Mazooq Royal Leaf Tea",
    "category": "tea",
    "categoryLabel": "Assam Orthodox Tea",
    "subtitle": "Whole-leaf orthodox — fragrant & nuanced",
    "description": "A fragrant, golden-liquored orthodox Assam tea for the discerning palate. Notes of honey and dried fruit with a clean, brisk finish.",
    "story": "Crafted using the traditional orthodox method which preserves the integrity of the whole leaf, allowing complex aromatic notes to develop slowly across multiple steeps.",
    "origin": "Amingaon, Guwahati, Kamrup District, Assam - 781031",
    "fssaiNumber": "10326002000025",
    "ingredients": "100% Assam Black Tea (Orthodox)",
    "preparationOrUsage": "Steep 1 tsp in 95°C water for 3-5 minutes. Best enjoyed without milk.",
    "nutrition": {
      "calories": "0 kcal",
      "protein": "0g",
      "carbs": "0g",
      "fat": "0g",
      "sodium": "0mg"
    },
    "variants": [
      {
        "size": "250g",
        "price": 299,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 549,
        "weightInGrams": 500
      }
    ],
    "image": "/photos/royal-leaf-tea.png",
    "sortIndex": 2,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 215
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 195
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 175
      }
    ]
  },
  {
    "id": "mazooq-masala-chai-blend",
    "name": "Mazooq Masala Chai Blend",
    "category": "tea",
    "categoryLabel": "Spiced Assam Chai",
    "subtitle": "CTC tea + freshly ground spices",
    "tag": "House Favourite",
    "description": "Pre-blended Assam CTC tea with cardamom, ginger, cinnamon, clove & black pepper — ready-to-brew masala chai in one scoop.",
    "story": "Our master blender balances the spice profile so that no single ingredient dominates; the result is a chai that tastes as authentic as the street-side kulhad chai of Banaras.",
    "origin": "Amingaon, Guwahati, Kamrup District, Assam - 781031",
    "fssaiNumber": "10326002000025",
    "ingredients": "Assam CTC tea, cardamom, ginger, cinnamon, clove, black pepper",
    "preparationOrUsage": "Boil 1 tsp with 100ml water + 100ml milk + sugar. Simmer 4 minutes, strain, serve.",
    "nutrition": {
      "calories": "2 kcal",
      "protein": "0g",
      "carbs": "0g",
      "fat": "0g",
      "sodium": "1mg"
    },
    "variants": [
      {
        "size": "250g",
        "price": 249,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 459,
        "weightInGrams": 500
      }
    ],
    "image": "/photos/masala-chai-blend.png",
    "sortIndex": 3,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 180
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 160
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 140
      }
    ]
  },
  {
    "id": "mazooq-green-tea",
    "name": "Mazooq Green Tea",
    "category": "tea",
    "categoryLabel": "Assam Green Tea",
    "subtitle": "Whole-leaf green tea — delicate & vegetal",
    "description": "A delicate Assam green tea with grassy, vegetal notes and a soft golden-yellow cup. Naturally rich in antioxidants.",
    "story": "Sourced from the same estates as our black teas but processed without oxidation, preserving the natural catechins and delicate aroma.",
    "origin": "Amingaon, Guwahati, Kamrup District, Assam - 781031",
    "fssaiNumber": "10326002000025",
    "ingredients": "100% Assam Green Tea",
    "preparationOrUsage": "Steep 1 tsp in 80°C water for 2-3 minutes. Do not use boiling water.",
    "nutrition": {
      "calories": "0 kcal",
      "protein": "0g",
      "carbs": "0g",
      "fat": "0g",
      "sodium": "0mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 199,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 449,
        "weightInGrams": 250
      }
    ],
    "image": "/photos/green-tea.png",
    "sortIndex": 4,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 145
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 130
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 115
      }
    ]
  },
  {
    "id": "mazooq-premium-dates",
    "name": "Mazooq Premium Dates",
    "category": "dates",
    "categoryLabel": "Premium Soft Dates",
    "subtitle": "Soft, caramel-sweet everyday dates",
    "description": "Plump, soft-textured premium dates with a caramel-sweet finish — perfect for daily snacking, baking, and smoothies.",
    "story": "Selected for uniform plumpness and natural sweetness without any glucose coating or syrup infusion.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Premium Soft Dates",
    "preparationOrUsage": "Ready to eat. Refrigerate after opening for best freshness.",
    "nutrition": {
      "calories": "282 kcal",
      "protein": "2.5g",
      "carbs": "75g",
      "fat": "0.4g",
      "sodium": "2mg"
    },
    "variants": [
      {
        "size": "250g",
        "price": 199,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 369,
        "weightInGrams": 500
      },
      {
        "size": "1kg",
        "price": 699,
        "weightInGrams": 1000
      }
    ],
    "image": "/photos/premium-dates.png",
    "sortIndex": 5,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 145
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 130
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 115
      }
    ]
  },
  {
    "id": "mazooq-medjool-dates",
    "name": "Mazooq Medjool Dates",
    "category": "dates",
    "categoryLabel": "Royal Medjool",
    "subtitle": "Large, soft, royal Medjool dates",
    "tag": "Premium",
    "description": "The king of dates — large, soft, and luxuriously sweet with notes of toffee and honey. Sourced from select Jordan Valley harvests.",
    "story": "Medjool dates are considered the finest in the world; each piece is hand-sorted for size, plumpness, and skin integrity.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Medjool Dates",
    "preparationOrUsage": "Ready to eat. Pairs beautifully with coffee or as a natural dessert.",
    "nutrition": {
      "calories": "277 kcal",
      "protein": "1.8g",
      "carbs": "75g",
      "fat": "0.2g",
      "sodium": "1mg"
    },
    "variants": [
      {
        "size": "250g",
        "price": 349,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 649,
        "weightInGrams": 500
      }
    ],
    "image": "/photos/medjool-dates.png",
    "sortIndex": 6,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 470
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 420
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 375
      }
    ]
  },
  {
    "id": "mazooq-ajwa-dates",
    "name": "Mazooq Ajwa Dates",
    "category": "dates",
    "categoryLabel": "Sacred Ajwa",
    "subtitle": "Madinah Ajwa — dark, firm, prized",
    "tag": "Premium",
    "description": "Authentic Madinah Ajwa dates — dark, firm-textured, with a unique bittersweet profile prized across the Arabian peninsula.",
    "story": "Sourced directly from Madinah historic date farms, Ajwa dates are revered for their distinctive flavor and texture.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Ajwa Dates",
    "preparationOrUsage": "Ready to eat. Best consumed at room temperature.",
    "nutrition": {
      "calories": "281 kcal",
      "protein": "2.3g",
      "carbs": "76g",
      "fat": "0.3g",
      "sodium": "1mg"
    },
    "variants": [
      {
        "size": "250g",
        "price": 299,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 550,
        "weightInGrams": 500
      }
    ],
    "image": "/photos/ajwa-dates.png",
    "sortIndex": 7,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 220
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 200
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 180
      }
    ]
  },
  {
    "id": "mazooq-stuffed-dates",
    "name": "Mazooq Stuffed Dates",
    "category": "dates",
    "categoryLabel": "Stuffed Gourmet",
    "subtitle": "Soft dates stuffed with almond & cashew",
    "description": "Premium soft dates hand-stuffed with whole almonds and cashews — an elegant ready-to-serve delicacy for festive tables.",
    "story": "Each date is sliced and hand-filled in our Kerala facility to ensure perfect nut-to-fruit ratio in every bite.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Premium dates, almonds, cashews",
    "preparationOrUsage": "Ready to eat. Serve at room temperature for best flavor.",
    "nutrition": {
      "calories": "320 kcal",
      "protein": "4g",
      "carbs": "68g",
      "fat": "4g",
      "sodium": "3mg"
    },
    "variants": [
      {
        "size": "200g",
        "price": 249,
        "weightInGrams": 200
      },
      {
        "size": "400g",
        "price": 469,
        "weightInGrams": 400
      }
    ],
    "image": "/photos/stuffed-dates.png",
    "sortIndex": 8,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 180
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 165
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 145
      }
    ]
  },
  {
    "id": "mazooq-premium-cashews",
    "name": "Mazooq Premium Cashews (W240)",
    "category": "nuts",
    "categoryLabel": "Whole Cashews W240",
    "subtitle": "Premium grade W240 whole cashews",
    "tag": "Best Seller",
    "description": "Buttery, ivory-white W240 grade whole cashews with a clean crunch and natural creamy sweetness.",
    "story": "Sourced directly from Kerala coastal cashew belt; graded W240 (240 kernels per pound) for consistent size and quality.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Whole Cashews (W240 grade)",
    "preparationOrUsage": "Ready to eat. Store in airtight container away from sunlight.",
    "nutrition": {
      "calories": "553 kcal",
      "protein": "18g",
      "carbs": "30g",
      "fat": "44g",
      "sodium": "12mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 199,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 449,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 849,
        "weightInGrams": 500
      }
    ],
    "image": "/photos/premium-cashews.png",
    "sortIndex": 9,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 325
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 290
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 255
      }
    ]
  },
  {
    "id": "mazooq-salted-cashews",
    "name": "Mazooq Salted Cashews",
    "category": "nuts",
    "categoryLabel": "Roasted Salted",
    "subtitle": "Slow-roasted with Himalayan pink salt",
    "description": "Whole cashews slow-roasted in small batches with a touch of Himalayan pink salt for an addictive savory-sweet balance.",
    "story": "Roasted at low temperature to preserve the natural oils and creamy texture without becoming oily or rancid.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Cashews, Himalayan pink salt, sunflower oil",
    "preparationOrUsage": "Ready to eat. Best within 30 days of opening.",
    "nutrition": {
      "calories": "560 kcal",
      "protein": "17g",
      "carbs": "29g",
      "fat": "45g",
      "sodium": "420mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 189,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 429,
        "weightInGrams": 250
      }
    ],
    "image": "/photos/salted-cashews.png",
    "sortIndex": 10,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 140
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 125
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 110
      }
    ]
  },
  {
    "id": "mazooq-premium-almonds",
    "name": "Mazooq Premium Almonds",
    "category": "nuts",
    "categoryLabel": "Whole Almonds",
    "subtitle": "Whole California-grade almonds",
    "description": "Plump, sweet, whole almonds with a satisfying snap — rich in protein, fiber, and vitamin E.",
    "story": "Selected for uniform plumpness and clean skin; ideal for daily snacking, baking, and garnishing.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Whole Almonds",
    "preparationOrUsage": "Ready to eat. Soak overnight for easier digestion.",
    "nutrition": {
      "calories": "579 kcal",
      "protein": "21g",
      "carbs": "22g",
      "fat": "50g",
      "sodium": "1mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 179,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 399,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 749,
        "weightInGrams": 500
      }
    ],
    "image": "/photos/premium-almonds.png",
    "sortIndex": 11,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 130
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 115
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 100
      }
    ]
  },
  {
    "id": "mazooq-golden-raisins",
    "name": "Mazooq Golden Raisins (Kishmish)",
    "category": "nuts",
    "categoryLabel": "Golden Raisins",
    "subtitle": "Sun-dried golden kishmish",
    "description": "Plump, sun-dried golden raisins with a delicate floral sweetness — ideal for baking, trail mixes, and festive cooking.",
    "story": "Sulfur-treated sun-drying preserves the bright golden hue while concentrating the natural fruit sugars.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Golden Raisins (with permitted preservative E220)",
    "preparationOrUsage": "Ready to eat. Wash before use in baking.",
    "nutrition": {
      "calories": "299 kcal",
      "protein": "3g",
      "carbs": "79g",
      "fat": "0.5g",
      "sodium": "11mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 129,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 279,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 499,
        "weightInGrams": 500
      }
    ],
    "image": "/photos/golden-raisins.png",
    "sortIndex": 12,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 95
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 85
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 75
      }
    ]
  },
  {
    "id": "mazooq-kerala-banana-chips",
    "name": "Mazooq Kerala Banana Chips",
    "category": "snacks",
    "categoryLabel": "Kerala Banana Chips",
    "subtitle": "Thin-sliced, fried in pure coconut oil",
    "tag": "Best Seller",
    "description": "Authentic Kerala-style banana chips — thin-sliced raw Nendran bananas fried in 100% cold-pressed coconut oil with a touch of pink salt.",
    "story": "Made in our Palakkad facility using the legendary Nendran banana variety native to Kerala, fried exclusively in pure coconut oil (no palm oil).",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Nendran banana, coconut oil, pink salt, turmeric",
    "preparationOrUsage": "Ready to eat. Consume within 7 days of opening for crunch.",
    "nutrition": {
      "calories": "536 kcal",
      "protein": "2g",
      "carbs": "58g",
      "fat": "32g",
      "sodium": "380mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 99,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 219,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 399,
        "weightInGrams": 500
      }
    ],
    "image": "/photos/kerala-banana-chips.png",
    "sortIndex": 13,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 155
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 135
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 118
      }
    ]
  },
  {
    "id": "mazooq-peri-peri-banana-chips",
    "name": "Mazooq Peri Peri Banana Chips",
    "category": "snacks",
    "categoryLabel": "Spiced Banana Chips",
    "subtitle": "Fiery peri peri seasoned",
    "description": "Banana chips coated in a smoky peri peri spice blend — heat, smoke, and crunch in every bite.",
    "story": "Our signature peri peri blend balances African bird eye chili with smoked paprika and a hint of citrus.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Banana, coconut oil, peri peri spice blend (chili, paprika, garlic, lemon, oregano), salt",
    "preparationOrUsage": "Ready to eat. Best paired with chilled beverages.",
    "nutrition": {
      "calories": "540 kcal",
      "protein": "2g",
      "carbs": "57g",
      "fat": "32g",
      "sodium": "450mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 109,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 239,
        "weightInGrams": 250
      }
    ],
    "image": "/photos/peri-peri-banana-chips.png",
    "sortIndex": 14,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 80
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 70
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 60
      }
    ]
  },
  {
    "id": "mazooq-black-pepper-banana-chips",
    "name": "Mazooq Black Pepper Banana Chips",
    "category": "snacks",
    "categoryLabel": "Peppered Banana Chips",
    "subtitle": "Bold cracked black pepper",
    "description": "Banana chips dusted generously with cracked Tellicherry black pepper — warm, woody heat with citrus undertones.",
    "story": "Uses authentic Tellicherry peppercorns from Kerala Malabar coast, the world premier pepper origin.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Banana, coconut oil, black pepper, salt, turmeric",
    "preparationOrUsage": "Ready to eat. Pairs well with tea or coffee.",
    "nutrition": {
      "calories": "538 kcal",
      "protein": "2g",
      "carbs": "57g",
      "fat": "32g",
      "sodium": "410mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 109,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 239,
        "weightInGrams": 250
      }
    ],
    "image": "/photos/black-pepper-banana-chips.png",
    "sortIndex": 15,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 80
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 70
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 60
      }
    ]
  },
  {
    "id": "mazooq-tapioca-chips",
    "name": "Mazooq Tapioca Chips (Kappa)",
    "category": "snacks",
    "categoryLabel": "Tapioca Chips",
    "subtitle": "Crunchy Kerala kappa chips",
    "description": "Thin-sliced sun-dried tapioca (kappa) fried in coconut oil — extra crunchy with a clean, starchy sweetness.",
    "story": "A Kerala homestead classic; tapioca is soaked, sliced, sun-dried, then fried in small batches.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Tapioca, coconut oil, salt, turmeric",
    "preparationOrUsage": "Ready to eat. Excellent with evening chai.",
    "nutrition": {
      "calories": "510 kcal",
      "protein": "1g",
      "carbs": "64g",
      "fat": "27g",
      "sodium": "380mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 99,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 219,
        "weightInGrams": 250
      }
    ],
    "image": "/photos/tapioca-chips.png",
    "sortIndex": 16,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 75
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 65
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 55
      }
    ]
  },
  {
    "id": "mazooq-turmeric-powder",
    "name": "Mazooq Pure Turmeric Powder",
    "category": "spices",
    "categoryLabel": "High-Curcumin Turmeric",
    "subtitle": "Lakadong variety — 7%+ curcumin",
    "tag": "Premium",
    "description": "Stone-ground Lakadong turmeric from Meghalaya — prized for its deep orange color, earthy aroma, and curcumin content above 7%.",
    "story": "Lakadong is globally recognized as one of the finest turmeric varieties; we source directly from tribal farmer cooperatives in the Jaintia Hills.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "100% Lakadong Turmeric Powder",
    "preparationOrUsage": "Add 1/2 tsp to curries, milk, or smoothies. Pairs with black pepper for absorption.",
    "nutrition": {
      "calories": "354 kcal",
      "protein": "8g",
      "carbs": "65g",
      "fat": "10g",
      "sodium": "38mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 79,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 169,
        "weightInGrams": 250
      },
      {
        "size": "500g",
        "price": 319,
        "weightInGrams": 500
      }
    ],
    "image": "/photos/turmeric-powder.png",
    "sortIndex": 17,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 118
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 102
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 88
      }
    ]
  },
  {
    "id": "mazooq-kashmiri-chilli-powder",
    "name": "Mazooq Kashmiri Chilli Powder",
    "category": "spices",
    "categoryLabel": "Kashmiri Chilli",
    "subtitle": "Vibrant red, mild heat",
    "description": "Sun-dried Kashmiri chillies ground to a brilliant red powder — prized for color with mild, fragrant heat (1500-2000 SHU).",
    "story": "Authentic Kashmiri chillies give curries their signature deep red color without overwhelming heat.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "100% Kashmiri Chilli Powder",
    "preparationOrUsage": "Add 1 tsp to curries for rich red color. Adjust to taste.",
    "nutrition": {
      "calories": "282 kcal",
      "protein": "14g",
      "carbs": "54g",
      "fat": "6g",
      "sodium": "30mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 99,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 219,
        "weightInGrams": 250
      }
    ],
    "image": "/photos/kashmiri-chilli-powder.png",
    "sortIndex": 18,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 75
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 65
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 55
      }
    ]
  },
  {
    "id": "mazooq-garam-masala",
    "name": "Mazooq Royal Garam Masala",
    "category": "spices",
    "categoryLabel": "Garam Masala Blend",
    "subtitle": "11 spices, stone-ground",
    "description": "A regal 11-spice garam masala — stone-ground in small batches to preserve volatile aromatics. Cardamom-forward with a warm, complex finish.",
    "story": "Our family recipe balances eleven whole spices, dry-roasted separately and ground fresh to retain aromatic integrity.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Cardamom, cinnamon, clove, black pepper, cumin, coriander, bay leaf, fennel, mace, nutmeg, star anise",
    "preparationOrUsage": "Add 1 tsp at the end of cooking to preserve aroma. Do not overcook.",
    "nutrition": {
      "calories": "275 kcal",
      "protein": "11g",
      "carbs": "40g",
      "fat": "12g",
      "sodium": "40mg"
    },
    "variants": [
      {
        "size": "100g",
        "price": 119,
        "weightInGrams": 100
      },
      {
        "size": "250g",
        "price": 269,
        "weightInGrams": 250
      }
    ],
    "image": "/photos/garam-masala.png",
    "sortIndex": 19,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 90
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 80
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 70
      }
    ]
  },
  {
    "id": "mazooq-indian-chai-spice",
    "name": "Mazooq Indian Chai Spice (Masala)",
    "category": "spices",
    "categoryLabel": "Chai Spice Mix",
    "subtitle": "Ready-to-brew chai masala powder",
    "description": "A finely milled chai masala blend — add a pinch to boiling tea for an instant aromatic uplift.",
    "story": "A concentrated all-in-one blend; a small pinch transforms ordinary milk tea into aromatic masala chai.",
    "origin": "Nellaya, Ottappalam, Palakkad, Kerala - 679335",
    "fssaiNumber": "11325009001048",
    "ingredients": "Ginger, cardamom, cinnamon, clove, black pepper, nutmeg",
    "preparationOrUsage": "Add 1/4 tsp per cup of boiling chai. Strain and serve.",
    "nutrition": {
      "calories": "290 kcal",
      "protein": "6g",
      "carbs": "55g",
      "fat": "8g",
      "sodium": "35mg"
    },
    "variants": [
      {
        "size": "50g",
        "price": 99,
        "weightInGrams": 50
      },
      {
        "size": "100g",
        "price": 179,
        "weightInGrams": 100
      }
    ],
    "image": "/photos/indian-chai-spice.png",
    "sortIndex": 20,
    "retailerPricing": [
      {
        "minQty": 10,
        "maxQty": 24,
        "pricePerUnit": 70
      },
      {
        "minQty": 25,
        "maxQty": 49,
        "pricePerUnit": 60
      },
      {
        "minQty": 50,
        "maxQty": null,
        "pricePerUnit": 50
      }
    ]
  }
];

export const PRODUCT_MAP: Record<string, Product> = PRODUCTS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<string, Product>
);
