// shared/retailer-pricing.js
// Wholesale (approved-retailer) pricing — ONE implementation used by both the
// server (what is charged) and the storefront (what is shown).
//
// How tiers work
// --------------
// A product's `retailerPricing` tiers ({ minQty, maxQty|null, pricePerUnit })
// are quoted for ONE pack size: `product.retailerPricingSize` (e.g. "500g").
// Other pack sizes get the same discount proportionally:
//
//     price(size) = round(tierPrice × retail(size) / retail(referenceSize))
//
// and a retailer never pays more than the normal retail price for that size.
//
// Older data has no `retailerPricingSize`. In that case the reference size is
// inferred as the cheapest pack whose retail price is still >= the first tier
// price (tiers are always a discount on the pack they were written for).

/** Normalises variants to [{ size, price }] — accepts array ({size,price}) or record ({size: price}). */
function variantList(product) {
  const v = product && product.variants;
  if (Array.isArray(v)) {
    return v
      .filter((x) => x && typeof x.size === 'string' && typeof x.price === 'number')
      .map((x) => ({ size: x.size, price: x.price }));
  }
  if (v && typeof v === 'object') {
    return Object.entries(v)
      .filter(([, price]) => typeof price === 'number')
      .map(([size, price]) => ({ size, price }));
  }
  return [];
}

function validTiers(product) {
  const tiers = Array.isArray(product && product.retailerPricing) ? product.retailerPricing : [];
  return tiers
    .filter((t) => t && typeof t.minQty === 'number' && typeof t.pricePerUnit === 'number' && t.pricePerUnit > 0)
    .sort((a, b) => a.minQty - b.minQty);
}

/** The pack size the tier prices are quoted for (explicit, or inferred for older data). */
export function retailerReferenceSize(product) {
  const variants = variantList(product);
  if (!variants.length) return null;
  const explicit = product && product.retailerPricingSize;
  if (explicit && variants.some((v) => v.size === explicit)) return explicit;

  const tiers = validTiers(product);
  if (!tiers.length) return null;
  const firstTierPrice = tiers[0].pricePerUnit;
  const byPrice = [...variants].sort((a, b) => a.price - b.price);
  const match = byPrice.find((v) => v.price >= firstTierPrice);
  return (match || byPrice[byPrice.length - 1]).size;
}

function tierForQty(tiers, qty) {
  let best = null;
  for (const t of tiers) {
    if (qty < t.minQty) continue;
    if (t.maxQty !== null && t.maxQty !== undefined && qty > t.maxQty) continue;
    if (!best || t.minQty > best.minQty) best = t;
  }
  return best;
}

function scaledPrice(tierPrice, sizePrice, refPrice) {
  const scaled = Math.round((tierPrice * sizePrice) / refPrice);
  // Never charge a retailer more than the normal customer price.
  return Math.min(scaled, sizePrice);
}

/**
 * Wholesale unit price for `variantSize` when buying `qty` units, or null when
 * no tier applies (caller then uses the normal retail price).
 */
export function retailerUnitPrice(product, variantSize, qty) {
  const tiers = validTiers(product);
  if (!tiers.length) return null;
  const variants = variantList(product);
  const line = variants.find((v) => v.size === variantSize);
  const refSize = retailerReferenceSize(product);
  const ref = variants.find((v) => v.size === refSize);
  if (!line || !ref || ref.price <= 0) return null;

  const tier = tierForQty(tiers, Math.max(1, Number(qty) || 1));
  if (!tier) return null;
  const price = scaledPrice(tier.pricePerUnit, line.price, ref.price);
  return price < line.price ? price : null;
}

/** Tier table for one pack size, for display: [{ minQty, maxQty, pricePerUnit }]. */
export function retailerTiersForSize(product, variantSize) {
  const tiers = validTiers(product);
  const variants = variantList(product);
  const line = variants.find((v) => v.size === variantSize);
  const refSize = retailerReferenceSize(product);
  const ref = variants.find((v) => v.size === refSize);
  if (!tiers.length || !line || !ref || ref.price <= 0) return [];
  return tiers.map((t) => ({
    minQty: t.minQty,
    maxQty: t.maxQty === undefined ? null : t.maxQty,
    pricePerUnit: scaledPrice(t.pricePerUnit, line.price, ref.price),
  }));
}
