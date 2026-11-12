import React, { useCallback, useEffect, useState } from 'react';
import { api, clearToken, getToken, setToken } from './api';
import { retailerReferenceSize } from '../../shared/retailer-pricing.js';

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------
interface Variant { size: string; price: number; weightInGrams: number }
interface PricingTier {
  minQty: number;
  maxQty: number | null; // null means "no upper bound" (50+ units)
  pricePerUnit: number;
}
interface Product {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  subtitle: string;
  tag?: string;
  description: string;
  story: string;
  origin: string;
  fssaiNumber?: string;
  ingredients: string;
  preparationOrUsage: string;
  nutrition: { calories: string; protein: string; carbs: string; fat: string; sodium: string };
  variants: Variant[];
  image: string;
  isComingSoon?: boolean;
  hidden?: boolean;
  sortIndex?: number;
  // Retailer wholesale pricing tiers. Optional - missing or empty array means
  // "no wholesale pricing; retailers pay regular variant price".
  retailerPricing?: PricingTier[];
  // Pack size the tier prices are quoted for (other sizes get the same % discount).
  retailerPricingSize?: string;
}

type Tab = 'products' | 'orders' | 'retailers' | 'leads';

const CATEGORIES = [
  { value: 'tea', label: 'Tea' },
  { value: 'dates', label: 'Dates' },
  { value: 'nuts', label: 'Nuts' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'spices', label: 'Spices' },
];

