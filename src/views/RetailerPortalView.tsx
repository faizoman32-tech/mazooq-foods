import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { COMPANY } from '../data/company';
import { ShieldCheck, TrendingUp, Download, CheckCircle, Calculator, Building2, Truck, Phone, Mail } from 'lucide-react';

export const RetailerPortalView: React.FC = () => {
  const { showToast } = useCart();

  // Margin Calculator state
  const [selectedProduct, setSelectedProduct] = useState<'tea' | 'dates' | 'cashews' | 'chips' | 'spices'>('tea');
  const [tier, setTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier2');
  const [units, setUnits] = useState(250);

  // Registration Form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    gstin: '',
    city: '',
    businessType: 'Supermarket / Gourmet Store',
    interestProducts: 'Mazooq Assam Tea & Dates',
    notes: '',
  });

  const calculatorConfig = {
    tea: {
      name: 'Mazooq Premium Gold Tea (500g)',
      mrp: 379,
      wholesaleRates: { tier1: 275, tier2: 245, tier3: 215 },
    },
    dates: {
      name: 'Mazooq Medjool Dates (500g)',
      mrp: 649,
      wholesaleRates: { tier1: 470, tier2: 420, tier3: 375 },
    },
    cashews: {
      name: 'Mazooq Cashews W240 (250g)',
      mrp: 449,
      wholesaleRates: { tier1: 325, tier2: 290, tier3: 255 },
    },
    chips: {
      name: 'Mazooq Kerala Banana Chips (250g)',
      mrp: 219,
      wholesaleRates: { tier1: 155, tier2: 135, tier3: 118 },
    },
    spices: {
      name: 'Mazooq Lakadong Turmeric (250g)',
      mrp: 169,
      wholesaleRates: { tier1: 118, tier2: 102, tier3: 88 },
    },
  };

  const currentProductData = calculatorConfig[selectedProduct];
  const wholesalePrice = currentProductData.wholesaleRates[tier];
  const mrp = currentProductData.mrp;
  const unitMargin = mrp - wholesalePrice;
  const marginPercent = Math.round((unitMargin / mrp) * 100);
  const totalInvestment = wholesalePrice * units;
  const totalGrossRevenue = mrp * units;
  const projectedGrossProfit = totalGrossRevenue - totalInvestment;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    showToast('Wholesale Application Received', 'Our B2B Institutional Accounts Desk will contact you within 24 hours.');
  };

  const handleDownloadCatalog = () => {
    showToast('Catalogue Dispatched', 'Digital Master Price List & Spec Sheet sent to your device.');
  };

  return (
    <div className="w-full bg-[#f6fbf1] text-[#181d17] pt-12 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 text-center space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-widest">
          <Building2 className="w-4 h-4 text-[#f2c027]" />
          <span>B2B & Institutional Procurement</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#00290f] font-bold tracking-tight">
          Partner With <span className="italic font-normal text-[#765b00]">Mazooq Foods</span>
        </h1>
        <p className="text-base text-[#414941] max-w-2xl mx-auto leading-relaxed">
          We work closely with premium supermarket chains, organic grocery stores, boutique cafes, luxury hotels, and international distributors.
        </p>

        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleDownloadCatalog}
            className="px-6 py-3 bg-[#00290f] text-[#ffdf93] hover:bg-[#104020] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Master Catalogue (PDF)</span>
          </button>
          <a
            href="#inquiry-form"
            className="px-6 py-3 bg-[#f2c027] hover:bg-[#ffdf93] text-[#181d17] text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm inline-flex items-center gap-2"
          >
            <span>Register as a Retailer</span>
          </a>
        </div>
      </section>

      {/* Interactive Retail Margin Calculator */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#ebefe6]">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
              Live Commercial Simulator
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#00290f]">
              Retail Profit & Margin Estimator
            </h2>
            <p className="text-xs sm:text-sm text-[#414941]">
              Simulate your shop floor gross margin and order economics based on our standardized volume slabs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Calculator Controls */}
            <div className="lg:col-span-6 space-y-6">
              {/* Product selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#717970] mb-2">
                  Select Product Line:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'tea', label: 'Assam Gold Tea' },
                    { id: 'dates', label: 'Medjool Dates' },
                    { id: 'cashews', label: 'Cashews W240' },
                    { id: 'chips', label: 'Kerala Banana Chips' },
                    { id: 'spices', label: 'Lakadong Turmeric' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p.id as any)}
                      className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer ${
                        selectedProduct === p.id
                          ? 'bg-[#00290f] text-white border-[#00290f] shadow-sm'
                          : 'bg-[#f6fbf1] text-[#414941] border-[#dfe4da] hover:bg-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Tier Slabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#717970] mb-2">
                  Procurement Tier / Sizing:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => {
                      setTier('tier1');
                      setUnits(100);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tier === 'tier1'
                        ? 'bg-[#00290f] text-white border-[#00290f]'
                        : 'bg-[#f6fbf1] text-[#414941] border-[#dfe4da]'
                    }`}
                  >
                    <span className="font-bold block">Tier 1: Boutique</span>
                    <span className="text-[10px] opacity-80">50 - 150 units</span>
                  </button>
                  <button
                    onClick={() => {
                      setTier('tier2');
                      setUnits(300);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tier === 'tier2'
                        ? 'bg-[#00290f] text-white border-[#00290f]'
                        : 'bg-[#f6fbf1] text-[#414941] border-[#dfe4da]'
                    }`}
                  >
                    <span className="font-bold block">Tier 2: Supermarket</span>
                    <span className="text-[10px] opacity-80">150 - 500 units</span>
                  </button>
                  <button
                    onClick={() => {
                      setTier('tier3');
                      setUnits(1000);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tier === 'tier3'
                        ? 'bg-[#00290f] text-white border-[#00290f]'
                        : 'bg-[#f6fbf1] text-[#414941] border-[#dfe4da]'
                    }`}
                  >
                    <span className="font-bold block">Tier 3: Export</span>
                    <span className="text-[10px] opacity-80">500+ units</span>
                  </button>
                </div>
              </div>

              {/* Units Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#181d17] mb-2">
                  <span>Batch Volume:</span>
                  <span className="text-[#765b00] font-bold text-sm">{units} Packs</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="25"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full accent-[#765b00] cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="lg:col-span-6 bg-[#00290f] text-white p-8 rounded-2xl shadow-xl space-y-5 border border-[#ffdf93]/20">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[11px] uppercase font-bold text-[#ffdf93] tracking-widest block">
                  Commercial Projection Summary
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1">
                  {currentProductData.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-white/60 block">Consumer MRP</span>
                  <span className="text-lg font-bold text-white">₹{mrp}</span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-white/60 block">Wholesale Rate / Unit</span>
                  <span className="text-lg font-bold text-[#ffdf93]">₹{wholesalePrice}</span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-white/60 block">Retail Gross Margin</span>
                  <span className="text-2xl font-serif font-bold text-emerald-400">
                    {marginPercent}%
                  </span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-white/60 block">Net Profit per Pack</span>
                  <span className="text-2xl font-serif font-bold text-[#f2c027]">
                    ₹{unitMargin}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                <div>
                  <span className="text-white/60 block">Total Projected Profit:</span>
                  <span className="text-2xl font-serif font-bold text-[#ffdf93]">
                    ₹{projectedGrossProfit.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-white/60 block">Capital Outlay:</span>
                  <span className="text-sm font-semibold text-white/90">
                    ₹{totalInvestment.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Retailer Registration Form */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12" id="inquiry-form">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#ebefe6]">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
              Direct Application
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#00290f]">
              Register Your Business
            </h2>
            <p className="text-xs text-[#414941]">
              Submit your retail or export inquiry to receive onboarding terms, marketing POS stands, and tasting kits.
            </p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#00290f]">Application Registered!</h3>
              <p className="text-xs text-[#414941] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.contactName || 'Partner'}</strong>. We have logged your enquiry for <strong>{formData.businessName || 'your enterprise'}</strong>. Our team will contact you within 24 hours.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-[#00290f] text-white text-xs font-semibold uppercase tracking-wider rounded-lg"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#414941] font-medium mb-1">Company / Store Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malabar Organic Supermarket"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div>
                  <label className="block text-[#414941] font-medium mb-1">Authorized Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div>
                  <label className="block text-[#414941] font-medium mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="procurement@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div>
                  <label className="block text-[#414941] font-medium mb-1">Contact Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98460 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div>
                  <label className="block text-[#414941] font-medium mb-1">GSTIN / Tax ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="29ABCDE1234F1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div>
                  <label className="block text-[#414941] font-medium mb-1">City & State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bangalore, Karnataka"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#414941] font-medium mb-1">Products of Interest</label>
                <input
                  type="text"
                  placeholder="e.g. Assam CTC Tea 1kg, Jumbo Medjool, Banana Chips"
                  value={formData.interestProducts}
                  onChange={(e) => setFormData({ ...formData, interestProducts: e.target.value })}
                  className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                />
              </div>

              <div>
                <label className="block text-[#414941] font-medium mb-1">Additional Requirements / Volume</label>
                <textarea
                  rows={3}
                  placeholder="State your estimated monthly requirements or specific distribution region."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#f2c027] hover:bg-[#ffdf93] text-[#181d17] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Submit Retailer Application
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#717970] pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected by Mazooq Foods Private Limited B2B Privacy Agreement</span>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
