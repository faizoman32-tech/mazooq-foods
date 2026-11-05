# 🚀 Mazooq Foods — Windows par chalane ka tarika

## Asaan tarika (Recommended) ⭐

### Step 1: Build + Production server
**`START-PRODUCTION.bat`** file par **double-click** karo.

Yeh file automatically:
- ✅ Node.js check karegi
- ✅ Environment variables set karegi (`ADMIN_STORE=file`, `ADMIN_PASSWORD=MazooqAdmin2026`)
- ✅ `npm install` chalega (agar `node_modules` nahi hai)
- ✅ `npm run build` chalega
- ✅ `npm start` se server chalega
- ✅ Browser automatically `http://localhost:8080` par khulega

### Step 2: Test karo
- 🏪 **Storefront**: http://localhost:8080
- 🔐 **Admin Panel**: http://localhost:8080/admin (password: `MazooqAdmin2026`)

### Step 3: Stop karna ho to
Server wali window mein `Ctrl+C` dabao.

---

## Alternative: Dev Mode (Live Reload)

Agar aap code edit kar rahe ho aur har change turant dekhna chahte ho:

**`START-MAZOOQ-FOODS.bat`** file par **double-click** karo.

- 🌐 Browser khulega: http://localhost:3001
- 🔐 Admin Panel: http://localhost:3001/admin (password: `MazooqAdmin2026`)
- Code save karte hi site auto-reload ho jayegi

---

## Manual commands (agar .bat file nahi chal rahi)

### PowerShell mein (recommended):

```powershell
# Build aur start
$env:ADMIN_STORE="file"; $env:ADMIN_PASSWORD="MazooqAdmin2026"; npm run build
$env:ADMIN_STORE="file"; $env:ADMIN_PASSWORD="MazooqAdmin2026"; npm start

# Dev mode
$env:ADMIN_STORE="file"; $env:ADMIN_PASSWORD="MazooqAdmin2026"; npm run dev
```

### CMD (Command Prompt) mein:

```cmd
set ADMIN_STORE=file
set ADMIN_PASSWORD=MazooqAdmin2026
npm run build
npm start
```

---

## Common Issues

### ❌ "ADMIN_STORE=file is not recognized"
Aap PowerShell mein Linux-style command chala rahe ho. Solution:
```powershell
$env:ADMIN_STORE="file"; $env:ADMIN_PASSWORD="MazooqAdmin2026"; npm run build
```

### ❌ "node: command not found"
Node.js install nahi hai. Download: https://nodejs.org (LTS version)

### ❌ Port 8080 already in use
Koi aur program port 8080 use kar raha hai. Ya to use close karo, ya different port use karo:
```powershell
$env:PORT=8090; $env:ADMIN_STORE="file"; $env:ADMIN_PASSWORD="MazooqAdmin2026"; npm start
```
Phir `http://localhost:8090` kholo.

### ❌ Build fail ho gaya
1. Confirm karo `node_modules` folder hai (`npm install` chalao agar nahi hai)
2. Errors upar dekho terminal mein
3. `npm run clean` chala ke `dist/` folder hata do, phir dobara build karo

---

## Default Credentials
- **Admin Password**: `MazooqAdmin2026` (production par change karna mat bhulna!)
- Admin Panel URL: `http://localhost:8080/admin` (production) ya `http://localhost:3001/admin` (dev mode)

## Test Credentials (smoke test ke liye)
Admin panel ke "Retailers" tab mein jaakar retailers ki list dekho. Approve karo, phir retailer login kar ke test karo.

---

## Production par deploy karne ke liye
Vercel ya Render par deploy karo. Environment variables wahan set karne honge:
- `ADMIN_PASSWORD` — strong password
- `RAZORPAY_KEY_ID` / `RAZARPAY_KEY_SECRET` — payment gateway
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — database
- `DEPLOY_HOOK_URL` — auto-rebuild (optional)

Detailed steps ke liye `IMPLEMENTATION-REPORT.md` file dekho.
