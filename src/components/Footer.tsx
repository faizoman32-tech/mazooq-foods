import React, { useState } from 'react';
import { useCart, PageView } from '../context/CartContext';
import { Phone, Mail, MapPin, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { COMPANY, whatsappLink } from '../data/company';
import { WhatsAppIconTinted } from './WhatsAppIcon';
import { pathFor } from '../routes';

export const Footer: React.FC = () => {
  const { setActivePage, showToast, openShopCategory } = useCart();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.message || 'Could not subscribe. Please try again.');
      setNewsletterSubscribed(true);
      showToast('Subscribed', 'Thank you! We will email you about new harvests and offers.');
    } catch (err: any) {
      showToast('Subscription failed', err?.message || 'Please try again.');
    }
  };

  const navigateTo = (page: PageView) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#00290f] text-white pt-16 pb-12 mt-16 shadow-[0_-4px_24px_rgba(0,0,0,0.15)] border-t border-[#ffdf93]/15">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img loading="lazy" decoding="async"
              src="/photos/mazooq-logo.png"
              alt="Mazooq Foods Emblem"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg"
            />
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-tight text-white uppercase font-bold leading-none">
                MAZOOQ FOODS
              </span>
              <span className="text-[11px] text-[#f2c027] uppercase tracking-widest font-semibold mt-1">
                Taste the smile
              </span>
            </div>
          </div>

          <p className="text-sm text-white/75 max-w-sm leading-relaxed">
            Taste the smile — connecting authentic Indian producers with modern retail and global ambition. Crafted with single-origin purity, harvest integrity, and royal culinary heritage.
          </p>

          <div className="pt-2 flex flex-col gap-1 text-xs text-white/70">
            <div className="flex items-center gap-1.5 text-[#ffdf93]">
              <ShieldCheck className="w-4 h-4 text-[#f2c027]" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Registered FSSAI Compliance
              </span>
            </div>
            <p className="text-[11px]">
              Assam Facility: <span className="text-white/90">FSSAI Lic. 10326002000025</span>
            </p>
            <p className="text-[11px]">
              Kerala Facility: <span className="text-white/90">FSSAI Lic. 11325009001048</span>
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="pt-3">
            <span className="block text-xs uppercase font-semibold text-[#ffdf93] tracking-wider mb-2">
              Join The Mazooq Guild
            </span>
            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#b8efc9] bg-[#104020] p-2.5 rounded">
                <CheckCircle className="w-4 h-4 text-[#ffdf93]" />
                <span>You are subscribed to harvest releases and private tastings.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#ffdf93]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#f2c027] text-[#181d17] px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#ffdf93] transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Product Families */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#ffdf93]">
            Product Families
          </h4>
          <ul className="space-y-2 text-xs text-white/80">
            <li>
              <button
                onClick={() => openShopCategory('tea')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                Mazooq Assam Tea (CTC & Gold)
              </button>
            </li>
            <li>
              <button
                onClick={() => openShopCategory('dates')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                Royal Medjool & Ajwa Dates
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('shop-all')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                Gourmet Cashews (W240) & Almonds
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('shop-all')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                Artisanal Kerala Banana Chips
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('shop-all')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                Pure Origin High-Curcumin Spices
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('shop-all')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                View Complete 20 SKU Pantry
              </button>
            </li>
          </ul>
        </div>

        {/* Enterprise & Brand */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#ffdf93]">
            Enterprise & Brand
          </h4>
          <ul className="space-y-2 text-xs text-white/80">
            <li>
              <button
                onClick={() => navigateTo('our-story')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                Our Royal Heritage & Story
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('retailer-portal')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                B2B Retailer & Wholesale Portal
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('retailer-portal')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                Margin & Profit Simulator
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('global-vision')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                Global Export Roadmap 2030
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('contact')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                Procurement & Trade Enquiries
              </button>
            </li>
          </ul>
        </div>

        {/* Direct Connect */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-[#ffdf93]">
            Connect Direct
          </h4>
          <div className="text-xs text-white/80 space-y-2.5">
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#f2c027] shrink-0" />
              <span>{COMPANY.phones[0]} / {COMPANY.phones[1]}</span>
            </p>
            <a
              href={whatsappLink('Hi Mazooq Foods, I have a question.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <WhatsAppIconTinted className="w-[18px] h-[18px]" />
              <span>WhatsApp: {COMPANY.whatsapp}</span>
            </a>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#f2c027] shrink-0" />
              <span>{COMPANY.email}</span>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#f2c027] shrink-0 mt-0.5" />
              <span>
                Assam: Amingaon, Guwahati, Kamrup - 781031 <br />
                Kerala: Nellaya, Ottappalam, Palakkad - 679335
              </span>
            </p>
          </div>

          <div className="pt-3">
            <button
              onClick={() => navigateTo('retailer-portal')}
              className="w-full py-2 px-3 bg-[#104020] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Partner With Mazooq</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#f2c027]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
        <p>© {new Date().getFullYear()} Mazooq Foods Private Limited. All rights reserved.</p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Policies">
          {([
            ['privacy-policy', 'Privacy Policy'],
            ['terms', 'Terms & Conditions'],
            ['refund-policy', 'Refund & Returns'],
            ['shipping-policy', 'Shipping & Delivery'],
          ] as [PageView, string][]).map(([page, label]) => (
            <a
              key={page}
              href={pathFor(page)}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(page);
              }}
              className="hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
