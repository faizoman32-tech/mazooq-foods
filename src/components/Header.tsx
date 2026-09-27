import React, { useState } from 'react';
import { useCart, PageView } from '../context/CartContext';
import { Search, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { totalItems, setIsCartOpen, setIsSearchOpen, activePage, setActivePage } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageView }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Our Story', page: 'our-story' },
    { label: 'Shop All', page: 'shop-all' },
    { label: 'Mazooq Tea', page: 'mazooq-tea' },
    { label: 'Mazooq Dates', page: 'mazooq-dates' },
    { label: 'Retailer Portal', page: 'retailer-portal' },
    { label: 'Global Vision', page: 'global-vision' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageView) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-[#104020] text-[#ffdf93] text-center py-1.5 px-4 text-[11px] font-semibold uppercase tracking-widest shadow-sm flex items-center justify-center gap-2">
        <span>Taste the smile</span>
        <span className="opacity-40">•</span>
        <span>Premium Indian Foods Built with Trust</span>
        <span className="opacity-40">•</span>
        <button
          onClick={() => handleNavClick('retailer-portal')}
          className="underline hover:text-white transition-colors cursor-pointer"
        >
          Enquire for Wholesale & Retail Partnerships
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
            <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#ffdf93] to-[#f2c027] shadow-md group-hover:scale-105 transition-transform">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1WQmVKzgQ8J59JKL6_h1uwe2m1Kmf9Rtxx0GpNbVFCZW6JTgdjA4aaM62xgCw5COpfk8okG5NNFXs8sbNxhCU6w56L5QxLoVG3TjqtzWj7QRB1ZKRgqMXhqUo6heuieYskJu3YzIok25giOlYJuCECACjIlsVV0Z3gD27TZBwmuxhWN8WpAeOd5mh7wFyKCeX6ceH0ia5ouDzTdcHJf_NulzIaaiGpv_to0Ms87OTZphHjBpRvu5J2X3ehf9pvu2Vapelp79PU30Zs"
                alt="Mazooq Emblem"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-tight font-bold text-white uppercase leading-none">
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

            {/* B2B Portal Quick CTA */}
            <button
              onClick={() => handleNavClick('retailer-portal')}
              className="hidden xl:inline-flex items-center px-3 py-1 bg-white/10 text-[#ffdf93] text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-white/20 transition-all cursor-pointer"
            >
              B2B Portal
            </button>

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
              <button
                onClick={() => handleNavClick('retailer-portal')}
                className="w-full py-2.5 px-4 bg-white/10 text-[#ffdf93] text-xs font-semibold uppercase tracking-wider rounded text-center flex items-center justify-center gap-2"
              >
                <span>B2B Wholesale Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