const ORDER_STATUSES = ['New', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

const EMPTY_PRODUCT: Product = {
  id: '',
  name: '',
  category: 'tea',
  categoryLabel: 'Assam Black Tea',
  subtitle: '',
  tag: '',
  description: '',
  story: '',
  origin: 'Amingaon, Guwahati, Kamrup District, Assam - 781031',
  fssaiNumber: '',
  ingredients: '',
  preparationOrUsage: '',
  nutrition: { calories: '', protein: '', carbs: '', fat: '', sodium: '' },
  variants: [{ size: '250g', price: 0, weightInGrams: 250 }],
  image: '',
  isComingSoon: false,
  retailerPricing: [],
};

const inputCls =
  'w-full bg-white border border-[#dfe4da] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#765b00]';
const labelCls = 'block text-[11px] font-semibold text-[#414941] mb-1';

function formatDate(v: string | undefined) {
  if (!v) return '-';
  try { return new Date(v).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return v; }
}

function priceRange(p: Product) {
  const prices = (p.variants || []).map((v) => v.price).filter((n) => typeof n === 'number');
  if (!prices.length) return '-';
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `₹${min}` : `₹${min} - ₹${max}`;
}

// ---------------------------------------------------------------------------
// Main app
// ---------------------------------------------------------------------------
export default function AdminApp() {
  const [token, setTokenState] = useState(getToken());
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [tab, setTab] = useState<Tab>('products');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [retailers, setRetailers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  useEffect(() => {
    api('/api/admin/status').then(setServerStatus).catch(() => setServerStatus(null));
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTokenState('');
    setPassword('');
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'products') {
        const d = await api('/api/admin/products');
        setProducts(d.products || []);
      } else if (tab === 'orders') {
        const d = await api('/api/admin/orders');
        setOrders(d.orders || []);
      } else if (tab === 'retailers') {
        const d = await api('/api/admin/retailers');
        setRetailers(d.retailers || []);
      } else {
        const d = await api('/api/admin/leads');
        setLeads(d.leads || []);
      }
    } catch (err: any) {
      if (String(err.message || '').toLowerCase().includes('unauthorized')) logout();
      else setError(err.message || 'Load failed');
    } finally {
      setLoading(false);
    }
  }, [tab, logout]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');
    try {
      const d = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) });
      setToken(d.token);
      setTokenState(d.token);
      showToast('Welcome back!');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  // -------------------- login screen --------------------
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#00290f]">
        <div className="w-full max-w-sm bg-[#f6fbf1] rounded-2xl shadow-2xl p-8 space-y-5 border border-[#ffdf93]/20">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-[#f2c027] text-[#181d17] flex items-center justify-center font-bold text-lg mx-auto">
              MZ
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#00290f]">Mazooq Admin</h1>
            <p className="text-xs text-[#414941]">Products, orders & retailer leads - ek hi jagah</p>
          </div>
          {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">{error}</div>}
          {serverStatus && !serverStatus.adminConfigured && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
              Admin password set nahi hai. Server ke environment me <b>ADMIN_PASSWORD</b> set karein (local: `.env` file), phir dobara try karein.
            </div>
          )}
          {serverStatus?.store === 'file' && (
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-xs">
              Local file store active hai (development mode). Production ke liye Google Cloud Firestore connect karein - <b>GOOGLE-CLOUD-GUIDE.md</b> dekhein.
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className={labelCls}>Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                loggingIn ? 'bg-stone-300 text-stone-500' : 'bg-[#f2c027] hover:bg-[#ffdf93] text-[#181d17]'
              }`}
            >
              {loggingIn ? 'Checking...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------- product save / delete --------------------
  const saveProduct = async () => {
    if (!editing) return;
    if (!editing.id || !editing.name) { setError('Product ID aur Name zaroori hai'); return; }
    if (!editing.variants.length) { setError('Kam se kam ek variant (size + price) chahiye'); return; }
    setSaving(true);
    setError('');
    try {
      const d = await api('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({ product: { ...editing, sortIndex: editing.sortIndex ?? products.length } }),
      });
      setEditing(null);
      showToast(d.deploy?.triggered ? 'Saved! Site 1-2 min me update hogi (deploy triggered).' : 'Saved! Note: DEPLOY_HOOK_URL set nahi hai, changes next deploy par jayenge.');
      load();
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"? Ye action wapas nahi hoga.`)) return;
    try {
      const d = await api('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete', id: p.id }),
      });
      showToast(d.deploy?.triggered ? 'Deleted! Site 1-2 min me update hogi.' : 'Deleted!');
      load();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await api('/api/admin/orders', { method: 'POST', body: JSON.stringify({ id, status }) });
      showToast(`Order status -> ${status}`);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch (err: any) {
      setError(err.message || 'Status update failed');
    }
  };

  const updateRetailerStatus = async (id: string, status: string) => {
    try {
      await api('/api/admin/retailers', { method: 'POST', body: JSON.stringify({ id, status }) });
      showToast(`Retailer status -> ${status}`);
      setRetailers((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (err: any) {
      setError(err.message || 'Status update failed');
    }
  };

  const handleUpload = async (file: File) => {
    if (!editing) return;
    if (file.size > 4 * 1024 * 1024) { setError('Image max 4 MB'); return; }
    setUploading(true);
    setError('');
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(',')[1] || '');
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const d = await api('/api/admin/upload', {
        method: 'POST',
        body: JSON.stringify({ filename: file.name, contentType: file.type, base64 }),
      });
      setEditing((prev) => (prev ? { ...prev, image: d.url } : prev));
      showToast('Image uploaded ✓');
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // -------------------- dashboard --------------------
  return (
    <div className="min-h-screen pb-20">
      {/* Top bar */}
      <header className="bg-[#00290f] text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f2c027] text-[#181d17] flex items-center justify-center font-bold text-xs">MZ</div>
            <div>
              <h1 className="font-serif text-lg font-bold leading-tight">Mazooq Admin</h1>
              <p className="text-[10px] text-[#ffdf93] uppercase tracking-wider">
                Store: {serverStatus?.store === 'firestore' ? 'Google Firestore (live)' : serverStatus?.store === 'supabase' ? 'Supabase (live)' : 'Local file (dev)'}
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-2 text-xs">
            {(['products', 'orders', 'retailers', 'leads'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg font-semibold uppercase tracking-wider transition ${
                  tab === t ? 'bg-[#f2c027] text-[#181d17]' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {t}
              </button>
            ))}
            <button onClick={logout} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/90">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {toast && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">{toast}</div>}
        {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">{error}</div>}

        {/* Products tab */}
        {tab === 'products' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-bold text-[#00290f]">Products ({products.length})</h2>
              <div className="flex gap-2">
                <button onClick={load} className="px-4 py-2 rounded-lg border border-[#dfe4da] bg-white text-xs font-semibold">Refresh</button>
                <button
                  onClick={() => { setEditing({ ...EMPTY_PRODUCT }); setIsNew(true); }}
                  className="px-4 py-2 rounded-lg bg-[#00290f] text-white text-xs font-bold"
                >
                  + Add Product
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#dfe4da] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#f1f5eb] text-[#414941] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="text-left px-3 py-2">Image</th>
                      <th className="text-left px-3 py-2">Product</th>
                      <th className="text-left px-3 py-2">Category</th>
                      <th className="text-left px-3 py-2">Price</th>
                      <th className="text-left px-3 py-2">Status</th>
                      <th className="text-right px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-[#ebefe6] hover:bg-[#f8fbf5]">
                        <td className="px-3 py-2">
                          <div className="w-10 h-10 rounded bg-[#ebefe6] overflow-hidden flex items-center justify-center">
                            {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-contain" /> : <span className="text-[10px] text-[#717970]">no img</span>}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-semibold text-[#00290f]">{p.name}</div>
                          <div className="text-[10px] text-[#717970] font-mono">{p.id}</div>
                        </td>
                        <td className="px-3 py-2">{p.categoryLabel || p.category}</td>
                        <td className="px-3 py-2 font-semibold text-[#765b00]">{priceRange(p)}</td>
                        <td className="px-3 py-2">
                          {p.hidden ? <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold">HIDDEN</span> : <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">LIVE</span>}
                          {p.isComingSoon && <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">COMING SOON</span>}
                        </td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <button onClick={() => { setEditing({ ...p }); setIsNew(false); }} className="px-3 py-1.5 rounded bg-[#104020] text-[#ffdf93] font-semibold mr-1">Edit</button>
                          <button onClick={() => deleteProduct(p)} className="px-3 py-1.5 rounded bg-rose-600 text-white font-semibold">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {!products.length && !loading && (
                      <tr><td colSpan={6} className="px-3 py-10 text-center text-[#717970]">Koi product nahi mila. "Add Product" se naya banao.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[11px] text-[#717970]">
              Save karne par change database me jaata hai. DEPLOY_HOOK_URL set ho to site ~1-2 min me automatically update hoti hai; warna next deploy par.
            </p>
          </section>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#00290f]">Orders ({orders.length})</h2>
              <button onClick={load} className="px-4 py-2 rounded-lg border border-[#dfe4da] bg-white text-xs font-semibold">Refresh</button>
            </div>
            <div className="bg-white rounded-xl border border-[#dfe4da] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#f1f5eb] text-[#414941] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="text-left px-3 py-2">Date</th>
                      <th className="text-left px-3 py-2">Receipt</th>
                      <th className="text-left px-3 py-2">Type</th>
                      <th className="text-left px-3 py-2">Customer</th>
                      <th className="text-left px-3 py-2">Total</th>
                      <th className="text-left px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-t border-[#ebefe6] hover:bg-[#f8fbf5]">
                        <td className="px-3 py-2 whitespace-nowrap">{formatDate(o.created_at || o.createdAt)}</td>
                        <td className="px-3 py-2 font-mono">{o.receipt || '-'}</td>
                        <td className="px-3 py-2">{o.type === 'COD_ORDER' ? 'COD' : 'Online (Razorpay)'}</td>
                        <td className="px-3 py-2">
                          <div className="font-semibold">{o.customer?.name || '-'}</div>
                          <div className="text-[10px] text-[#717970]">{o.customer?.phone || ''}</div>
                        </td>
                        <td className="px-3 py-2 font-semibold text-[#765b00]">₹{o.totals?.total ?? '-'}</td>
                        <td className="px-3 py-2">
                          <select
                            value={o.status || 'New'}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className="bg-white border border-[#dfe4da] rounded px-2 py-1 text-xs"
                          >
                            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                    {!orders.length && !loading && (
                      <tr><td colSpan={6} className="px-3 py-10 text-center text-[#717970]">Abhi koi order nahi aaya. Orders yahan automatically dikhenge.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Retailers tab */}
        {tab === 'retailers' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#00290f]">Retailer Applications ({retailers.length})</h2>
              <button onClick={load} className="px-4 py-2 rounded-lg border border-[#dfe4da] bg-white text-xs font-semibold">Refresh</button>
            </div>
            <div className="bg-white rounded-xl border border-[#dfe4da] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#f1f5eb] text-[#414941] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="text-left px-3 py-2">Business</th>
                      <th className="text-left px-3 py-2">Contact</th>
                      <th className="text-left px-3 py-2">GSTIN / City</th>
                      <th className="text-left px-3 py-2">Status</th>
                      <th className="text-right px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retailers.map((r) => {
                      const statusColor =
                        r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800'
                        : r.status === 'PENDING' ? 'bg-amber-100 text-amber-800'
                        : r.status === 'SUSPENDED' ? 'bg-orange-100 text-orange-800'
                        : 'bg-rose-100 text-rose-800';
                      return (
                        <tr key={r.id} className="border-t border-[#ebefe6] hover:bg-[#f8fbf5]">
                          <td className="px-3 py-2">
                            <div className="font-semibold text-[#00290f]">{r.retailer?.businessName || r.name || '-'}</div>
                            <div className="text-[10px] text-[#717970]">{r.retailer?.businessType || ''}</div>
                          </td>
                          <td className="px-3 py-2">
                            <div>{r.name || '-'}</div>
                            <div className="text-[10px] text-[#717970]">{r.email}</div>
                            <div className="text-[10px] text-[#717970]">{r.phone || ''}</div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="font-mono text-[10px]">{r.retailer?.gstin || '-'}</div>
                            <div className="text-[10px] text-[#717970]">{r.retailer?.city || ''}</div>
                          </td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor}`}>{r.status || 'PENDING'}</span>
                          </td>
                          <td className="px-3 py-2 text-right whitespace-nowrap space-x-1">
                            {r.status !== 'APPROVED' && (
                              <button onClick={() => updateRetailerStatus(r.id, 'APPROVED')} className="px-3 py-1.5 rounded bg-emerald-600 text-white font-semibold">
                                {r.status === 'SUSPENDED' ? 'Reactivate' : 'Approve'}
                              </button>
                            )}
                            {r.status === 'PENDING' && (
                              <button onClick={() => updateRetailerStatus(r.id, 'REJECTED')} className="px-3 py-1.5 rounded bg-rose-600 text-white font-semibold">Reject</button>
                            )}
                            {r.status === 'APPROVED' && (
                              <button onClick={() => updateRetailerStatus(r.id, 'SUSPENDED')} className="px-3 py-1.5 rounded bg-orange-500 text-white font-semibold">Suspend</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {!retailers.length && !loading && (
                      <tr><td colSpan={5} className="px-3 py-10 text-center text-[#717970]">Abhi koi retailer application nahi aayi. Jab koi "Register as Retailer" form bharega, yahan dikhega.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[11px] text-[#717970]">
              Approve karne ke baad retailer apne email/password se login kar sakta hai (Retailer pricing Phase 3 me activate hoga).
            </p>
          </section>
        )}

        {/* Leads tab */}
        {tab === 'leads' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#00290f]">Leads & Messages ({leads.length})</h2>
              <button onClick={load} className="px-4 py-2 rounded-lg border border-[#dfe4da] bg-white text-xs font-semibold">Refresh</button>
            </div>
            <div className="bg-white rounded-xl border border-[#dfe4da] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#f1f5eb] text-[#414941] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="text-left px-3 py-2">Date</th>
                      <th className="text-left px-3 py-2">Type</th>
                      <th className="text-left px-3 py-2">Business</th>
                      <th className="text-left px-3 py-2">Contact</th>
                      <th className="text-left px-3 py-2">Phone / Email</th>
                      <th className="text-left px-3 py-2">City</th>
                      <th className="text-left px-3 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => {
                      const d = l.data || l;
                      return (
                        <tr key={l.id} className="border-t border-[#ebefe6] hover:bg-[#f8fbf5]">
                          <td className="px-3 py-2 whitespace-nowrap">{formatDate(l.created_at || l.createdAt)}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              d.kind === 'CONTACT' ? 'bg-sky-100 text-sky-800'
                                : d.kind === 'NEWSLETTER' ? 'bg-violet-100 text-violet-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {d.kind === 'CONTACT' ? 'Message' : d.kind === 'NEWSLETTER' ? 'Newsletter' : 'Retailer'}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-semibold">{d.businessName || (d.kind === 'CONTACT' ? d.subject : '') || '-'}</td>
                          <td className="px-3 py-2">{d.contactName || '-'}</td>
                          <td className="px-3 py-2">
                            <div>{d.phone || '-'}</div>
                            <div className="text-[10px] text-[#717970]">{d.email || ''}</div>
                          </td>
                          <td className="px-3 py-2">{d.city || '-'}</td>
                          <td className="px-3 py-2 max-w-[220px] truncate" title={d.notes || ''}>{d.notes || '-'}</td>
                        </tr>
                      );
                    })}
                    {!leads.length && !loading && (
                      <tr><td colSpan={7} className="px-3 py-10 text-center text-[#717970]">Abhi koi lead ya message nahi aaya.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Product editor modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-[#00290f]/70 backdrop-blur-sm overflow-y-auto flex items-start justify-center p-4">
          <div className="w-full max-w-3xl bg-[#f6fbf1] rounded-2xl shadow-2xl my-8">
            <div className="bg-[#00290f] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">{isNew ? 'Add New Product' : `Edit: ${editing.name}`}</h3>
              <button onClick={() => setEditing(null)} className="text-white/70 hover:text-white text-xl leading-none px-2">×</button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Basics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Product ID (slug) *</label>
                  <input className={inputCls} value={editing.id} disabled={!isNew}
                    onChange={(e) => setEditing({ ...editing, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-') })}
                    placeholder="e.g. mazooq-black-pepper" />
                </div>
                <div>
                  <label className={labelCls}>Product Name *</label>
                  <input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. Mazooq Black Pepper" />
                </div>
                <div>
                  <label className={labelCls}>Category *</label>
                  <select className={inputCls} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category Label (display)</label>
                  <input className={inputCls} value={editing.categoryLabel} onChange={(e) => setEditing({ ...editing, categoryLabel: e.target.value })} placeholder="e.g. Pure Spices" />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Subtitle</label>
                  <input className={inputCls} value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Tag (optional badge)</label>
                  <input className={inputCls} value={editing.tag || ''} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} placeholder="e.g. Best Seller" />
                </div>
                <div>
                  <label className={labelCls}>Origin</label>
                  <input className={inputCls} value={editing.origin} onChange={(e) => setEditing({ ...editing, origin: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea className={inputCls} rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Story (heritage note)</label>
                  <textarea className={inputCls} rows={2} value={editing.story} onChange={(e) => setEditing({ ...editing, story: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Ingredients</label>
                  <input className={inputCls} value={editing.ingredients} onChange={(e) => setEditing({ ...editing, ingredients: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>FSSAI Number</label>
                  <input className={inputCls} value={editing.fssaiNumber || ''} onChange={(e) => setEditing({ ...editing, fssaiNumber: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Preparation / Usage</label>
                  <input className={inputCls} value={editing.preparationOrUsage} onChange={(e) => setEditing({ ...editing, preparationOrUsage: e.target.value })} />
                </div>
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={labelCls}>Sizes & Prices (variants) *</label>
                  <button
                    onClick={() => setEditing({ ...editing, variants: [...editing.variants, { size: '', price: 0, weightInGrams: 0 }] })}
                    className="px-3 py-1 rounded bg-[#104020] text-[#ffdf93] text-[11px] font-semibold"
                  >
                    + Add Variant
                  </button>
                </div>
                <div className="space-y-2">
                  {editing.variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                      <input className={inputCls} placeholder="Size (e.g. 250g)" value={v.size}
                        onChange={(e) => { const vs = [...editing.variants]; vs[i] = { ...v, size: e.target.value }; setEditing({ ...editing, variants: vs }); }} />
                      <input className={inputCls} type="number" placeholder="Price ₹" value={v.price || ''}
                        onChange={(e) => { const vs = [...editing.variants]; vs[i] = { ...v, price: Number(e.target.value) }; setEditing({ ...editing, variants: vs }); }} />
                      <input className={inputCls} type="number" placeholder="Weight (g)" value={v.weightInGrams || ''}
                        onChange={(e) => { const vs = [...editing.variants]; vs[i] = { ...v, weightInGrams: Number(e.target.value) }; setEditing({ ...editing, variants: vs }); }} />
                      <button
                        onClick={() => setEditing({ ...editing, variants: editing.variants.filter((_, x) => x !== i) })}
                        className="px-3 py-2 rounded bg-rose-100 text-rose-700 text-xs font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retailer Wholesale Pricing Tiers */}
              <div className="bg-[#104020]/5 p-4 rounded-xl border border-[#f2c027]/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className={labelCls}>Retailer Wholesale Pricing Tiers (optional)</label>
                    <p className="text-[10px] text-[#717970] leading-relaxed">
                      Quantity-based wholesale pricing for APPROVED retailers only. Empty means retailers pay the regular variant price.
                      <br />Enter prices for the pack size chosen below. Other pack sizes get the same % discount automatically
                      (never above their retail price).
                    </p>
                  </div>
                  <button
                    onClick={() => setEditing({
                      ...editing,
                      retailerPricing: [
                        ...(editing.retailerPricing || []),
                        { minQty: 10, maxQty: 24, pricePerUnit: 0 },
                      ],
                    })}
                    className="px-3 py-1 rounded bg-[#104020] text-[#ffdf93] text-[11px] font-semibold"
                  >
                    + Add Tier
                  </button>
                </div>
                {editing.variants.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <span className="text-[#414941] font-semibold">Tier prices are for pack size:</span>
                    <select
                      className="px-2 py-1 rounded border border-[#dfe4da] bg-white text-xs"
                      value={editing.retailerPricingSize || retailerReferenceSize(editing) || editing.variants[0].size}
                      onChange={(e) => setEditing({ ...editing, retailerPricingSize: e.target.value })}
                    >
                      {editing.variants.map((v) => (
                        <option key={v.size} value={v.size}>{v.size} (retail ₹{v.price})</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="space-y-2">
                  {(editing.retailerPricing || []).map((tier, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                      <input
                        className={inputCls}
                        type="number"
                        min={1}
                        placeholder="Min Qty (e.g. 10)"
                        value={tier.minQty || ''}
                        onChange={(e) => {
                          const tiers = [...(editing.retailerPricing || [])];
                          tiers[i] = { ...tier, minQty: Number(e.target.value) || 0 };
                          setEditing({ ...editing, retailerPricing: tiers });
                        }}
                      />
                      <input
                        className={inputCls}
                        type="number"
                        placeholder="Max Qty (blank = no upper bound)"
                        value={tier.maxQty ?? ''}
                        onChange={(e) => {
                          const tiers = [...(editing.retailerPricing || [])];
                          const v = e.target.value;
                          tiers[i] = { ...tier, maxQty: v === '' ? null : Number(v) };
                          setEditing({ ...editing, retailerPricing: tiers });
                        }}
                      />
                      <input
                        className={inputCls}
                        type="number"
                        min={0}
                        placeholder="Price per Unit ₹"
                        value={tier.pricePerUnit || ''}
                        onChange={(e) => {
                          const tiers = [...(editing.retailerPricing || [])];
                          tiers[i] = { ...tier, pricePerUnit: Number(e.target.value) || 0 };
                          setEditing({ ...editing, retailerPricing: tiers });
                        }}
                      />
                      <button
                        onClick={() => setEditing({
                          ...editing,
                          retailerPricing: (editing.retailerPricing || []).filter((_, x) => x !== i),
                        })}
                        className="px-3 py-2 rounded bg-rose-100 text-rose-700 text-xs font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {(!editing.retailerPricing || editing.retailerPricing.length === 0) && (
                    <div className="text-[11px] text-[#717970] italic p-2 bg-white rounded-lg border border-dashed border-[#dfe4da]">
                      No retailer tiers configured. Retailers will see regular prices. Click "+ Add Tier" to set wholesale rates.
                    </div>
                  )}
                </div>
              </div>

              {/* Image */}
              <div>
                <label className={labelCls}>Product Image</label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-20 h-20 rounded-lg bg-white border border-[#dfe4da] overflow-hidden flex items-center justify-center">
                    {editing.image ? <img src={editing.image} alt="preview" className="w-full h-full object-contain" /> : <span className="text-[10px] text-[#717970]">preview</span>}
                  </div>
                  <div className="flex-1 min-w-[220px] space-y-2">
                    <input className={inputCls} placeholder="Image URL (https://...)" value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
                    <label className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#104020] cursor-pointer">
                      <span className="px-3 py-1.5 rounded bg-[#f2c027] text-[#181d17]">{uploading ? 'Uploading...' : 'Upload from computer'}</span>
                      <input type="file" accept="image/*" className="hidden" disabled={uploading}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }} />
                      <span className="text-[#717970] font-normal">(max 4 MB)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-6 text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!editing.isComingSoon} onChange={(e) => setEditing({ ...editing, isComingSoon: e.target.checked })} />
                  Coming Soon badge
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={!!editing.hidden} onChange={(e) => setEditing({ ...editing, hidden: e.target.checked })} />
                  Hide from website (catalog me nahi dikhega)
                </label>
              </div>

              {/* Nutrition */}
              <details className="text-xs">
                <summary className="cursor-pointer font-semibold text-[#414941]">Nutrition (optional)</summary>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                  {(['calories', 'protein', 'carbs', 'fat', 'sodium'] as const).map((k) => (
                    <div key={k}>
                      <label className={labelCls}>{k}</label>
                      <input className={inputCls} value={editing.nutrition[k]}
                        onChange={(e) => setEditing({ ...editing, nutrition: { ...editing.nutrition, [k]: e.target.value } })} />
                    </div>
                  ))}
                </div>
              </details>
            </div>

            <div className="px-6 py-4 border-t border-[#dfe4da] flex items-center justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border border-[#dfe4da] bg-white text-xs font-semibold">Cancel</button>
              <button
                onClick={saveProduct}
                disabled={saving}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider ${saving ? 'bg-stone-300 text-stone-500' : 'bg-[#f2c027] text-[#181d17] hover:bg-[#ffdf93]'}`}
              >
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
