export interface RetailerTier {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
}

type PricedProduct = {
  variants: Array<{ size: string; price: number }> | Record<string, number>;
  retailerPricing?: Array<{ minQty: number; maxQty?: number | null; pricePerUnit: number }>;
  retailerPricingSize?: string;
};

export function retailerReferenceSize(product: PricedProduct): string | null;
export function retailerUnitPrice(product: PricedProduct, variantSize: string, qty: number): number | null;
export function retailerTiersForSize(product: PricedProduct, variantSize: string): RetailerTier[];
