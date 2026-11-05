// api/razorpay/webhook.js - Vercel serverless function
// Receives Razorpay webhook events (signature-verified). Logs the event for now.
import { verifyWebhookSignature } from '../../server/payments-core.js';

// Disable Vercel's automatic body parsing so we get the exact raw bytes for signature verification.
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  const signature = req.headers['x-razorpay-signature'];

  if (!verifyWebhookSignature(raw, signature)) {
    return res.status(400).json({ ok: false, error: 'invalid_signature' });
  }

  let event = {};
  try { event = JSON.parse(raw); } catch { /* ignore */ }
  console.log('[razorpay-webhook]', event?.event || 'unknown-event');
  res.json({ ok: true });
}
