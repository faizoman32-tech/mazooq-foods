// api/admin/products.js - Vercel serverless function
// GET    -> list all products (including hidden)
// POST   -> upsert a product { product }
// DELETE -> delete a product { id }
import { verifyAdminToken } from '../../server/admin-auth.js';
import { deleteProduct, listProducts, pingDeployHook, upsertProduct } from '../../server/admin-store.js';

function authorized(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
  return verifyAdminToken(token);
}

export default async function handler(req, res) {
  if (!authorized(req)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  try {
    if (req.method === 'GET') {
      const products = await listProducts();
      return res.json({ ok: true, products });
    }
    if (req.method === 'POST') {
      await upsertProduct(req.body?.product);
      const deploy = await pingDeployHook();
      return res.json({ ok: true, deploy });
    }
    if (req.method === 'DELETE' || (req.method === 'POST' && req.body?.action === 'delete')) {
      await deleteProduct(req.body?.id);
      const deploy = await pingDeployHook();
      return res.json({ ok: true, deploy });
    }
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Unexpected error' });
  }
}
