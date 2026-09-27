import React from 'react';
import { useCart } from '../context/CartContext';
import { COMPANY } from '../data/company';
import { ShieldCheck, HeartHandshake, Sprout, Sparkles, MapPin, Award, ArrowRight } from 'lucide-react';

export const OurStoryView: React.FC = () => {
  const { setActivePage } = useCart();

  return (
    <div className="w-full bg-[#f6fbf1] text-[#181d17] pt-12 pb-24">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 text-center max-w-4xl space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-[#f2c027]" />
          <span>Our Heritage & Vision</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#00290f] font-bold tracking-tight">
          Pure Taste. <span className="italic font-normal text-[#765b00]">Built With Trust.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#414941] leading-relaxed max-w-2xl mx-auto">
          Founded under the stewardship of Naseef Hudawi, Mazooq Foods was born out of a profound reverence for India's agricultural mastery and a determination to share authentic regional produce with the world.
        </p>
      </section>

      {/* Main Story Split */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-2xl bg-[#ebefe6]">
            <img
              src="/src/assets/images/hero_assam_tea_estate_1790503374240.jpg"
              alt="Assam Tea Plantation Valley at Sunrise"
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#00290f]/90 text-white p-4 rounded-xl backdrop-blur-md border border-white/10 text-xs">
              <span className="text-[#ffdf93] font-bold uppercase tracking-wider block text-[10px]">
                Brahmaputra Valley, Assam
              </span>
              <p className="text-white/90 mt-0.5">
                Our partner tea gardens thrive along the alluvial banks of the mighty Brahmaputra river.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
              Chapter 1 • Origin & Philosophy
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#00290f]">
              Bridging Heritage Estates With Global Connoisseurs
            </h2>
            <p className="text-sm sm:text-base text-[#414941] leading-relaxed">
              For generations, India’s finest food produce—from the prized clonal tea bushes of Assam to the volcanic spice hills of Kerala—remained fragmented across local markets or blended into anonymous bulk commodities.
            </p>
            <p className="text-sm sm:text-base text-[#414941] leading-relaxed">
              Mazooq Foods was incorporated with a singular mandate: to establish single-origin identity, preserve natural essential oils and aromas through modern barrier packaging, and guarantee honest fair-trade rewards to our cultivating communities.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#dfe4da]">
              <div>
                <span className="font-serif text-2xl text-[#765b00] font-bold block">100%</span>
                <span className="text-xs text-[#414941]">Pure unblended origin harvest</span>
              </div>
              <div>
                <span className="font-serif text-2xl text-[#765b00] font-bold block">Zero</span>
                <span className="text-xs text-[#414941]">Synthetic dyes, waxes or fillers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom / Boutique Experience */}
      <section className="bg-[#00290f] text-white py-20 mb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-semibold text-[#ffdf93] tracking-widest">
              Chapter 2 • Sensory Excellence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold leading-tight">
              The Mazooq Tasting Boutique
            </h2>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">
              Every tea leaf batch is cupped and scored by professional tasters in Guwahati before vacuum foil sealing. We evaluate liquor color, briskness, infused leaf fragrance, and mouthfeel density.
            </p>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed">
              From our southern packaging center in Palakkad, Kerala, our dried fruits, cashew nuts, and plantain crisps are prepared in controlled environments that safeguard natural crunch and freshness.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-white/90">
                <ShieldCheck className="w-5 h-5 text-[#f2c027] shrink-0" />
                <span>Multi-tier laboratory screening for moisture, aroma, and microbiological safety.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/90">
                <Award className="w-5 h-5 text-[#f2c027] shrink-0" />
                <span>Dual FSSAI registration in Assam (Blending) and Kerala (Distribution).</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="/src/assets/images/boutique_mazooq_store_1790503386508.jpg"
                alt="Mazooq Artisan Boutique and Tasting Room"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Two Centers of Mazooq */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
            Two Pillars • One Standard
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#00290f]">
            Assam & Kerala Operational Hubs
          </h2>
          <p className="text-sm text-[#414941]">
            Operating seamlessly across northern tea valleys and southern maritime trading gateways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebefe6] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#f1f5eb] flex items-center justify-center text-[#765b00]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#765b00]">
                Northern Production Work
              </span>
              <h3 className="font-serif text-xl font-bold text-[#00290f] mt-1">
                {COMPANY.blendingHub.title}
              </h3>
              <p className="text-xs text-[#717970] mt-1 font-medium">{COMPANY.blendingHub.address}</p>
            </div>
            <p className="text-xs text-[#414941] leading-relaxed">
              {COMPANY.blendingHub.focus}
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-800">
              FSSAI Lic. {COMPANY.blendingHub.fssai}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebefe6] space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#f1f5eb] flex items-center justify-center text-[#765b00]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#765b00]">
                Southern Corporate Headquarters
              </span>
              <h3 className="font-serif text-xl font-bold text-[#00290f] mt-1">
                {COMPANY.corporateOffice.title}
              </h3>
              <p className="text-xs text-[#717970] mt-1 font-medium">{COMPANY.corporateOffice.address}</p>
            </div>
            <p className="text-xs text-[#414941] leading-relaxed">
              {COMPANY.corporateOffice.focus}
            </p>
            <div className="pt-2 text-xs font-semibold text-emerald-800">
              FSSAI Lic. {COMPANY.corporateOffice.fssai}
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-5">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#00290f]">
          Experience The Mazooq Difference
        </h3>
        <p className="text-sm text-[#414941] max-w-xl mx-auto">
          Taste what happens when agricultural passion meets uncompromising modern quality standards.
        </p>
        <button
          onClick={() => setActivePage('shop-all')}
          className="px-8 py-3.5 bg-[#00290f] text-[#ffdf93] hover:bg-[#104020] text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <span>Explore Entire Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
