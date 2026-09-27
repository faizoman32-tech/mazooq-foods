import React, { useState } from 'react';
import { useCart, PageView } from '../context/CartContext';
import { Phone, Mail, MapPin, CheckCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { COMPANY } from '../data/company';

export const Footer: React.FC = () => {
  const { setActivePage, showToast } = useCart();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    showToast('Subscribed to Mazooq Connoisseurs', 'Thank you for joining our private tasting bulletin.');
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
            <div className="w-11 h-11 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#ffdf93] to-[#f2c027] shadow-md">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1WQmVKzgQ8J59JKL6_h1uwe2m1Kmf9Rtxx0GpNbVFCZW6JTgdjA4aaM62xgCw5COpfk8okG5NNFXs8sbNxhCU6w56L5QxLoVG3TjqtzWj7QRB1ZKRgqMXhqUo6heuieYskJu3YzIok25giOlYJuCECACjIlsVV0Z3gD27TZBwmuxhWN8WpAeOd5mh7wFyKCeX6ceH0ia5ouDzTdcHJf_NulzIaaiGpv_to0Ms87OTZphHjBpRvu5J2X3ehf9pvu2Vapelp79PU30Zs"
                alt="Mazooq Foods Emblem"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
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
                onClick={() => navigateTo('mazooq-tea')}
                className="hover:text-[#ffdf93] transition-colors cursor-pointer text-left"
              >
                Mazooq Assam Tea (CTC & Gold)
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateTo('mazooq-dates')}
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
        <p>© 2026 Mazooq Foods Private Limited. All royal rights reserved.</p>
        <div className="flex gap-6">
          <button
            onClick={() => showToast('Compliance Notice', 'Mazooq products adhere to strict FSSAI and international food packaging norms.')}
            className="hover:text-white transition-colors"
          >
            FSSAI Standards
          </button>
          <button
            onClick={() => showToast('Terms of Supply', 'Standard pan-India and CIF international delivery terms apply.')}
            className="hover:text-white transition-colors"
          >
            Terms of Supply
          </button>
          <button
            onClick={() => navigateTo('global-vision')}
            className="hover:text-white transition-colors"
          >
            Export Compliance
          </button>
        </div>
      </div>
    </footer>
  );
};
