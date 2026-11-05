// api/retailer/catalog.js - Vercel serverless function
// Catalog WITH retailer pricing tiers, accessible only to APPROVED retailers.
import { listProducts } from '../../server/admin-store.js';
import { getUserBySession, parseCookieHeader, SESSION_COOKIE } from '../../server/auth-service.js';

function forbidden(res, message) {
  return res.status(403).json({ ok: false, error: 'forbidden', message: message || 'Retailer access only.' });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  try {
    const token = parseCookieHeader(req.headers.cookie)[SESSION_COOKIE];
    const user = token ? await getUserBySession(token) : null;
    if (!user) {
      return res.status(401).json({ ok: false, error: 'unauthorized', message: 'Please log in to continue.' });
    }
    if (user.role !== 'RETAILER') return forbidden(res);
    if (user.status !== 'APPROVED') {
      return res.status(403).json({
        ok: false,
        error: 'retailer_not_approved',
        message: `Retailer status: ${user.status}. Admin approval required.`,
        status: user.status,
      });
    }

    const products = await listProducts();
    const retailerProducts = (products || [])
      .filter((p) => p && !p.hidden)
      .map((p) => {
        const clone = { ...p };
        delete clone.hidden;
        delete clone.sortIndex;
        return clone;
      });
    res.json({ ok: true, products: retailerProducts });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Unexpected error' });
  }
}
