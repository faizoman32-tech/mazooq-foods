// api/leads/retailer.js - Vercel serverless function
// Captures B2B retailer applications (forwarded via ORDER_NOTIFY_WEBHOOK_URL).
import { notifyOrder } from '../../server/payments-core.js';
import { addLead } from '../../server/admin-store.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  try {
    const data = req.body || {};
    if (!data.businessName && !data.contactName && !data.phone) {
      return res.status(400).json({ ok: false, error: 'INVALID_INPUT', message: 'Business or contact details required' });
    }
    await addLead(data).catch((e) => console.warn('[admin-store] lead save failed:', e?.message));
    await notifyOrder({ type: 'RETAILER_APPLICATION', receivedAt: new Date().toISOString(), application: data });
    res.json({ ok: true, message: 'Application received' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.code || 'error', message: e?.message || 'Unexpected error' });
  }
}
