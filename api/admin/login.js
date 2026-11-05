// api/admin/login.js - Vercel serverless function
// GET  -> admin/auth configuration status
// POST -> login with password, returns a 12h session token
import { adminConfigured, checkAdminPassword, signAdminToken } from '../../server/admin-auth.js';
import { storeMode } from '../../server/admin-store.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.json({ ok: true, adminConfigured: adminConfigured(), store: storeMode() });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  const { password } = req.body || {};
  if (!adminConfigured()) {
    return res.status(501).json({ ok: false, error: 'not_configured', message: 'ADMIN_PASSWORD is not set on the server.' });
  }
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ ok: false, error: 'bad_password', message: 'Incorrect password.' });
  }
  res.json({ ok: true, token: signAdminToken() });
}
