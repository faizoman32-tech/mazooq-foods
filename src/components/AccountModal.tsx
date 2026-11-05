import React, { useState } from 'react';
import { useCart, AccountMode } from '../context/CartContext';
import { X, LogOut, Store, LayoutDashboard } from 'lucide-react';

const inputCls =
  'w-full bg-white border border-[#dfe4da] rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-[#765b00]';
const labelCls = 'block text-[11px] font-semibold text-[#414941] mb-1';

const RETAILER_STATUS: Record<string, { label: string; cls: string; note: string }> = {
  PENDING: {
    label: 'Approval Pending',
    cls: 'bg-amber-50 text-amber-900 border border-amber-200',
    note: 'Aapki application admin ke paas review me hai. Approve hone ke baad wholesale pricing active ho jayegi.',
  },
  APPROVED: {
    label: 'Approved Retailer',
    cls: 'bg-emerald-50 text-emerald-900 border border-emerald-200',
    note: 'Mubarak ho! Aapko ab wholesale tier pricing aur retailer dashboard access mil gaya hai.',
  },
  REJECTED: {
    label: 'Application Rejected',
    cls: 'bg-rose-50 text-rose-900 border border-rose-200',
    note: 'Application approve nahi hui. Sawaal ho to info@mazooq.com par likhein.',
  },
  SUSPENDED: {
    label: 'Account Suspended',
    cls: 'bg-orange-50 text-orange-900 border border-orange-200',
    note: 'Account suspend hai. Contact: info@mazooq.com',
  },
};

