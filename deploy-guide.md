# Mazooq Foods — Deploy & Razorpay Guide (publish kaise karein)

> Isme step-by-step hai: **Razorpay setup → Vercel/Render par deploy → live jana**.
> Har cheez pehle **test keys** se karein, aakhir me **live keys**.

---

## Part 0 — Razorpay Account (sabse pehle shuru karein, 2-3 din lagte hain)

1. [dashboard.razorpay.com](https://dashboard.razorpay.com) → Sign Up (business email)
2. KYC complete karein → documents: **PAN, GST, bank proof (cancelled cheque/statement), business registration**
3. **API Keys:** Dashboard → Account & Settings → API Keys
   - Pehle **Test Key** generate karein (testing ke liye)
   - KYC approve hone par **Live Key** generate karein
   - `Key Secret` sirf **ek baar** dikhta hai — turant save karein
4. **Webhook:** Dashboard → Settings → Webhooks → Add New Webhook
   - URL: `https://YOUR-DOMAIN.com/api/razorpay/webhook`
   - Secret: ek strong random string (wahi value env me `RAZORPAY_WEBHOOK_SECRET` me daalni hai)
   - Events: `payment.captured`, `payment.failed`

---

## Part 1 — Code ko GitHub par daalein (dono platforms ke liye chahiye)

**Aasan tareeka (GitHub Desktop):**
1. [desktop.github.com](https://desktop.github.com) se GitHub Desktop install karein
2. File → Add Local Repository → `mazooq-foods-website` folder select karein
3. "Publish repository" → naam `mazooq-foods` → **Private** rakh sakte hain

**Ya web se:** github.com → New repository → "uploading an existing file" → project ki saari files drag karein — **node_modules aur dist folder NAHI** (un ko upload nahi karna).

> `.gitignore` file me `node_modules`, `dist`, `.env` already ignore hain — GitHub Desktop khud filter kar dega.

---

## Part 2A — VERCEL par deploy (recommended — sabse aasan)

1. [vercel.com](https://vercel.com) → Sign up (GitHub se login)
2. **Add New → Project** → apna `mazooq-foods` repo import karein
3. Framework: **Vite** (auto-detect ho jayega) — build settings default chhod dein
4. **Environment Variables** add karein (Settings → Environment Variables):
   ```
   RAZORPAY_KEY_ID          = rzp_test_... (baad me rzp_live_...)
   RAZORPAY_KEY_SECRET      = ...
   RAZORPAY_WEBHOOK_SECRET  = ...
   ORDER_NOTIFY_WEBHOOK_URL = (optional, Part 4 dekhein)
   ```
   ⚠️ Naam me `VITE_` prefix **bhool kar bhi na lagayein** — warna keys browser me leak ho jayengi.
5. **Deploy** dabayein → 1-2 min me `https://mazooq-foods.vercel.app` live
6. **Custom domain:** Project → Settings → Domains → `mazooq.com` add karein → jo DNS records Vercel bataye wo apne domain provider (GoDaddy/Cloudflare) me lagayein → SSL automatic
7. Razorpay Webhook URL me apna final domain daalein

**Note:** Vercel par `api/` folder ke files automatic serverless functions ban jaate hain — kuch extra nahi karna.

## Part 2B — RENDER par deploy

1. [render.com](https://render.com) → Sign up → GitHub connect
2. **New + → Blueprint** → repo select karein → `render.yaml` auto-detect hoga → Apply
   (Ya manual: New + → Web Service → repo → Build: `npm install && npm run build`, Start: `node server.js`)
3. Environment variables add karein (Part 2A wali hi 4 values)
4. Deploy → URL milega → Settings → Custom Domain me `mazooq.com` add karein
5. **Note:** Render ke Free plan me site 15 min inactivity ke baad "so" jaati hai (pehli visit 30-60 sec slow). Paid plan me nahi hota.

---

## Part 3 — Test karein (Test Keys se)

1. Site kholein → cart me kuch daalein → Checkout → **UPI / Card** select karein
2. Razorpay ka checkout modal khulega (test mode me) → test payment karein:
   - **Test UPI:** `success@razorpay`
   - **Test Card:** `4111 1111 1111 1111`, koi bhi future expiry, CVV `123`
3. Payment success ke baad: order confirm screen + Razorpay Dashboard → Payments me transaction dikhega
4. Webhook check: Dashboard → Webhooks → recent deliveries me event dikhna chahiye (agar nahi, URL/secret recheck karein)
5. Fail test: `failure@razorpay` se fail karein → site par error message aana chahiye, paisa nahi katta

**Local testing (developer ke liye):** `npm run dev` par payment "demo mode" me simulate hota hai (real paisa nahi). Poora test karne ke liye: `npm run build && npm start` → `http://localhost:8080` + `.env` me test keys.

---

## Part 4 — Orders kahan aayenge? (ORDER_NOTIFY_WEBHOOK_URL — recommended!)

Site me abhi order **database nahi** hai — isliye best hai ke orders ek jagah forward ho jayein:

**Google Sheets se (free, 10 min ka kaam):**
1. [sheets.new](https://sheets.new) → naya sheet → Extensions → **Apps Script**
2. Ye script paste karein:
   ```js
   function doPost(e) {
     const data = JSON.parse(e.postData.contents);
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     sheet.appendRow([
       new Date(),
       data.type || '',
       data.receipt || '',
       (data.customer && data.customer.name) || '',
       (data.customer && data.customer.phone) || '',
       (data.totals && data.totals.total) || '',
       JSON.stringify(data)
     ]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. **Deploy → New deployment → Web app** → Execute as: Me → Who has access: **Anyone** → Deploy → URL copy karein
4. Wahi URL Vercel/Render me `ORDER_NOTIFY_WEBHOOK_URL` me daalein → redeploy
5. Ab har paid/COD order sheet me row ban ke aayega ✅

(Zapier / Make / n8n bhi same tareeke se chalega.)

---

## Part 5 — LIVE jana 🚀

1. KYC approve hone ke baad Razorpay me **Live Keys** generate karein
2. Vercel/Render me env vars ko live keys se **replace** karein → redeploy
3. Webhook URL/secret live mode me bhi same rehta hai
4. **₹1 ka real order** khud se karein (UPI se) → paisa Razorpay me dikhega → T+2 me bank me settle hoga
5. Pehle hafte roz orders + settlements check karein

---

## Troubleshooting (common problems)

| Problem | Fix |
|---|---|
| "Payment service not available" | Env vars set nahi ya galat hain → Vercel/Render me check karein |
| Checkout modal nahi khulta | Internet/adblock? `checkout.razorpay.com` block to nahi ho raha |
| Webhook 400 | `RAZORPAY_WEBHOOK_SECRET` wahi nahi jo dashboard me dala tha |
| Vercel par 404 (koi page) | Deploy logs check karein; `vercel.json` repo me hona chahiye |
| Render slow first load | Free plan "sleep" — normal hai; paid plan le lein |

---

## Payment kaise kaam karta hai (technical summary)

```
Customer → "Pay" click
   → POST /api/razorpay/create-order   (server PRICE recalculate karta hai catalog se,
                                        phir Razorpay par real order banata hai)
   → Razorpay Checkout modal khulta hai (UPI/Card/NetBanking)
   → Payment hone par: POST /api/razorpay/verify
        - HMAC-SHA256 signature verify (timing-safe)
        - Razorpay se payment fetch karke status + order match check
   → Order confirm ✅  (+ ORDER_NOTIFY_WEBHOOK_URL par forward)
```

---

## Part 6 - Admin Panel (products + orders + leads)

Admin ke liye Vercel/Render env vars: `ADMIN_PASSWORD`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `DEPLOY_HOOK_URL`.
Poora 10-minute setup: **ADMIN-SETUP-GUIDE.md**. Panel yahan khulega: `https://your-domain.com/admin`
