export interface ProductVariant {
  size: string;
  price: number;
  weightInGrams: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'tea' | 'dates' | 'nuts' | 'snacks' | 'spices';
  categoryLabel: string;
  subtitle: string;
  tag?: string;
  rating: number;
  reviewsCount: number;
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
  variants: ProductVariant[];
  image: string;
  isComingSoon?: boolean;
}

export const PRODUCTS: Product[] = [
  // 1. Mazooq Premium Gold Tea (Flagship)
  {
    id: 'mazooq-premium-gold-tea',
    name: 'Mazooq Premium Gold Tea',
    category: 'tea',
    categoryLabel: 'Assam Black Tea',
    subtitle: 'Rich aroma, bold liquor, crafted from selected CTC leaves in Guwahati',
    tag: 'Featured',
    rating: 4.9,
    reviewsCount: 184,
    description: 'Mazooq Premium Gold Tea is carefully selected from the finest 100% Assam tea gardens and expertly blended to deliver a rich aroma, bold flavor, and deeply satisfying cup every single morning.',
    story: 'Harvested during peak second-flush in the Brahmaputra Valley, where nutrient-rich alluvial soils produce leaves with exceptional golden tips and brisk, malty character.',
    origin: 'Amingaon, Guwahati, Kamrup District, Assam - 781031',
    fssaiNumber: '10326002000025',
    ingredients: '100% Assam Black Tea (Camellia sinensis)',
    preparationOrUsage: 'Use freshly boiled water. Brew 3-5 minutes depending on desired strength. Perfect with fresh milk or served black with a drop of honey.',
    nutrition: {
      calories: 'Traces',
      protein: 'Traces',
      carbs: 'Traces',
      fat: 'Nil',
      sodium: 'Nil',
    },
    variants: [
      { size: '250g', price: 199, weightInGrams: 250 },
      { size: '500g', price: 379, weightInGrams: 500 },
      { size: '1kg', price: 729, weightInGrams: 1000 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBugD0a5HZU0ju_QMqO8ICEGZ7HNyzz3QDpOD68BFLVhcyZkCc6S9FspUeXz4GFJh4aKjDSjQUzIr9f1WfPrn60jo1tpee9KjVQtKSe7DSq4gnp0eESkdBTs3NEkwqCigEyVvTvEy2CqDdMsEChkMTCNa3JWqgH42TqOVqCrfWe1ukxi-Ju0XJHR2EyQLzg1d-qHwxkFmuqQBQqgRpzvva8p4D5MlJ-MVlK9hfxb8u7Sa8NVLwbLpO_JSmqZiF7agNV6qA',
  },

  // 2. Mazooq Assam Black Tea
  {
    id: 'mazooq-assam-black-tea',
    name: 'Mazooq Assam Black Tea',
    category: 'tea',
    categoryLabel: 'Single Estate',
    subtitle: 'Crisp, energizing brisk flavour profile for everyday royal chai brewing',
    tag: 'Single Origin',
    rating: 4.8,
    reviewsCount: 96,
    description: 'Crisp, unblended whole CTC tea leaves delivering a bright amber liquor and clean earthy notes. Pure unadulterated Assam character.',
    story: 'Directly sourced from trusted partner tea gardens along the Brahmaputra banks, ensuring complete traceability and single-origin authenticity.',
    origin: 'Kamrup District, Assam - 781031',
    fssaiNumber: '10326002000025',
    ingredients: '100% Pure Assam Black Tea',
    preparationOrUsage: 'Boil fresh water, steep 1 teaspoon per cup for 3-4 minutes. Strain and enjoy.',
    nutrition: {
      calories: 'Traces',
      protein: 'Traces',
      carbs: 'Traces',
      fat: 'Nil',
      sodium: 'Nil',
    },
    variants: [
      { size: '100g', price: 149, weightInGrams: 100 },
      { size: '250g', price: 249, weightInGrams: 250 },
      { size: '500g', price: 449, weightInGrams: 500 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAfacxadKhOmKgB08XVKmdz3thCJ2Vcr7OZDNK4Lbwr8z1lFGTkB-su0VgVHHCRG8jLqnIAC6-0dyBAzDfCFjF-ZRWRTI4P0xcohzR5ThXrv6WfOVeIUpQu3AHAbMmtGWqUJJiIqLEF07z8Az8BWHnnI-I43n4d5vRzDnswQr5tHvHw7ID361LBPRJQyBr_Do5JJJw4Xbod5ECICVAXMyiP6DK-bsoH-TQuKySMT7SrFanktvLgBejrjfmU-CVXoEpXyE',
  },

  // 3. Mazooq Assam Masala Tea
  {
    id: 'mazooq-assam-masala-tea',
    name: 'Mazooq Assam Masala Tea',
    category: 'tea',
    categoryLabel: 'Spiced CTC',
    subtitle: 'Infused with real crushed green cardamom, clove, ginger, and cinnamon bark',
    tag: 'Ayurvedic Blend',
    rating: 4.9,
    reviewsCount: 142,
    description: 'A harmonious blend of full-bodied Assam black tea and six hand-pounded aromatic Indian spices, creating an invigorating cup of authentic masala chai.',
    story: 'Formulated following traditional royal chai proportions with sun-dried Wayanad ginger, Idukki green cardamom, and Kerala cloves.',
    origin: 'Blended in Guwahati, Assam & Palakkad, Kerala',
    fssaiNumber: '10326002000025',
    ingredients: 'Assam Black Tea (85%), Cardamom, Dried Ginger, Cinnamon, Clove, Star Anise, Black Pepper',
    preparationOrUsage: 'Simmer equal parts water and milk with 1 generous teaspoon for 4 minutes. Sweeten with jaggery or raw sugar.',
    nutrition: {
      calories: '2 kcal',
      protein: '0.1g',
      carbs: '0.4g',
      fat: 'Nil',
      sodium: 'Nil',
    },
    variants: [
      { size: '100g', price: 169, weightInGrams: 100 },
      { size: '250g', price: 289, weightInGrams: 250 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3kC6WRRXS_DqhlXKdMBxcyRE_0owEz5ah67IWaK0eCGOWU1PK2oMtPCjfCoqFS-caVBpfuNOUFNurElTeLKPHYn2uXhk4yYTZAwOo3po4QZXVEzqJtb4HZJ-Q6ikTI6jgrnOJ0eCWx79DFV2cprDP4f49McSA9zJZrgaMjH0hi_vWtvWW8XtuD9tB-UuMTqDJtfDdnzjWWENkCAK0vKNifZw4DoMvbiaVRs-QkhRFxVd1sGdO8gTtAUAZFADyiqf3Wa0',
  },

  // 4. Mazooq Classic Chai Blend
  {
    id: 'mazooq-classic-chai-blend',
    name: 'Mazooq Classic Chai Blend',
    category: 'tea',
    categoryLabel: 'Heritage CTC',
    subtitle: 'Harmonious balanced cut designed for milk teas, delivering a deep golden colour',
    tag: 'Everyday Favourite',
    rating: 4.7,
    reviewsCount: 110,
    description: 'Expertly granulated CTC tea designed to infuse rapidly and stand up to hot rich milk without losing its distinctive tea notes.',
    story: 'Crafted for tea stalls, bustling households, and discerning breakfast tables across India seeking strength, briskness, and consistency.',
    origin: 'Amingaon, Guwahati, Kamrup, Assam',
    fssaiNumber: '10326002000025',
    ingredients: '100% CTC Black Tea',
    preparationOrUsage: 'Bring water to boil, add milk and tea granules, simmer for 3 minutes for deep amber liquor.',
    nutrition: {
      calories: 'Traces',
      protein: 'Traces',
      carbs: 'Traces',
      fat: 'Nil',
      sodium: 'Nil',
    },
    variants: [
      { size: '100g', price: 159, weightInGrams: 100 },
      { size: '250g', price: 269, weightInGrams: 250 },
      { size: '500g', price: 489, weightInGrams: 500 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNgrIL6hklbxJmNvnkq-DqD8Qmb9AYCH2b4PizVktcmg4AuD3Rt16tJMcKBHRB3eddanH0gwtRmPLnHp2G0kuwaN944LbyElKgIPQWKDdRs7nu98_XSxMEQ3MwVygOuUTRdFIASbnEclp7stMvZcntIlolkcFF14MYAHPis73GdOkuap2K_PPj79ydPxS6CgjdbowAadl7EJdRgXkipIQhNVX3zfhv4cjMGaG2UggfJ9dieHU1f4baDBMp1SATYBHCDiA',
  },

  // 5. Mazooq Premium Dates
  {
    id: 'mazooq-premium-dates',
    name: 'Mazooq Premium Dates',
    category: 'dates',
    categoryLabel: 'Hand Selected',
    subtitle: 'Naturally sweet, tender whole dates rich in potassium and energy',
    tag: 'Royal Selection',
    rating: 4.9,
    reviewsCount: 78,
    description: 'Selected for uniform plumpness and silky texture. Mazooq Premium Dates provide clean sustained stamina with no added syrups or glucose glazing.',
    story: 'Carefully sorted by hand in temperature-controlled facilities to preserve moisture, vitamins, and natural fructose.',
    origin: 'Grown in certified groves, packed by Mazooq Foods Palakkad',
    fssaiNumber: '11325009001048',
    ingredients: '100% Pure Selected Whole Dates',
    preparationOrUsage: 'Enjoy directly as an energizing snack, paired with Arabic black tea or chopped over morning muesli.',
    nutrition: {
      calories: '282 kcal / 100g',
      protein: '2.5g',
      carbs: '75g',
      fat: '0.4g',
      sodium: '2mg',
    },
    variants: [
      { size: '250g', price: 199, weightInGrams: 250 },
      { size: '500g', price: 369, weightInGrams: 500 },
      { size: '1kg', price: 699, weightInGrams: 1000 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpVBWCsAdw7Ijvu4BNHSjggsOu4iVxR8Tx3H6rw3au2bF2SpvALnz5F08f-DJSaeJHkMCW2tWIqe4nmolVqN_tQszOKpu6DbGBxrTASqJdzUxY4YBYqtw_Nm7hw7GxYM95Nxc1aXkHRb3KtvlG_KfcLtXftH8fLtHBqC_suwXOf4AQtlFRJCyx6z8IpAVqxnf1Vk5dGGnZL6STr8JrHwD7NcTc1ewnN-d1_voKHWzNOo7dR2SSH4dL4Q',
    isComingSoon: false,
  },

  // 6. Mazooq Medjool Dates
  {
    id: 'mazooq-medjool-dates',
    name: 'Mazooq Medjool Dates',
    category: 'dates',
    categoryLabel: 'King of Dates',
    subtitle: 'Large, succulent dates with a rich caramel-like taste and velvety flesh',
    tag: 'Gourmet Reserve',
    rating: 5.0,
    reviewsCount: 64,
    description: 'Jumbo Medjool dates prized for their soft, melt-in-the-mouth consistency and delicate notes of wild honey and browned butter.',
    story: 'Regarded globally as the monarch of desert dates, picked at optimal maturity to ensure zero skin separation and full pulp density.',
    origin: 'Single-estate certified desert groves',
    fssaiNumber: '11325009001048',
    ingredients: '100% Premium Medjool Dates',
    preparationOrUsage: 'Serve on luxury platters with walnuts or artisan goat cheese, or savor alongside freshly brewed black tea.',
    nutrition: {
      calories: '277 kcal / 100g',
      protein: '1.8g',
      carbs: '75g',
      fat: '0.2g',
      sodium: '1mg',
    },
    variants: [
      { size: '250g', price: 349, weightInGrams: 250 },
      { size: '500g', price: 649, weightInGrams: 500 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpVBWCsAdw7Ijvu4BNHSjggsOu4iVxR8Tx3H6rw3au2bF2SpvALnz5F08f-DJSaeJHkMCW2tWIqe4nmolVqN_tQszOKpu6DbGBxrTASqJdzUxY4YBYqtw_Nm7hw7GxYM95Nxc1aXkHRb3KtvlG_KfcLtXftH8fLtHBqC_suwXOf4AQtlFRJCyx6z8IpAVqxnf1Vk5dGGnZL6STr8JrHwD7NcTc1ewnN-d1_voKHWzNOo7dR2SSH4dL4Q',
  },

  // 7. Mazooq Ajwa Dates
  {
    id: 'mazooq-ajwa-dates',
    name: 'Mazooq Ajwa Dates',
    category: 'dates',
    categoryLabel: 'Heritage Sacred Fruit',
    subtitle: 'Authentic dark dates known for softness, gentle sweetness and wellness benefits',
    tag: 'Sacred Heritage',
    rating: 5.0,
    reviewsCount: 89,
    description: 'Dense, smooth, and richly dark with fine white striations. Cherished for centuries for dietary wellness and spiritual significance.',
    story: 'Grown in ancient date palms using sustainable low-tillage methods and packed into oxygen-barrier containers.',
    origin: 'Selected heritage farms',
    fssaiNumber: '11325009001048',
    ingredients: '100% Ajwa Dates',
    preparationOrUsage: 'Tradition recommends enjoying 3 to 7 Ajwa dates in the morning on an empty stomach with warm water.',
    nutrition: {
      calories: '280 kcal / 100g',
      protein: '2.4g',
      carbs: '72g',
      fat: '0.3g',
      sodium: '3mg',
    },
    variants: [
      { size: '250g', price: 299, weightInGrams: 250 },
      { size: '500g', price: 550, weightInGrams: 500 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpVBWCsAdw7Ijvu4BNHSjggsOu4iVxR8Tx3H6rw3au2bF2SpvALnz5F08f-DJSaeJHkMCW2tWIqe4nmolVqN_tQszOKpu6DbGBxrTASqJdzUxY4YBYqtw_Nm7hw7GxYM95Nxc1aXkHRb3KtvlG_KfcLtXftH8fLtHBqC_suwXOf4AQtlFRJCyx6z8IpAVqxnf1Vk5dGGnZL6STr8JrHwD7NcTc1ewnN-d1_voKHWzNOo7dR2SSH4dL4Q',
  },

  // 8. Mazooq Stuffed Dates
  {
    id: 'mazooq-stuffed-dates',
    name: 'Mazooq Stuffed Dates',
    category: 'dates',
    categoryLabel: 'Gourmet Cask',
    subtitle: 'Filled with slow-roasted almonds, pistachios, and orange blossom essence',
    tag: 'Artisanal Confection',
    rating: 4.9,
    reviewsCount: 45,
    description: 'Plump pitted dates generously hand-filled with crunchy roasted California almonds, Iranian pistachios, and candied citrus zest.',
    story: 'Designed as a bespoke gifting delicacy for weddings, corporate celebrations, and festive gatherings across the subcontinent and the GCC.',
    origin: 'Packed by Mazooq Foods Private Limited, Kerala',
    fssaiNumber: '11325009001048',
    ingredients: 'Medjool Dates, Roasted Almonds, Roasted Pistachios, Candied Orange Peel',
    preparationOrUsage: 'Ready to serve. Store in a cool dry place away from heat.',
    nutrition: {
      calories: '340 kcal / 100g',
      protein: '5.2g',
      carbs: '68g',
      fat: '8.4g',
      sodium: '4mg',
    },
    variants: [
      { size: '200g', price: 249, weightInGrams: 200 },
      { size: '400g', price: 469, weightInGrams: 400 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpVBWCsAdw7Ijvu4BNHSjggsOu4iVxR8Tx3H6rw3au2bF2SpvALnz5F08f-DJSaeJHkMCW2tWIqe4nmolVqN_tQszOKpu6DbGBxrTASqJdzUxY4YBYqtw_Nm7hw7GxYM95Nxc1aXkHRb3KtvlG_KfcLtXftH8fLtHBqC_suwXOf4AQtlFRJCyx6z8IpAVqxnf1Vk5dGGnZL6STr8JrHwD7NcTc1ewnN-d1_voKHWzNOo7dR2SSH4dL4Q',
  },

  // 9. Mazooq Premium Cashews
  {
    id: 'mazooq-premium-cashews',
    name: 'Mazooq Premium Cashews (W240)',
    category: 'nuts',
    categoryLabel: 'W240 Grade',
    subtitle: 'Crisp, creamy whole jumbo kernels gently sorted for buttery natural richness',
    tag: 'Bestseller',
    rating: 4.9,
    reviewsCount: 165,
    description: 'Export-grade W240 whole cashew kernels. Renowned for their jumbo crescent shape, ivory shade, and naturally buttery, sweet taste.',
    story: 'Sourced from the coastal cashew belts of Kerala and Goa, slow-dried to lock in essential minerals, healthy fats, and crisp bite.',
    origin: 'Palakkad Dist., Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: '100% Whole Cashew Nuts (Grade W240)',
    preparationOrUsage: 'Enjoy straight from the pouch, toss in royal kormas, or roast lightly in pure ghee.',
    nutrition: {
      calories: '553 kcal / 100g',
      protein: '18.2g',
      carbs: '30.1g',
      fat: '43.8g',
      sodium: '12mg',
    },
    variants: [
      { size: '100g', price: 199, weightInGrams: 100 },
      { size: '250g', price: 449, weightInGrams: 250 },
      { size: '500g', price: 849, weightInGrams: 500 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWg9usFzJ__iR09vd6gQK3XVp2kOSzExZaMvLa_mroWQ8nn_XiAdOrlCVwbyqsi-T8YSyCCoaVWEod40nDTg7wFf9JoVUBD13fWX72K-mVs0iIAI-zBRsZJMdIdMbgsfLDAi2pP-1NLMthX8LaltQAZZ04pXOm76TqG45TP9zBU6DVp-UO1eIaiiYiC1CusLjsHtX_oDRvnIR8i40mnUPSXzKGCV88pq6p-zAouu5U4hJKMYz-eFhlbw',
  },

  // 10. Mazooq Salted Cashews
  {
    id: 'mazooq-salted-cashews',
    name: 'Mazooq Salted Cashews',
    category: 'nuts',
    categoryLabel: 'Lightly Roasted',
    subtitle: 'Evenly toasted with rock salt for a balanced, sophisticated crunch',
    tag: 'Himalayan Salt',
    rating: 4.8,
    reviewsCount: 112,
    description: 'Slow-roasted jumbo cashews gently dusted with Himalayan rock salt. Oil-free roasting ensures a crisp texture without excess greasiness.',
    story: 'Roaster master batch-prepared to deliver a uniform golden toast and snappy snap in every single kernel.',
    origin: 'Kerala Processing Center, Palakkad',
    fssaiNumber: '11325009001048',
    ingredients: 'Cashew Nuts, Himalayan Pink Salt',
    preparationOrUsage: 'The ideal accompaniment to afternoon tea or high-end evening receptions.',
    nutrition: {
      calories: '560 kcal / 100g',
      protein: '18.5g',
      carbs: '29.5g',
      fat: '44.0g',
      sodium: '240mg',
    },
    variants: [
      { size: '100g', price: 189, weightInGrams: 100 },
      { size: '250g', price: 429, weightInGrams: 250 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWg9usFzJ__iR09vd6gQK3XVp2kOSzExZaMvLa_mroWQ8nn_XiAdOrlCVwbyqsi-T8YSyCCoaVWEod40nDTg7wFf9JoVUBD13fWX72K-mVs0iIAI-zBRsZJMdIdMbgsfLDAi2pP-1NLMthX8LaltQAZZ04pXOm76TqG45TP9zBU6DVp-UO1eIaiiYiC1CusLjsHtX_oDRvnIR8i40mnUPSXzKGCV88pq6p-zAouu5U4hJKMYz-eFhlbw',
  },

  // 11. Mazooq Premium Almonds
  {
    id: 'mazooq-premium-almonds',
    name: 'Mazooq Premium Almonds',
    category: 'nuts',
    categoryLabel: 'Hand Picked',
    subtitle: 'Crisp whole almonds packed with Vitamin E, protein, and heart-healthy oils',
    tag: 'Unpolished',
    rating: 4.8,
    reviewsCount: 94,
    description: '100% natural raw whole almonds with full skin integrity. Free from artificial chemical waxes or gloss polishing.',
    story: 'Graded by density and size to guarantee crunchy texture and sweet nutty finish.',
    origin: 'Mazooq Foods Selection, Kerala',
    fssaiNumber: '11325009001048',
    ingredients: '100% Raw Whole Almonds',
    preparationOrUsage: 'Soak overnight in water for morning vitality, or eat fresh as a high-protein mid-day snack.',
    nutrition: {
      calories: '579 kcal / 100g',
      protein: '21.1g',
      carbs: '21.6g',
      fat: '49.9g',
      sodium: '1mg',
    },
    variants: [
      { size: '100g', price: 179, weightInGrams: 100 },
      { size: '250g', price: 399, weightInGrams: 250 },
      { size: '500g', price: 749, weightInGrams: 500 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWg9usFzJ__iR09vd6gQK3XVp2kOSzExZaMvLa_mroWQ8nn_XiAdOrlCVwbyqsi-T8YSyCCoaVWEod40nDTg7wFf9JoVUBD13fWX72K-mVs0iIAI-zBRsZJMdIdMbgsfLDAi2pP-1NLMthX8LaltQAZZ04pXOm76TqG45TP9zBU6DVp-UO1eIaiiYiC1CusLjsHtX_oDRvnIR8i40mnUPSXzKGCV88pq6p-zAouu5U4hJKMYz-eFhlbw',
  },

  // 12. Mazooq Golden Raisins
  {
    id: 'mazooq-golden-raisins',
    name: 'Mazooq Golden Raisins (Kishmish)',
    category: 'nuts',
    categoryLabel: 'Natural Sweet',
    subtitle: 'Long golden Kishmish with a tangy honey note, ideal for festive desserts',
    tag: 'Sun Dried',
    rating: 4.7,
    reviewsCount: 82,
    description: 'Lustrous, seedless golden green raisins with tender flesh and a delicate honeyed tang. Sourced from the vineyard valleys of Nashik and Sangli.',
    story: 'Air-dried in shade-houses under optimal breezes to retain golden translucency and moisture balance.',
    origin: 'Maharashtra & packed in Kerala',
    fssaiNumber: '11325009001048',
    ingredients: '100% Golden Raisins (Sultanas)',
    preparationOrUsage: 'Garnish festive biryanis, slow-cooked payasam, or combine with nuts for everyday trail mix.',
    nutrition: {
      calories: '299 kcal / 100g',
      protein: '3.1g',
      carbs: '79.2g',
      fat: '0.5g',
      sodium: '11mg',
    },
    variants: [
      { size: '100g', price: 129, weightInGrams: 100 },
      { size: '250g', price: 279, weightInGrams: 250 },
      { size: '500g', price: 499, weightInGrams: 500 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWg9usFzJ__iR09vd6gQK3XVp2kOSzExZaMvLa_mroWQ8nn_XiAdOrlCVwbyqsi-T8YSyCCoaVWEod40nDTg7wFf9JoVUBD13fWX72K-mVs0iIAI-zBRsZJMdIdMbgsfLDAi2pP-1NLMthX8LaltQAZZ04pXOm76TqG45TP9zBU6DVp-UO1eIaiiYiC1CusLjsHtX_oDRvnIR8i40mnUPSXzKGCV88pq6p-zAouu5U4hJKMYz-eFhlbw',
  },

  // 13. Mazooq Kerala Banana Chips
  {
    id: 'mazooq-kerala-banana-chips',
    name: 'Mazooq Kerala Banana Chips',
    category: 'snacks',
    categoryLabel: 'Nendran Variety',
    subtitle: 'Crisped in 100% pure coconut oil, perfectly salted for authentic Kerala crunch',
    tag: 'Bestseller',
    rating: 4.9,
    reviewsCount: 230,
    description: 'Handcrafted wafer-thin slices of raw green Nendran plantains fried in 100% pure unadulterated cold-pressed coconut oil, sprinkled lightly with pure sea salt.',
    story: 'Prepared in small artisanal batches following God’s Own Country’s centuries-old culinary method in Palakkad.',
    origin: 'Ezhuvanthala, Palakkad Dist., Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Raw Nendran Bananas, Pure Coconut Oil, Salt, Turmeric Powder',
    preparationOrUsage: 'Crisp and ready to enjoy with evening tea, gatherings, or festival sadhyas.',
    nutrition: {
      calories: '510 kcal / 100g',
      protein: '2.8g',
      carbs: '62.0g',
      fat: '28.5g',
      sodium: '190mg',
    },
    variants: [
      { size: '100g', price: 99, weightInGrams: 100 },
      { size: '250g', price: 219, weightInGrams: 250 },
      { size: '500g', price: 399, weightInGrams: 500 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBClIRZ-lAygkIzfhsI71RdtlXJrqJV9YO40ocUY-QzyGHBITbEi_QmgpQiKAd7TWUtGPxtMGcTmNrSUEWzGTH55hAgQn1JGn5-Ardir7RvzQ8OHHEKY4GCfzNBdW-q1t8vEHMojxyPL7kMW68irU8Cwcze0aRY591qs173SS1r7DSmEhgFuC_fVbqQM_am5Kj909ws4ZMcVGcbpMLbpeDsRjOXwNeWVGqIYlcV_IsU77ldWdIycYf6TQ',
  },

  // 14. Mazooq Peri Peri Banana Chips
  {
    id: 'mazooq-peri-peri-banana-chips',
    name: 'Mazooq Peri Peri Banana Chips',
    category: 'snacks',
    categoryLabel: 'Fiery Seasoning',
    subtitle: 'Zesty paprika, garlic, and tangy lemon spice tossed over golden crisps',
    tag: 'Spicy Twist',
    rating: 4.8,
    reviewsCount: 104,
    description: 'Crisp Kerala Nendran banana slices dusted in a bespoke African Bird’s Eye chilli and garlic rub. Punchy, aromatic, and addictive.',
    story: 'Infusing modern international palate preferences with traditional Kerala plantain crisps.',
    origin: 'Palakkad Dist., Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Raw Bananas, Pure Coconut Oil, Chili Powder, Garlic Powder, Onion Powder, Citric Acid, Salt',
    preparationOrUsage: 'Crisp party snack that pairs wonderfully with cold mocktails and hot tea.',
    nutrition: {
      calories: '515 kcal / 100g',
      protein: '3.0g',
      carbs: '61.5g',
      fat: '29.0g',
      sodium: '230mg',
    },
    variants: [
      { size: '100g', price: 109, weightInGrams: 100 },
      { size: '250g', price: 239, weightInGrams: 250 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBClIRZ-lAygkIzfhsI71RdtlXJrqJV9YO40ocUY-QzyGHBITbEi_QmgpQiKAd7TWUtGPxtMGcTmNrSUEWzGTH55hAgQn1JGn5-Ardir7RvzQ8OHHEKY4GCfzNBdW-q1t8vEHMojxyPL7kMW68irU8Cwcze0aRY591qs173SS1r7DSmEhgFuC_fVbqQM_am5Kj909ws4ZMcVGcbpMLbpeDsRjOXwNeWVGqIYlcV_IsU77ldWdIycYf6TQ',
  },

  // 15. Mazooq Black Pepper Banana Chips
  {
    id: 'mazooq-black-pepper-banana-chips',
    name: 'Mazooq Black Pepper Banana Chips',
    category: 'snacks',
    categoryLabel: 'Heritage Recipe',
    subtitle: 'Crushed Wayanad black peppercorns for a warm, fragrant kick',
    tag: 'Malabar Pepper',
    rating: 4.8,
    reviewsCount: 88,
    description: 'Seasoned with freshly cracked black peppercorns grown in the misty slopes of Wayanad, providing a warm, lingering aroma without raw heat.',
    story: 'Honoring the legendary Malabar spice route, where black pepper was once weighed against gold.',
    origin: 'Palakkad Dist., Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Raw Bananas, Pure Coconut Oil, Wayanad Black Pepper, Sea Salt',
    preparationOrUsage: 'Perfect crunchy companion for a steaming cup of Mazooq Assam Tea.',
    nutrition: {
      calories: '512 kcal / 100g',
      protein: '2.9g',
      carbs: '61.8g',
      fat: '28.8g',
      sodium: '185mg',
    },
    variants: [
      { size: '100g', price: 109, weightInGrams: 100 },
      { size: '250g', price: 239, weightInGrams: 250 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBClIRZ-lAygkIzfhsI71RdtlXJrqJV9YO40ocUY-QzyGHBITbEi_QmgpQiKAd7TWUtGPxtMGcTmNrSUEWzGTH55hAgQn1JGn5-Ardir7RvzQ8OHHEKY4GCfzNBdW-q1t8vEHMojxyPL7kMW68irU8Cwcze0aRY591qs173SS1r7DSmEhgFuC_fVbqQM_am5Kj909ws4ZMcVGcbpMLbpeDsRjOXwNeWVGqIYlcV_IsU77ldWdIycYf6TQ',
  },

  // 16. Mazooq Tapioca Chips
  {
    id: 'mazooq-tapioca-chips',
    name: 'Mazooq Tapioca Chips (Kappa)',
    category: 'snacks',
    categoryLabel: 'Root Crisp',
    subtitle: 'Thin wafer slices of sun-ripened cassava root, fried crisp with chili salt',
    tag: 'Traditional',
    rating: 4.7,
    reviewsCount: 65,
    description: 'Made from fresh farmer-sourced cassava (tapioca) tubers. Extra crunchy with a delicate earthy sweetness and dusting of mild chili.',
    story: 'A beloved Kerala teatime staple produced with locally harvested tapioca roots.',
    origin: 'Palakkad Dist., Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Tapioca Roots, Vegetable / Coconut Oil, Red Chili Powder, Salt, Asafoetida',
    preparationOrUsage: 'Ready to munch right from the airtight pouch.',
    nutrition: {
      calories: '495 kcal / 100g',
      protein: '1.4g',
      carbs: '74.0g',
      fat: '21.5g',
      sodium: '210mg',
    },
    variants: [
      { size: '100g', price: 99, weightInGrams: 100 },
      { size: '250g', price: 219, weightInGrams: 250 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBClIRZ-lAygkIzfhsI71RdtlXJrqJV9YO40ocUY-QzyGHBITbEi_QmgpQiKAd7TWUtGPxtMGcTmNrSUEWzGTH55hAgQn1JGn5-Ardir7RvzQ8OHHEKY4GCfzNBdW-q1t8vEHMojxyPL7kMW68irU8Cwcze0aRY591qs173SS1r7DSmEhgFuC_fVbqQM_am5Kj909ws4ZMcVGcbpMLbpeDsRjOXwNeWVGqIYlcV_IsU77ldWdIycYf6TQ',
  },

  // 17. Mazooq Turmeric Powder
  {
    id: 'mazooq-turmeric-powder',
    name: 'Mazooq Pure Turmeric Powder',
    category: 'spices',
    categoryLabel: 'Single Farm',
    subtitle: 'Lustrous golden yellow shade with naturally preserved essential oils',
    tag: 'High Curcumin',
    rating: 4.9,
    reviewsCount: 118,
    description: 'Pure sun-dried turmeric rhizomes ground at low temperatures to protect essential curcumin compounds (>5% natural curcumin content).',
    story: 'Cultivated in pristine pesticide-free soil without chalk, lead chromate, or synthetic yellow colorants.',
    origin: 'Northeast India & packed in Guwahati/Kerala',
    fssaiNumber: '10326002000025',
    ingredients: '100% Pure Ground Turmeric (Curcuma longa)',
    preparationOrUsage: 'Add 1/2 teaspoon to daily cooking, curries, stews, or mix with warm milk for turmeric golden latte.',
    nutrition: {
      calories: '354 kcal / 100g',
      protein: '7.8g',
      carbs: '64.9g',
      fat: '9.8g',
      sodium: '38mg',
    },
    variants: [
      { size: '100g', price: 79, weightInGrams: 100 },
      { size: '250g', price: 169, weightInGrams: 250 },
      { size: '500g', price: 319, weightInGrams: 500 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHQwjRRI0HM46SKi-WfGnWpnkAq0zxidg3MDLX0Cg6dAOAQIWqmYh11V2lt8o1hNoIqTjy7Ba3vxf8A3MMAQBfhxytlye3qsOsvyxbMHjMtkbxGX3_ybfY6mav1n8rC4_q1zRrgTVdiEVZ_Qr3DO-EWruPRkHJxE4QV0LZQJOjdDbFtkjlwT9iISJ-geapyHklo4PLKlCyRIj_asPsSU8gaBDKHyChazlRdCTuvlNz3h2qqXHKuWw-nw',
  },

  // 18. Mazooq Kashmiri Chilli Powder
  {
    id: 'mazooq-kashmiri-chilli-powder',
    name: 'Mazooq Kashmiri Chilli Powder',
    category: 'spices',
    categoryLabel: 'Mild Heat • Rich Colour',
    subtitle: 'Imparts vibrant royal red hue and sweet smoky aroma without harsh pungency',
    tag: 'Natural Crimson',
    rating: 4.8,
    reviewsCount: 92,
    description: 'Pure ground Kashmiri chillies delivering vivid crimson hues and warm fruity flavor while maintaining very gentle Scoville heat levels.',
    story: 'Hand-stemmed and stone-milled to ensure consistent texture without scorching delicate capsaicin oils.',
    origin: 'Harvested in Kashmir valley, certified purity',
    fssaiNumber: '11325009001048',
    ingredients: '100% Kashmiri Red Chillies',
    preparationOrUsage: 'Use generously in tikkas, gravies, and marinades for rich restaurant-grade color.',
    nutrition: {
      calories: '318 kcal / 100g',
      protein: '12.0g',
      carbs: '56.0g',
      fat: '5.8g',
      sodium: '30mg',
    },
    variants: [
      { size: '100g', price: 99, weightInGrams: 100 },
      { size: '250g', price: 219, weightInGrams: 250 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHQwjRRI0HM46SKi-WfGnWpnkAq0zxidg3MDLX0Cg6dAOAQIWqmYh11V2lt8o1hNoIqTjy7Ba3vxf8A3MMAQBfhxytlye3qsOsvyxbMHjMtkbxGX3_ybfY6mav1n8rC4_q1zRrgTVdiEVZ_Qr3DO-EWruPRkHJxE4QV0LZQJOjdDbFtkjlwT9iISJ-geapyHklo4PLKlCyRIj_asPsSU8gaBDKHyChazlRdCTuvlNz3h2qqXHKuWw-nw',
  },

  // 19. Mazooq Garam Masala
  {
    id: 'mazooq-garam-masala',
    name: 'Mazooq Royal Garam Masala',
    category: 'spices',
    categoryLabel: '14 Whole Spices',
    subtitle: 'Slow stone-ground blend with black cardamom, mace, star anise, and cloves',
    tag: 'Heritage Recipe',
    rating: 4.9,
    reviewsCount: 84,
    description: 'A regal royal masala blended from 14 whole toasted spices including green cardamom, mace, nutmeg, star anise, cinnamon, and black pepper.',
    story: 'Blended according to Awadhi and Mughlai culinary standards to provide aromatics at the finish of cooking.',
    origin: 'Palakkad Dist., Kerala - 679335',
    fssaiNumber: '11325009001048',
    ingredients: 'Coriander, Cumin, Black Cardamom, Green Cardamom, Mace, Nutmeg, Star Anise, Cinnamon, Cloves, Bay Leaf, Black Pepper',
    preparationOrUsage: 'Add a pinch at the end of simmering to unleash blooming essential spice bouquets.',
    nutrition: {
      calories: '379 kcal / 100g',
      protein: '11.5g',
      carbs: '52.0g',
      fat: '14.2g',
      sodium: '52mg',
    },
    variants: [
      { size: '100g', price: 119, weightInGrams: 100 },
      { size: '250g', price: 269, weightInGrams: 250 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHQwjRRI0HM46SKi-WfGnWpnkAq0zxidg3MDLX0Cg6dAOAQIWqmYh11V2lt8o1hNoIqTjy7Ba3vxf8A3MMAQBfhxytlye3qsOsvyxbMHjMtkbxGX3_ybfY6mav1n8rC4_q1zRrgTVdiEVZ_Qr3DO-EWruPRkHJxE4QV0LZQJOjdDbFtkjlwT9iISJ-geapyHklo4PLKlCyRIj_asPsSU8gaBDKHyChazlRdCTuvlNz3h2qqXHKuWw-nw',
  },

  // 20. Mazooq Indian Chai Spice
  {
    id: 'mazooq-indian-chai-spice',
    name: 'Mazooq Indian Chai Spice (Masala)',
    category: 'spices',
    categoryLabel: 'Chai Masala',
    subtitle: 'Cardamom-rich warming blend to elevate everyday tea ceremonies',
    tag: 'Aromatic Powder',
    rating: 4.9,
    reviewsCount: 138,
    description: 'An all-natural spice blend featuring Malabar green cardamom, sun-cured ginger, Ceylon cinnamon, and sweet cloves formulated specifically to stir into tea.',
    story: 'Created by Mazooq master tasters in Guwahati to complement both Assam CTC and whole-leaf orthodox brews.',
    origin: 'Assam & Kerala facilities',
    fssaiNumber: '10326002000025',
    ingredients: 'Green Cardamom (40%), Dry Ginger, Cinnamon, Black Pepper, Clove, Nutmeg',
    preparationOrUsage: 'Add 1/4 teaspoon per cup while boiling tea with milk and water.',
    nutrition: {
      calories: '320 kcal / 100g',
      protein: '8.4g',
      carbs: '58.0g',
      fat: '6.5g',
      sodium: '18mg',
    },
    variants: [
      { size: '50g', price: 99, weightInGrams: 50 },
      { size: '100g', price: 179, weightInGrams: 100 },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHQwjRRI0HM46SKi-WfGnWpnkAq0zxidg3MDLX0Cg6dAOAQIWqmYh11V2lt8o1hNoIqTjy7Ba3vxf8A3MMAQBfhxytlye3qsOsvyxbMHjMtkbxGX3_ybfY6mav1n8rC4_q1zRrgTVdiEVZ_Qr3DO-EWruPRkHJxE4QV0LZQJOjdDbFtkjlwT9iISJ-geapyHklo4PLKlCyRIj_asPsSU8gaBDKHyChazlRdCTuvlNz3h2qqXHKuWw-nw',
  },
];
