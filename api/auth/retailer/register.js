// api/auth/retailer/register.js - Vercel serverless function
// Retailer application -> creates a RETAILER account with status PENDING (admin approval required).
import { registerRetailer, retailerError } from '../../../server/auth-service.js';
import { notifyRetailerSignup } from '../../../server/forms.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  try {
    const user = await registerRetailer(req.body || {});
    await notifyRetailerSignup(req.body).catch((e) => console.warn('[notify] retailer signup:', e?.message));
    res.json({ ok: true, user, message: 'Application received. Admin approval ke baad aap login kar payenge.' });
  } catch (e) {
    retailerError(res, e);
  }
}
