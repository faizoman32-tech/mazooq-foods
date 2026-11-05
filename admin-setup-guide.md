# Admin Panel — Setup Guide (Products, Orders & Leads)

> **Kya hai ye?** Ek admin panel jahan se aap khud products **add / edit / delete** kar sakte ho (price change, photo upload), **orders** dekh sakte ho, aur **retailer leads** dekh sakte ho — website ka code chhune ki zaroorat nahi.

---

## 1. LOCAL me try karein (abhi, bina kisi setup ke)

1. Folder me **`START-ADMIN.bat`** par double-click karein
2. Browser khud khulega: `http://localhost:8080/admin`
3. Login password: **`MazooqAdmin2026`** (local default)
4. Ab aap products add/edit/delete kar sakte ho, orders/leads dekh sakte ho — sab **local file** me save hota hai (development mode)

> Local mode me changes sirf aapke laptop me save hote hain. **Live website ke liye Part 2 (Supabase) setup karein.**

---

## 2. PRODUCTION Setup (Ek baar ka kaam — ~10 minutes)

### Step 1 — Supabase (free database) account
1. [supabase.com](https://supabase.com) → Sign Up (GitHub/email se)
2. **New Project** → naam `mazooq` → strong database password → region: **Mumbai/Singapore** → Create (2 min wait)

### Step 2 — Tables banao
1. Supabase Dashboard → **SQL Editor** → New query
2. Is project ki file **`supabase/schema.sql`** ka poora content copy-paste karein → **Run**
3. "Success" aana chahiye (products, orders, leads 3 tables ban jayengi)

### Step 3 — Photos ke liye Storage bucket
1. Supabase → **Storage** → **New bucket** → naam: `product-images` → **Public bucket: ON** → Create
   *(Isi me admin se upload ki hui product photos save hongi)*

### Step 4 — Keys copy karo
1. Supabase → **Settings → API**
2. Copy karein: **Project URL** aur **`service_role` key** (ye secret hai — kabhi public na karein!)

### Step 5 — Vercel / Render me env vars daalo
**Vercel:** Project → Settings → Environment Variables — ye 4 add karein:

```
ADMIN_PASSWORD              = (apna strong password - isi se admin me login karoge)
SUPABASE_URL                = (Step 4 ka Project URL)
SUPABASE_SERVICE_ROLE_KEY   = (Step 4 ki service_role key)
DEPLOY_HOOK_URL             = (Step 6 me milega)
```

**Render:** Dashboard → apna service → Environment — same 4 variables.

### Step 6 — Deploy Hook (auto-publish, ~1-2 min)
Isse admin me "Save" karte hi website **automatically rebuild** ho jaati hai:
- **Vercel:** Project → Settings → **Git** → Deploy Hooks → Name: `admin-publish` → Create → URL copy karke `DEPLOY_HOOK_URL` me daalein
- **Render:** Service → Settings → **Deploy Hook** → Create → URL copy karke `DEPLOY_HOOK_URL` me daalein

### Step 7 — Redeploy & Login
1. Save karke **redeploy** karein
2. `https://your-domain.com/admin` kholein → apna `ADMIN_PASSWORD` daalein → done ✅

---

## 3. Kaise kaam karta hai (data flow)

```
Admin me product save  ─►  Supabase database
        │
        ▼
DEPLOY_HOOK_URL trigger  ─►  Site rebuild (1-2 min)
        │
        ▼
Build ke waqt products database se sync hote hain  ─►  Nayi website live ✅
```

- **Products tab:** add/edit/delete + price/size + photo upload + "Hide from website" toggle
- **Orders tab:** website ke saare orders (Razorpay + COD) + status update (New → Packed → Shipped → Delivered)
- **Leads tab:** retailer (B2B) applications

---

## 4. Security notes

- `ADMIN_PASSWORD` strong rakhein (12+ characters)
- `SUPABASE_SERVICE_ROLE_KEY` sirf server env me rakhein — kabhi website code/GitHub me na daalein
- `/admin` page search engines se hidden hai (`noindex`)
- Login 12 hours tak valid rehta hai; phir dobara password

---

## 5. Troubleshooting

| Problem | Fix |
|---|---|
| Login page par "Admin password set nahi hai" | Server env me `ADMIN_PASSWORD` set karein |
| "Local file store active" dikh raha hai (production me) | `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` env vars sahi nahi hain |
| Changes site par nahi dikh rahe | `DEPLOY_HOOK_URL` set nahi hai — set karein ya manually redeploy karein |
| Photo upload fail | Storage bucket `product-images` bana hai? Public hai? |
| "Supabase error 401/403" | service_role key galat hai — dobara copy karein |

---

## Phase 2 note — nayi tables (users & sessions)

Customer/retailer accounts ke liye 2 nayi tables chahiye:
- **Naya setup:** sirf updated `supabase/schema.sql` run karein (sab include hai)
- **Pehle run kar chuke ho:** ab `supabase/migration-phase2.sql` bhi SQL Editor me run karein

Iske baad: Retailer registration → Admin Panel → **Retailers tab** me Approve/Reject/Suspend.
