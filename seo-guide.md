# Mazooq Foods — SEO Guide (Google par kaise laayein)

> Isme 3 hisse hain: **(1)** jo technical SEO abhi implement ho chuka hai, **(2)** aapko kya karna hai (step-by-step), **(3)** monthly action plan.

---

## 1. Jo abhi ho chuka hai (technical SEO — code me implemented ✅)

| # | Cheez | Status |
|---|-------|--------|
| 1 | Page title + meta description (keywords ke saath) | ✅ |
| 2 | **Open Graph / WhatsApp-Facebook link preview** + `og-image.jpg` (1200×630) — link bhejne par sundar card dikhega | ✅ |
| 3 | **Structured data (JSON-LD)** — Organization + Website schema (Google rich results ke liye) | ✅ |
| 4 | `robots.txt` + `sitemap.xml` | ✅ |
| 5 | **Favicon** (green + gold "MZ" badge) — SVG + PNG + Apple icon | ✅ |
| 6 | **Lazy loading** — 20 product images ab scroll par load hoti hain (fast page) | ✅ |
| 7 | Har page ka apna browser title (Home, Tea, Dates, Shop, etc.) | ✅ |
| 8 | Hero image eager + `fetchPriority=high` (fast first paint) | ✅ |
| 9 | Google Analytics 4 ready — bas `VITE_GA4_ID` set karo to chalu | ✅ |
| 10 | Images ka path bug fix (`/src/assets` → `/images`) — production me photos ab sahi dikhengi | ✅ |

⚠️ **Ek baat note kar lo:** Saare URLs filhaal `https://mazooq.com` par set hain (index.html, robots.txt, sitemap.xml me). Agar final domain alag ho to yeh 3 files me replace kar lena — bata dena, main kar dunga.

---

## 2. Aapko kya karna hai (5 steps — pehle hafte me)

### Step 1 — Google Search Console (FREE, sabse zaroori) 🔍
1. [search.google.com/search-console](https://search.google.com/search-console) → **Add Property** → URL prefix: `https://mazooq.com`
2. Verify karein — **DNS method** sabse aasan (domain provider me TXT record add karo jo Google batayega)
3. Left menu → **Sitemaps** → `sitemap.xml` submit karo
4. 2-3 din me Google aapko index karna shuru kar dega — **Performance** tab me dekho kaunse search words se log aa rahe hain

### Step 2 — Google Business Profile (local customers ke liye #1) 🏢
1. [business.google.com](https://business.google.com) → Add business
2. **Do profiles bana sakte ho**: Kerala office (Palakkad) + Assam unit (Guwahati)
3. Photos daalo (shop, products, team), website link `https://mazooq.com`, phone number
4. **Har hafte ek "Post"** daalo (naya product, offer, harvest update)
5. **Reviews mango!** — har customer se Google review maango. 50+ reviews = local search me top

### Step 3 — Google Analytics 4 (kya-kya ho raha hai track karo) 📊
1. [analytics.google.com](https://analytics.google.com) → Admin → Create Property
2. Data Stream banao (website) → **G-XXXXXXXXXX** ID copy karo
3. Vercel/Render ke Environment Variables me daalo: `VITE_GA4_ID = G-XXXXXXXXXX`
4. Redeploy → ab har visitor, page, device sab track hoga

### Step 4 — Instagram / Facebook + website jodo 📱
- Instagram bio me `mazooq.com` link lagao
- FB page + Insta par regular posts (products, behind-the-scenes, brewing tips)
- Google Business Profile posts se website link — yeh sab SEO me count hota hai

### Step 5 — Business directories (B2B + backlinks) 🤝
- **IndiaMART**, **TradeIndia**, **JustDial** par free listing banao (Assam tea supplier, dates wholesale, etc.)
- Export portals: **Alibaba / ExportersIndia** (global buyers ke liye)
- Har listing me `mazooq.com` ka link + same business info (naam, address, phone — consistent rakho!)

---

## 3. Keywords — kaunse words target karne hain

| Category | Target keywords |
|----------|-----------------|
| **Tea** | "assam tea online", "buy assam black tea", "premium assam tea india", "masala chai blend online", "mazooq tea" |
| **Dates** | "medjool dates online india", "ajwa dates buy", "premium dates online", "stuffed dates" |
| **Nuts/Snacks** | "kerala banana chips online", "cashew w240", "dry fruits online india" |
| **Spices** | "pure spices online", "kerala spices buy" |
| **B2B/Export** | "assam tea exporter", "indian food exporter uae", "tea wholesale supplier" |

**Free tools:** Google autocomplete (type "assam tea……" aur dekho Google kya suggest karta hai), Google Trends, "People also ask" section, Google Keyword Planner (Ads account ke saath free).

💡 **Rule:** Jo words customers actually bolte hain wahi use karo — "premium orthodox" se koi nahi dhundta, "assam tea online" se sab dhundte hain.

---

## 4. Monthly Action Plan

**Week 1:** Deploy → Search Console → Google Business Profile → GA4 → Sitemap submit
**Week 2:** Real product photos lagao → Insta/FB regular → pehle 10 reviews maango
**Month 1:** 50+ reviews → IndiaMART/JustDial listings → GSC me dekho kaunse words aa rahe hain → un words ko site pe highlight karo
**Month 2-3:** Weekly GMB posts → customer photos/reviews site pe → (planning) blog section: "How to brew perfect Assam chai", "Medjool vs Ajwa dates" etc. → backlinks

---

## 5. IMPORTANT — Ek technical improvement jo ranking badha dega 🚀

**Abhi ki limitation:** Ye site **single-page app** hai — saare pages (Tea, Dates, Shop) ek hi URL `/` ke andar hain. Google ise index kar lega, lekin **har product ka apna Google result** nahi bana sakta.

**Future upgrade (jab chaaho):** Har product ke liye alag URL/page, jaise:
- `mazooq.com/tea/premium-gold-assam-tea`
- `mazooq.com/dates/medjool-dates`

Isse Google me har product alag se rank kar sakta hai — **"medjool dates online" par direct product page** aa sakta hai. Ye sabse bada SEO upgrade hoga, jab ready ho to bol dena — main implement kar dunga.

---

## 6. Quick Reference — abhi turant yeh 5 kaam karo

1. ✅ Site deploy karo (Vercel/Render) → `mazooq.com` domain connect
2. ✅ Search Console me verify + sitemap submit
3. ✅ Google Business Profile banao (Kerala + Assam)
4. ✅ GA4 ka `VITE_GA4_ID` set karo
5. ✅ Pehle 10 customers se Google reviews maango
