// api/admin/upload.js - Vercel serverless function
// POST { filename, contentType, base64 } -> uploads a product image, returns its public URL.
import { verifyAdminToken } from '../../server/admin-auth.js';
import { saveUpload } from '../../server/admin-store.js';

export default async function handler(req, res) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/, '');
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  try {
    const { filename, contentType, base64 } = req.body || {};
    const url = await saveUpload({ filename, contentType, base64 });
    res.json({ ok: true, url });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Unexpected error' });
  }
}
