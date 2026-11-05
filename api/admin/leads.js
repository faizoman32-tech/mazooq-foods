// api/admin/leads.js - Vercel serverless function
// GET -> list retailer applications (latest 200)
import { verifyAdminToken } from '../../server/admin-auth.js';
import { listLeads } from '../../server/admin-store.js';

export default async function handler(req, res) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  try {
    const leads = await listLeads();
    res.json({ ok: true, leads });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Unexpected error' });
  }
}
