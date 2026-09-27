import React, { useState } from 'react';
import { COMPANY } from '../data/company';
import { useCart } from '../context/CartContext';
import { Globe2, Ship, ShieldCheck, Award, ArrowRight, Anchor, CheckCircle2, Phone, Mail } from 'lucide-react';

export const GlobalVisionView: React.FC = () => {
  const { showToast, setActivePage } = useCart();
  const [selectedPortIndex, setSelectedPortIndex] = useState(0);

  const selectedPort = COMPANY.globalPorts[selectedPortIndex];

  return (
    <div className="w-full bg-[#f6fbf1] text-[#181d17] pt-12 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 text-center max-w-4xl space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-widest">
          <Globe2 className="w-4 h-4 text-[#f2c027]" />
          <span>Global Vision 2026-2030</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#00290f] font-bold tracking-tight">
          Made in India. <br />
          <span className="italic font-normal text-[#765b00]">Made for the World.</span>
        </h1>
        <p className="text-base sm:text-lg text-[#414941] leading-relaxed max-w-2xl mx-auto">
          From Indian producers to customers and retailers beyond our borders. Our long-term mission is to elevate Indian culinary products to the premier tiers of international food commerce.
        </p>
      </section>

      {/* Interactive Global Sea Route Explorer */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
        <div className="bg-[#00290f] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-[#ffdf93]/20">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs uppercase font-semibold text-[#ffdf93] tracking-widest">
              International Sea Freight Network
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">
              Container Trade Lanes
            </h2>
            <p className="text-xs sm:text-sm text-white/80">
              Select destination trade corridor to view projected transit times and container specifications.
            </p>
          </div>

          {/* Port Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pb-8 border-b border-white/10">
            {COMPANY.globalPorts.map((port, idx) => (
              <button
                key={port.port}
                onClick={() => setSelectedPortIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedPortIndex === idx
                    ? 'bg-[#f2c027] text-[#181d17] shadow-lg'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {port.country}
              </button>
            ))}
          </div>

          {/* Selected Route Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-8">
            <div className="md:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-wider">
                <Anchor className="w-3.5 h-3.5" />
                <span>{selectedPort.region}</span>
              </div>
              <h3 className="font-serif text-3xl font-bold text-white">
                {selectedPort.port}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Direct consolidated container freight dispatch from Indian gateway ports (Kolkata & Cochin) with temperature and moisture data loggers inside every shipment.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-white/60 block">Status:</span>
                  <span className="font-bold text-[#ffdf93]">{selectedPort.status}</span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl">
                  <span className="text-white/60 block">Average Transit Time:</span>
                  <span className="font-bold text-[#ffdf93]">{selectedPort.leadTime}</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4 text-xs text-white/90">
              <h4 className="font-serif text-base font-bold text-[#ffdf93]">
                Export Compliance Credentials:
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#f2c027] shrink-0" />
                  <span>Phytosanitary Certification cleared through APEDA and Tea Board of India.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#f2c027] shrink-0" />
                  <span>Multi-lingual regulatory labeling (English, Arabic, French) formatted to standard.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#f2c027] shrink-0" />
                  <span>FCL (Full Container Load) and LCL consolidated pallets accommodated.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#f2c027] shrink-0" />
                  <span>CIF and FOB quotes provided within 48 business hours.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    showToast('Inquiry Forwarded', 'Our Overseas Export Desk will prepare a CIF quotation.');
                  }}
                  className="w-full py-3 bg-[#f2c027] text-[#181d17] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#ffdf93] transition-colors"
                >
                  Request CIF Quotation for {selectedPort.port}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packaging Engineering Standards */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
            Barrier Engineering
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#00290f]">
            Freshness Preserved Across Oceans
          </h2>
          <p className="text-sm text-[#414941]">
            How Mazooq guarantees garden-fresh crunch and fragrance upon arrival abroad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#ebefe6] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#f1f5eb] flex items-center justify-center text-[#765b00]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#00290f]">Tri-Layer Metallic Barrier</h4>
            <p className="text-xs text-[#414941] leading-relaxed">
              Our pouches feature a multi-layer metallized barrier foil that blocks 100% of UV light, airborne moisture, and external odors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#ebefe6] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#f1f5eb] flex items-center justify-center text-[#765b00]">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#00290f]">Nitrogen Flush Packing</h4>
            <p className="text-xs text-[#414941] leading-relaxed">
              Dry fruits and snacks are flushed with food-grade nitrogen prior to sealing, preventing lipid oxidation and keeping cashew crunch peak.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#ebefe6] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#f1f5eb] flex items-center justify-center text-[#765b00]">
              <Ship className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#00290f]">Export Palletization</h4>
            <p className="text-xs text-[#414941] leading-relaxed">
              Standardized Euro and US pallets wrapped in heavy shrink-gauge plastic to withstand long maritime cross-hemisphere passages.
            </p>
          </div>
        </div>
      </section>

      {/* Trade Contact */}
      <section className="max-w-4xl mx-auto px-6 text-center space-y-5">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#00290f]">
          Looking to Import Mazooq Foods into Your Country?
        </h3>
        <p className="text-sm text-[#414941] max-w-xl mx-auto">
          Connect directly with our international trade desk for sample container assortments.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setActivePage('contact')}
            className="px-8 py-3.5 bg-[#00290f] text-[#ffdf93] hover:bg-[#104020] text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            Contact Global Trade Desk
          </button>
        </div>
      </section>
    </div>
  );
};
