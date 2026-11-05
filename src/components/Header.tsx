import React, { useState } from 'react';
import { useCart, PageView } from '../context/CartContext';
import { Search, ShoppingBag, Menu, X, ArrowRight, User, Store, LogOut, LayoutDashboard } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    totalItems,
    setIsCartOpen,
    setIsSearchOpen,
    activePage,
    setActivePage,
    openAccount,
    setAccountMode,
    user,
    isApprovedRetailer,
    refreshSession,
    showToast,
  } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Public customer navigation: Home | Shop | About | Contact | Cart | Account
  const navLinks: { label: string; page: PageView }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop-all' },
    { label: 'About', page: 'our-story' },
    { label: 'Contact', page: 'contact' },
  ];

  // Approved retailers get an additional Dashboard entry point.
  if (isApprovedRetailer) {
    navLinks.splice(2, 0, { label: 'Dashboard', page: 'retailer-dashboard' });
  }

  const handleNavClick = (page: PageView) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const openRetailerLogin = () => {
    setAccountMode('retailer-login');
    setIsAccountOpenIfReady(true);
    setMobileMenuOpen(false);
  };

  const setIsAccountOpenIfReady = (open: boolean) => {
    // We piggyback on openAccount() since the modal opens when isAccountOpen flips true.
    if (open) openAccount();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch { /* ignore */ }
    await refreshSession();
    showToast('Logged out', 'Phir milenge!');
    setMobileMenuOpen(false);
    setActivePage('home');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-[#104020] text-[#ffdf93] text-center py-1.5 px-4 text-[11px] font-semibold uppercase tracking-widest shadow-sm flex items-center justify-center gap-2">
        <span>Taste the smile</span>
        <span className="opacity-40 hidden sm:inline">•</span>
        <span className="hidden sm:inline">Premium Indian Foods Built with Trust</span>
        <span className="opacity-40">•</span>
        <button
          onClick={() => handleNavClick('retailer-portal')}
          className="underline hover:text-white transition-colors cursor-pointer"
        >
          Retailer / Wholesale
        </button>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 bg-[#00290f]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.22)] border-b border-[#ffdf93]/15">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
          {/* Logo & Brand Zone */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 shrink-0 text-left focus:outline-none group cursor-pointer"
          >
            <img
              src="/photos/mazooq-logo.png"
              alt="Mazooq Emblem"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg tracking-tight font-bold text-white uppercase leading-none">
                MAZOOQ FOODS
              </span>
              <span className="text-[10px] text-[#f2c027] font-semibold tracking-widest uppercase mt-1">
                Taste the smile
              </span>
            </div>
          </button>

          {/* Navigation Links (Visible on desktop and tablet) */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-6">
            {navLinks.map((link) => {
              const isActive = activePage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`text-xs xl:text-sm font-medium transition-colors cursor-pointer relative py-1.5 whitespace-nowrap ${
                    isActive
                      ? 'text-[#ffdf93] font-bold'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f2c027] rounded-full shadow-[0_0_8px_#f2c027]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Trigger */}
            <button
              type="button"
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-white/80 hover:text-[#ffdf93] hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account / User Trigger */}
            {user ? (
              <div className="relative group">
                <button
                  type="button"
                  aria-label="My Account"
                  className="relative p-2 text-white/80 hover:text-[#ffdf93] hover:bg-white/10 rounded-full transition-all cursor-pointer flex items-center gap-1"
                >
                  <User className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#00290f]"></span>
                </button>
                {/* Account Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-2xl border border-[#dfe4da] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-3 border-b border-[#ebefe6]">
                    <div className="font-semibold text-[#00290f] text-xs truncate">{user.name || user.email}</div>
                    <div className="text-[10px] text-[#717970] truncate">{user.email}</div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        user.role === 'RETAILER'
                          ? user.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                          : 'bg-[#dfe4da] text-[#414941]'
                      }`}
                    >
                      {user.role === 'RETAILER'
                        ? `Retailer • ${user.status || 'PENDING'}`
                        : 'Customer'}
                    </span>
                  </div>
                  <div className="py-1 text-xs">
                    {isApprovedRetailer && (
                      <button
                        onClick={() => handleNavClick('retailer-dashboard')}
                        className="w-full text-left px-3 py-2 hover:bg-[#f6fbf1] flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#765b00]" />
                        Retailer Dashboard
                      </button>
                    )}
                    <button
                      onClick={openAccount}
                      className="w-full text-left px-3 py-2 hover:bg-[#f6fbf1] flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#765b00]" />
                      My Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-700 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                aria-label="My Account"
                onClick={openAccount}
                className="relative p-2 text-white/80 hover:text-[#ffdf93] hover:bg-white/10 rounded-full transition-all cursor-pointer"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Retailer Login Quick CTA - only for guests */}
            {!user && (
              <button
                onClick={openRetailerLogin}
                className="hidden xl:inline-flex items-center px-3 py-1 bg-white/10 text-[#ffdf93] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white/20 transition-all cursor-pointer"
              >
                Retailer Login
              </button>
            )}

            {/* Cart Trigger */}
            <button
              type="button"
              aria-label="Shopping Cart"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-white/80 hover:text-[#ffdf93] hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#f2c027] text-[#181d17] rounded-full text-[10px] flex items-center justify-center font-bold shadow">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Shop Now Primary Button */}
            <button
              onClick={() => handleNavClick('shop-all')}
              className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 bg-[#f2c027] text-[#181d17] font-bold text-xs rounded uppercase tracking-wider hover:bg-[#ffdf93] transition-colors shadow-sm cursor-pointer"
            >
              Shop Now
            </button>

            {/* Mobile & Tablet Menu Hamburger */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#ffdf93]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#00290f] border-b border-[#ffdf93]/30 shadow-2xl px-6 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-2 pb-4 border-b border-white/10">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`text-left text-sm py-2.5 px-3 rounded-xl font-medium transition-colors cursor-pointer flex items-center justify-between ${
                    activePage === link.page
                      ? 'bg-white/15 text-[#ffdf93] font-bold shadow-sm border border-[#ffdf93]/30'
                      : 'text-white/85 hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  {activePage === link.page && (
                    <span className="w-2 h-2 rounded-full bg-[#f2c027]"></span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              {!user && (
                <button
                  onClick={openRetailerLogin}
                  className="w-full py-2.5 px-4 bg-white/10 text-[#ffdf93] text-xs font-semibold uppercase tracking-wider rounded text-center flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  <span>Retailer Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {isApprovedRetailer && (
                <button
                  onClick={() => handleNavClick('retailer-dashboard')}
                  className="w-full py-2.5 px-4 bg-white/10 text-[#ffdf93] text-xs font-semibold uppercase tracking-wider rounded text-center flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Retailer Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleNavClick('shop-all')}
                className="w-full py-2.5 px-4 bg-[#f2c027] text-[#181d17] text-xs font-semibold uppercase tracking-wider rounded text-center font-bold"
              >
                Shop Full Collection
              </button>
              <div className="text-center text-[11px] text-white/60 pt-1">
                Customer Care: +91 70021 70175 • info@mazooq.com
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
