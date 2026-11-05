import React, { useEffect, useState, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import {
  Store,
  TrendingUp,
  Package,
  Truck,
  LogOut,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  Building2,
  Calculator,
  ChevronRight,
} from 'lucide-react';
import { COMPANY } from '../data/company';

interface DashboardAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  retailer: {
    businessName?: string;
    gstin?: string;
    city?: string;
    businessType?: string;
    interestProducts?: string;
    notes?: string;
  } | null;
  createdAt: string;
}

interface DashboardOrder {
  id: string;
  receipt?: string;
  type: string;
  status: string;
  created_at?: string;
  totals?: {
    subtotal?: number;
    shipping?: number;
    total?: number;
  };
  items?: Array<{ name?: string; variantSize?: string; quantity?: number; price?: number }>;
}

const STATUS_BADGE: Record<string, string> = {
  New: 'bg-sky-100 text-sky-800',
  Confirmed: 'bg-indigo-100 text-indigo-800',
  Packed: 'bg-violet-100 text-violet-800',
  Shipped: 'bg-amber-100 text-amber-800',
  Delivered: 'bg-emerald-100 text-emerald-800',
  Cancelled: 'bg-rose-100 text-rose-800',
};

export const RetailerDashboardView: React.FC = () => {
  const { user, sessionLoaded, redirectTo, setActivePage, showToast, openAccount } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [account, setAccount] = useState<DashboardAccount | null>(null);
  const [orders, setOrders] = useState<DashboardOrder[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/retailer/dashboard');
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.ok) {
        throw new Error(d?.message || 'Dashboard load failed. Please log in again.');
      }
      setAccount(d.account);
      setOrders(d.orders || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Guard: only APPROVED retailers should be here. Otherwise redirect.
    // Wait for the login check first, so opening /retailer/dashboard directly works.
    if (!sessionLoaded) return;
    if (!user) {
      redirectTo('retailer-portal');
      openAccount();
      return;
    }
    if (user.role !== 'RETAILER' || user.status !== 'APPROVED') {
      redirectTo('retailer-portal');
      showToast('Approval Pending', 'Retailer dashboard only for approved partners. Please wait for admin approval.');
      return;
    }
    load();
  }, [user, sessionLoaded, load, redirectTo, showToast, openAccount]);

  const totalSpend = orders.reduce(
    (acc, o) => acc + (o.totals?.total || 0),
    0
  );
  const totalUnits = orders.reduce(
    (acc, o) => acc + (o.items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0),
    0
  );

  return (
    <div className="w-full bg-[#f6fbf1] text-[#181d17] pt-12 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <section className="mb-8">
          <div className="bg-[#00290f] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#ffdf93]/20">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f2c027] text-[#181d17] flex items-center justify-center font-bold text-lg shrink-0">
                  {(account?.name || account?.email || 'R').slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase font-bold text-[#ffdf93] tracking-widest">
                      Retailer Partner Dashboard
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-bold uppercase">
                      Approved
                    </span>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1 leading-tight">
                    Welcome, {account?.name || account?.email}
                  </h1>
                  <p className="text-xs text-white/70 mt-1">
                    {account?.retailer?.businessName || 'Retailer Account'} • {account?.retailer?.city || ''}
                  </p>
                </div>
              </div>
              <button
                onClick={openAccount}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
            {error}
          </div>
        )}

        {/* Stats Row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<Package className="w-5 h-5 text-[#f2c027]" />}
            label="Total Orders"
            value={String(orders.length)}
            sub="All-time wholesale orders"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5 text-[#f2c027]" />}
            label="Total Spend"
            value={`₹${totalSpend.toLocaleString('en-IN')}`}
            sub="Inclusive of taxes & shipping"
          />
          <StatCard
            icon={<Store className="w-5 h-5 text-[#f2c027]" />}
            label="Total Units"
            value={String(totalUnits)}
            sub="Packs purchased"
          />
          <StatCard
            icon={<ShieldCheck className="w-5 h-5 text-[#f2c027]" />}
            label="Partner Status"
            value="Approved"
            sub="Wholesale pricing active"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Details */}
          <section className="bg-white rounded-2xl border border-[#ebefe6] p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#765b00]" />
              <h2 className="font-serif text-lg font-bold text-[#00290f]">Account Details</h2>
            </div>
            <dl className="space-y-2 text-xs">
              <Detail label="Contact Name" value={account?.name || '-'} />
              <Detail label="Email" value={account?.email || '-'} />
              <Detail label="Phone" value={account?.phone || '-'} />
              <Detail
                label="Business Name"
                value={account?.retailer?.businessName || '-'}
              />
              <Detail label="GSTIN" value={account?.retailer?.gstin || '-'} />
              <Detail label="City" value={account?.retailer?.city || '-'} />
              <Detail label="Business Type" value={account?.retailer?.businessType || '-'} />
              <Detail
                label="Member Since"
                value={
                  account?.createdAt
                    ? new Date(account.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'
                }
              />
            </dl>
            <div className="pt-2">
              <button
                onClick={() => setActivePage('shop-all')}
                className="w-full py-3 bg-[#f2c027] text-[#181d17] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#ffdf93] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4" />
                Browse Wholesale Shop
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Recent Orders */}
          <section className="bg-white rounded-2xl border border-[#ebefe6] p-6 space-y-4 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#765b00]" />
                <h2 className="font-serif text-lg font-bold text-[#00290f]">Recent Orders</h2>
              </div>
              <span className="text-[11px] text-[#717970]">{orders.length} total</span>
            </div>
            {loading ? (
              <div className="py-8 text-center text-xs text-[#717970]">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Package className="w-10 h-10 text-[#717970]/40 mx-auto" />
                <p className="text-xs text-[#414941]">No orders yet. Browse the wholesale shop to place your first order.</p>
                <button
                  onClick={() => setActivePage('shop-all')}
                  className="mt-2 px-5 py-2 bg-[#00290f] text-white text-xs font-semibold uppercase tracking-wider rounded-lg"
                >
                  Browse Shop
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {orders.map((o) => (
                  <div key={o.id} className="p-3 bg-[#f6fbf1] rounded-xl border border-[#ebefe6] text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-[#00290f]">#{o.receipt || o.id?.slice(-6)}</div>
                        <div className="text-[10px] text-[#717970]">
                          {o.created_at
                            ? new Date(o.created_at).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })
                            : '-'}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          STATUS_BADGE[o.status] || 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {o.status || 'New'}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-[#414941]">
                      {(o.items || []).slice(0, 3).map((it, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="truncate pr-2">
                            {it.name} ({it.variantSize}) × {it.quantity}
                          </span>
                          <span className="font-semibold shrink-0">₹{(it.price || 0) * (it.quantity || 0)}</span>
                        </div>
                      ))}
                      {(o.items?.length || 0) > 3 && (
                        <div className="text-[10px] text-[#717970]">
                          +{(o.items?.length || 0) - 3} more items
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#ebefe6]">
                      <span className="text-[10px] text-[#717970] uppercase tracking-wider">
                        {o.type === 'COD_ORDER' ? 'Cash on Delivery' : 'Online Payment'}
                      </span>
                      <span className="font-bold text-sm text-[#765b00]">₹{o.totals?.total ?? '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Wholesale Pricing Info */}
        <section className="mt-6 bg-white rounded-2xl border border-[#ebefe6] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-[#765b00]" />
            <h2 className="font-serif text-lg font-bold text-[#00290f]">Wholesale Pricing Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <InfoCard
              icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
              title="Tiered Quantity Pricing"
              body="As an approved retailer, your cart automatically receives the lowest applicable wholesale price based on the total quantity of each product you purchase."
            />
            <InfoCard
              icon={<Truck className="w-4 h-4 text-emerald-600" />}
              title="Wholesale Shipping"
              body="Free shipping on wholesale orders above ₹5,000. Orders below that threshold incur a flat ₹199 shipping fee — significantly cheaper than retail rates."
            />
            <InfoCard
              icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
              title="Server-Side Validation"
              body="All prices are recomputed on the server at checkout time. You can never be overcharged — the displayed price is always the server-validated price."
            />
          </div>
          <div className="mt-4 p-4 bg-[#f6fbf1] rounded-xl border border-[#ebefe6] text-xs">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#00290f]">Wholesale tier example:</span>
                <span className="text-[#414941] ml-1">
                  Buy 10-24 units of a product → tier 1 price. 25-49 units → tier 2 (lower). 50+ units → tier 3 (lowest).
                  Visit any product detail page to see its specific tier table.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Direct Support */}
        <section className="mt-6 bg-[#00290f] text-white rounded-2xl p-6 border border-[#ffdf93]/20">
          <h3 className="font-serif text-lg font-bold mb-3">Need help with a wholesale order?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <a
              href={`tel:${COMPANY.phones[0]}`}
              className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#f2c027]" />
              <div>
                <div className="text-white/60 text-[10px] uppercase">Call</div>
                <div className="font-semibold">{COMPANY.phones[0]}</div>
              </div>
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Mail className="w-4 h-4 text-[#f2c027]" />
              <div>
                <div className="text-white/60 text-[10px] uppercase">Email</div>
                <div className="font-semibold">{COMPANY.email}</div>
              </div>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage('contact');
              }}
              className="flex items-center gap-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Clock className="w-4 h-4 text-[#f2c027]" />
              <div>
                <div className="text-white/60 text-[10px] uppercase">Support</div>
                <div className="font-semibold">Contact Page</div>
              </div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; sub: string }> = ({
  icon,
  label,
  value,
  sub,
}) => (
  <div className="bg-white rounded-xl p-4 border border-[#ebefe6] shadow-sm">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-8 h-8 bg-[#f6fbf1] rounded-lg flex items-center justify-center">{icon}</div>
      <span className="text-[10px] uppercase tracking-wider text-[#717970] font-semibold">{label}</span>
    </div>
    <div className="font-serif text-2xl font-bold text-[#00290f]">{value}</div>
    <div className="text-[10px] text-[#717970] mt-0.5">{sub}</div>
  </div>
);

const Detail: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-start gap-2 py-1 border-b border-[#f1f5eb] last:border-0">
    <dt className="text-[#717970] text-[11px] uppercase tracking-wider shrink-0">{label}</dt>
    <dd className="font-semibold text-[#181d17] text-right break-all">{value}</dd>
  </div>
);

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; body: string }> = ({
  icon,
  title,
  body,
}) => (
  <div className="p-4 bg-[#f6fbf1] rounded-xl border border-[#ebefe6]">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">{icon}</div>
      <h4 className="font-semibold text-[#00290f] text-xs">{title}</h4>
    </div>
    <p className="text-[11px] text-[#414941] leading-relaxed">{body}</p>
  </div>
);