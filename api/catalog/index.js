// api/catalog.js - Vercel serverless function
// Public catalog (customer-facing). Strips hidden products AND retailer pricing tiers.
// Retailer-specific catalog is served from /api/retailer/catalog (auth-required).
import { listProducts } from '../server/admin-store.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  try {
    const products = await listProducts();
    const publicProducts = (products || [])
      .filter((p) => p && !p.hidden)
      .map((p) => {
        const clone = { ...p };
        delete clone.hidden;
        delete clone.sortIndex;
        delete clone.retailerPricing;
        return clone;
      });
    res.json({ ok: true, products: publicProducts });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Unexpected error' });
  }
}
