// api/contact.js - Vercel serverless function (same logic as server.js /api/contact)
import { submitContact, formError } from '../server/forms.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  try {
    res.json(await submitContact(req.body));
  } catch (e) {
    formError(res, e);
  }
}
