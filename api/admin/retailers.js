// api/admin/retailers.js - Vercel serverless function
// GET  -> list retailer accounts + statuses
// POST -> update retailer status { id, status: PENDING|APPROVED|REJECTED|SUSPENDED }
import { verifyAdminToken } from '../../server/admin-auth.js';
import { listRetailers, updateUserStatus } from '../../server/admin-store.js';

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
      const retailers = await listRetailers();
      return res.json({ ok: true, retailers });
    }
    if (req.method === 'POST') {
      const { id, status } = req.body || {};
      const allowed = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];
      if (!allowed.includes(status)) {
        return res.status(400).json({ ok: false, error: 'INVALID_STATUS' });
      }
      const updated = await updateUserStatus(id, status);
      return res.json({ ok: true, updated });
    }
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Unexpected error' });
  }
}