export const AccountModal: React.FC = () => {
  const {
    isAccountOpen,
    setIsAccountOpen,
    user,
    refreshSession,
    showToast,
    setActivePage,
    accountMode,
    setAccountMode,
    isApprovedRetailer,
  } = useCart();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', password: '' });

  if (!isAccountOpen) return null;

  // Default mode is 'login' when none was explicitly chosen.
  const mode: AccountMode = accountMode || 'login';

  const close = () => {
    setIsAccountOpen(false);
    setError('');
  };

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.ok) throw new Error(d?.message || 'Login failed');
      await refreshSession();
      showToast('Welcome back!', d.user?.name ? `Welcome, ${d.user.name}!` : 'Logged in successfully.');
      setLoginForm({ email: '', password: '' });
      // Auto-route: approved retailers go to dashboard.
      if (d.user?.role === 'RETAILER' && d.user?.status === 'APPROVED') {
        close();
        setActivePage('retailer-dashboard');
      } else {
        close();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const doRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      });
      const d = await res.json().catch(() => null);
      if (!res.ok || !d?.ok) throw new Error(d?.message || 'Registration failed');
      await refreshSession();
      showToast('Account created!', 'Aap ab logged in hain. Happy shopping!');
      setRegForm({ name: '', email: '', phone: '', password: '' });
      close();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  const doLogout = async () => {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    await refreshSession();
    showToast('Logged out', 'Phir milenge!');
    setBusy(false);
    close();
  };

  const goRetailerPortal = () => {
    close();
    setActivePage('retailer-portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goRetailerDashboard = () => {
    close();
    setActivePage('retailer-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const statusInfo = user?.role === 'RETAILER' ? RETAILER_STATUS[user.status] || RETAILER_STATUS.PENDING : null;

  // Title & subtitle depend on mode.
  const titleMap: Record<NonNullable<AccountMode>, { title: string; subtitle: string }> = {
    login: { title: 'Customer Login', subtitle: 'Aapke order history aur wishlist tak pahunchne ke liye.' },
    register: { title: 'Create Customer Account', subtitle: 'Naya customer account banayein aur shopping shuru karein.' },
    'retailer-login': {
      title: 'Retailer Login',
      subtitle: 'Approved retailers ke liye wholesale pricing aur dashboard access.',
    },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#00290f]/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#f6fbf1] w-full max-w-md rounded-2xl shadow-2xl border border-[#ffdf93]/20 overflow-hidden">
        {/* Header */}
        <div className="bg-[#00290f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f2c027] text-[#181d17] flex items-center justify-center font-bold text-xs">
              MZ
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-tight">
                {user ? 'My Account' : (titleMap[mode]?.title || 'Account Access')}
              </h3>
              {!user && (
                <p className="text-[11px] text-[#ffdf93]/80">
                  {titleMap[mode]?.subtitle}
                </p>
              )}
            </div>
          </div>
          <button onClick={close} className="p-1 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {user ? (
          /* ---------- Logged in view ---------- */
          <div className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#f2c027] text-[#181d17] flex items-center justify-center font-bold text-lg mx-auto shadow">
                {(user.name || user.email || 'U').slice(0, 1).toUpperCase()}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#00290f]">{user.name || 'Welcome'}</h3>
              <p className="text-xs text-[#717970]">{user.email}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  user.role === 'RETAILER' ? 'bg-[#104020] text-[#ffdf93]' : 'bg-[#dfe4da] text-[#414941]'
                }`}
              >
                {user.role === 'RETAILER' ? `Retailer • ${user.status}` : 'Customer Account'}
              </span>
            </div>

            {statusInfo && (
              <div className={`p-3 rounded-lg text-xs ${statusInfo.cls}`}>
                <div className="font-bold mb-0.5">{statusInfo.label}</div>
                <div className="leading-relaxed">{statusInfo.note}</div>
              </div>
            )}

            <div className="space-y-2">
              {isApprovedRetailer && (
                <button
                  onClick={goRetailerDashboard}
                  className="w-full py-3 rounded-lg bg-[#104020] text-[#ffdf93] text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Retailer Dashboard
                </button>
              )}
              <button
                onClick={() => {
                  close();
                  showToast('My Orders', 'Aapke order history dashboard me dekha ja sakta hai.');
                  if (isApprovedRetailer) setActivePage('retailer-dashboard');
                }}
                className="w-full py-3 rounded-lg bg-white border border-[#dfe4da] text-xs font-semibold cursor-pointer"
              >
                My Orders
              </button>
              <button
                onClick={doLogout}
                disabled={busy}
                className="w-full py-3 rounded-lg bg-white border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                {busy ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        ) : (
          /* ---------- Login / Register / Retailer-Login view ---------- */
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setAccountMode(mode === 'retailer-login' ? 'retailer-login' : 'login'); setError(''); }}
                className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer ${
                  mode === 'login' || mode === 'retailer-login' ? 'bg-[#00290f] text-white' : 'bg-white border border-[#dfe4da] text-[#414941]'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setAccountMode('register'); setError(''); }}
                className={`py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer ${
                  mode === 'register' ? 'bg-[#00290f] text-white' : 'bg-white border border-[#dfe4da] text-[#414941]'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Retailer Login badge */}
            {mode === 'retailer-login' && (
              <div className="p-3 bg-[#104020] text-[#ffdf93] rounded-lg text-xs flex items-center gap-2">
                <Store className="w-4 h-4" />
                <span>
                  <strong>Retailer Login.</strong> Customer login form same hai - approved retailer hone par wholesale pricing automatic activate ho jayegi.
                </span>
              </div>
            )}

            {error && <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">{error}</div>}

            {mode === 'register' ? (
              <form onSubmit={doRegister} className="space-y-3">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input
                    required
                    className={inputCls}
                    value={regForm.name}
                    onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    required
                    className={inputCls}
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone (optional)</label>
                  <input
                    type="tel"
                    className={inputCls}
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className={labelCls}>Password (min 8 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    className={inputCls}
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="********"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer ${
                    busy ? 'bg-stone-300 text-stone-500' : 'bg-[#f2c027] text-[#181d17] hover:bg-[#ffdf93]'
                  }`}
                >
                  {busy ? 'Creating...' : 'Create Account'}
                </button>
              </form>
            ) : (
              <form onSubmit={doLogin} className="space-y-3">
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    type="email"
                    required
                    className={inputCls}
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className={labelCls}>Password</label>
                  <input
                    type="password"
                    required
                    className={inputCls}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="********"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer ${
                    busy ? 'bg-stone-300 text-stone-500' : 'bg-[#f2c027] text-[#181d17] hover:bg-[#ffdf93]'
                  }`}
                >
                  {busy ? 'Checking...' : 'Login'}
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-[#dfe4da] text-center space-y-1.5">
              <p className="text-[11px] text-[#717970]">Retailer / Wholesale buyer hain?</p>
              <button onClick={goRetailerPortal} className="text-xs font-bold text-[#104020] underline cursor-pointer">
                Register as Retailer / Retailer Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
