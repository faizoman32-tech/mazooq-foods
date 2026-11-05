# 🌐 Mazooq Foods — Internet par Deploy karne ki Guide

Is guide mein hum aapki website ko free mein internet par deploy karenge. 2 options hain — aap koi bhi choose kar sakte hain.

---

## 📋 Aapke paas yeh chahiye:

1. **GitHub account** (free signup: https://github.com)
2. **Email ID** (jo GitHub/Vercel/Render signup ke liye use karenge)
3. **mazooq-foods-phase3-v5.zip** (latest, downloaded)

---

## 🎯 Recommended: Render (sabse aasaan, 1 service)

Render ek free platform hai. Yeh automatically build + start karta hai. Isme **sirf ek service** chahiye (Express server jo static site + API dono serve kare).

### Step 1: GitHub par code upload karo

1. GitHub.com par login karo
2. **New Repository** button par click karo (top-right corner)
3. Repository name: `mazooq-foods` rakho
4. **Private** select karo (taaki koi aur na dekh sake)
5. **Create repository** button dabao
6. Aapko ek page khulega jisme "uploading an existing file" link hogi — us par click karo
7. Apne computer par `mazooq-foods-phase3-v5.zip` extract karo
8. `mazooq-foods` folder ke **saari files** ko GitHub ke upload area par drag-drop karo
9. **Commit changes** button dabao (neeche)
10. Wait karo ~1 min, code upload ho jayega

### Step 2: Render par account banao

1. Render.com par jao
2. **Get Started** ya **Sign Up** button
3. **GitHub se sign in** choose karo (easiest)
4. Authorize Render to access your GitHub

### Step 3: New Web Service banao

1. Render dashboard mein **New +** button (top-right) → **Web Service**
2. **Build and deploy from a Git repository** select karo
3. Apna `mazooq-foods` repo select karo (jo Step 1 mein banaya)
4. Wait karo ~10 seconds, phir yeh settings fill karo:

   - **Name**: `mazooq-foods`
   - **Region**: closest to your users (jaise Singapore / Frankfurt)
   - **Branch**: `main`
   - **Runtime**: `Node` (auto-detect ho jayega)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

5. **Advanced** button expand karo aur yeh **Environment Variables** add karo:

   | Key | Value |
   |-----|-------|
   | `ADMIN_PASSWORD` | `MazooqAdmin2026` (ya apna strong password) |
   | `ADMIN_STORE` | `file` (testing ke liye; production mein Supabase recommended) |

6. Neeche **Create Web Service** button dabao

### Step 4: Wait karo (5-10 minutes)

Render ab automatically:
- Code download karega
- npm install karega
- Build karega
- Server start karega

Aapko dashboard mein "Live" badge dikh jayega jab ready ho.

### Step 5: Test karo

Render aapko ek URL dega:
```
https://mazooq-foods.onrender.com
```

- 🏪 Store: `https://mazooq-foods.onrender.com`
- 🔐 Admin: `https://mazooq-foods.onrender.com/admin` (password: `MazooqAdmin2026`)

**Test karo**:
- ✅ Customer register/login
- ✅ Product browse karo
- ✅ Add to cart + checkout (COD test karo, Razorpay ke liye key chahiye)
- ✅ Retailer register → admin se approve → retailer login → wholesale prices dekho

---

## 🔄 Alternative: Vercel (sabse fast, 2 services)

Vercel thoda alag — yeh static site + serverless functions alag-alag handle karta hai. Already configured hai (`vercel.json` + `api/` folder).

### Step 1: GitHub par code upload karo (same as Render Step 1)

### Step 2: Vercel par deploy karo

1. Vercel.com par jao → **Sign Up** → **Continue with GitHub**
2. Authorize Vercel to access your GitHub
3. Dashboard mein **Add New Project** → **Import** your `mazooq-foods` repo
4. Yeh settings confirm karo:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)
5. **Environment Variables** add karo (click "Environment Variables"):
   - `ADMIN_PASSWORD` = `MazooqAdmin2026`
6. **Deploy** button dabao

### Step 3: Wait karo (~2-3 minutes)

Vercel bahut fast hai. URL milega:
```
https://mazooq-foods-xyz.vercel.app
```

---

## 📧 Order alert emails (Resend — free)

When this is set up, **you get an email for every new order, retailer application and
contact-form message**, and **customers get an order confirmation email**.
Without it, everything still works — orders are just only visible in the Admin panel.

1. Sign up at **https://resend.com** (free: 3,000 emails/month).
2. **Domains → Add Domain → `mazooq.com`** → add the DNS records it shows at your
   domain provider (GoDaddy / Hostinger / Cloudflare …). Wait until it says **Verified**.
3. **API Keys → Create API Key** → copy it (starts with `re_`).
4. Add these Environment Variables in Render / Vercel, then redeploy:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | the `re_...` key |
| `EMAIL_FROM` | `Mazooq Foods <orders@mazooq.com>` |
| `ORDER_ALERT_EMAIL` | `info@mazooq.com` (comma-separate to add more people) |

5. Test: place a Cash on Delivery order with your own email → you should get both the
   alert and the confirmation within a minute. If not, check the server logs for `[email]`.

> Tip: install the Gmail / Outlook app and turn on notifications for `info@mazooq.com`
> so new orders pop up on your phone.

---

## 🆘 Common Issues

### Issue 1: Build fail ho gaya
- Render/Vercel logs check karo
- Common cause: GitHub par `node_modules` upload kar diya (ye nahi karna)
- Fix: GitHub repo se `node_modules/` folder delete karo (agar upload kiya tha)

### Issue 2: "Application error" ya 500
- Environment variables check karo (`ADMIN_PASSWORD` set hai ya nahi)
- Server.js logs check karo (Render dashboard → Logs tab)

### Issue 3: Images load nahi ho rahi
- Yeh expected hai file mode (`ADMIN_STORE=file`) mein
- Fix: Local par image upload karke rebuild karo, phir GitHub par push karo

### Issue 4: Free tier neend mode (Render)
- Free Render services 15 min inactive rahne par sleep ho jate hain
- Pehli request 30-50 sec slow ho sakti hai (cold start)
- Production use ke liye paid plan consider karo

---

## 🎉 Successful deployment ke baad

1. **Razorpay keys add karo** (real payments ke liye)
   - Razorpay.com par account banao
   - Dashboard → API Keys → Test/Live keys copy karo
   - Render/Vercel env vars mein `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` add karo
   - Service ko restart/redploy karo

2. **Supabase connect karo** (permanent database ke liye)
   - Supabase.com par free project banao
   - SQL Editor mein `supabase/schema.sql` paste karke Run karo
   - Project URL + service_role key copy karke env vars mein add karo:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_STORE=file` env var ko hata do (Supabase use hone ke liye)

3. **Custom domain connect karo** (jab ready ho)
   - `mazooq.com` jaisa domain buy karo
   - DNS settings mein CNAME record add karo (Vercel/Render ki public URL par)
   - Platform mein custom domain add karo

---

## 📞 Help

Agar koi dikkat aaye to screenshot bhej do — main help kar dunga!
