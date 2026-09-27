import React, { useState } from 'react';
import { COMPANY } from '../data/company';
import { useCart } from '../context/CartContext';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Send, CheckCircle2, ChevronDown } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { showToast } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Wholesale & Retail Partnership',
    message: '',
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Where are Mazooq tea leaves harvested and packed?',
      a: 'Mazooq Tea is harvested directly from certified estate gardens in the Brahmaputra Valley of Assam. The raw leaves are processed, blended, and hermetically foil-sealed at our Amingaon, Guwahati facility in Kamrup District, Assam under FSSAI Lic. 10326002000025.',
    },
    {
      q: 'How does Mazooq verify the purity of its dates and snacks?',
      a: 'Our Medjool and Ajwa dates are screened for uniform pulp density, skin adherence, and unadulterated moisture levels with zero added sugars. Our banana chips are fried exclusively in 100% pure cold-pressed coconut oil without artificial palm oil blending.',
    },
    {
      q: 'What are the minimum order quantities (MOQ) for retailers?',
      a: 'For independent gourmet and organic shops, our starter wholesale box is only 50 units across mixed SKUs. For supermarket distributors and institutional partners, pallet pricing and CIF container shipments are available.',
    },
    {
      q: 'Does Mazooq export outside India?',
      a: 'Yes. Mazooq Foods maintains active export corridors to the UAE / GCC, United Kingdom, European Union, and North America with standardized international compliance labels and phytosanitary certificates.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Message Sent', 'Thank you. Our team will contact you shortly.');
  };

  return (
    <div className="w-full bg-[#f6fbf1] text-[#181d17] pt-12 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 text-center max-w-4xl space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-widest">
          <Phone className="w-4 h-4 text-[#f2c027]" />
          <span>Get in Touch</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#00290f] font-bold tracking-tight">
          Connect With <span className="italic font-normal text-[#765b00]">Mazooq Foods</span>
        </h1>
        <p className="text-base text-[#414941] max-w-2xl mx-auto leading-relaxed">
          Whether you are an appreciative tea lover, a store manager wanting to stock Mazooq, or an export distributor, our offices in Kerala and Assam are at your service.
        </p>
      </section>

      {/* Contact Cards & Form Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Left */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Connect Tile */}
            <div className="bg-[#00290f] text-white p-8 rounded-3xl shadow-xl space-y-6 border border-[#ffdf93]/20">
              <span className="text-xs uppercase font-bold text-[#ffdf93] tracking-widest block">
                Direct Contact Lines
              </span>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#ffdf93] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white/60 block">Customer Care & Orders:</span>
                    <a href="tel:+917002170175" className="font-bold text-white hover:text-[#ffdf93] transition-colors block text-sm">
                      {COMPANY.phones[0]}
                    </a>
                    <a href="tel:+919101991467" className="font-bold text-white hover:text-[#ffdf93] transition-colors block text-sm">
                      {COMPANY.phones[1]}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#ffdf93] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white/60 block">Official Inquiries:</span>
                    <a href="mailto:info@mazooq.com" className="font-bold text-white hover:text-[#ffdf93] transition-colors text-sm">
                      {COMPANY.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#ffdf93] shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-white/60 block">Desk Hours:</span>
                    <span className="text-white font-medium">
                      Monday to Saturday • 9:00 AM – 7:00 PM IST
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Northern Facility */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#ebefe6] space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#765b00] tracking-widest block">
                Assam Facility
              </span>
              <h4 className="font-serif text-base font-bold text-[#00290f]">
                {COMPANY.blendingHub.title}
              </h4>
              <p className="text-[#414941]">{COMPANY.blendingHub.address}</p>
              <span className="text-emerald-700 font-semibold block pt-1">
                FSSAI Lic. {COMPANY.blendingHub.fssai}
              </span>
            </div>

            {/* Southern Corporate */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#ebefe6] space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#765b00] tracking-widest block">
                Kerala Corporate
              </span>
              <h4 className="font-serif text-base font-bold text-[#00290f]">
                {COMPANY.corporateOffice.title}
              </h4>
              <p className="text-[#414941]">{COMPANY.corporateOffice.address}</p>
              <span className="text-emerald-700 font-semibold block pt-1">
                FSSAI Lic. {COMPANY.corporateOffice.fssai}
              </span>
            </div>
          </div>

          {/* Form Right */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-[#ebefe6]">
            <div className="space-y-2 mb-6">
              <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
                Write to Us
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#00290f]">
                Send an Official Dispatch
              </h3>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-2xl font-bold text-[#00290f]">Message Received</h4>
                <p className="text-xs text-[#414941] max-w-md mx-auto">
                  Thank you for contacting Mazooq Foods. A representative from our respective regional desk will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-[#00290f] text-white text-xs font-semibold uppercase tracking-wider rounded-lg"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#414941] font-medium mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#414941] font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#414941] font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#414941] font-medium mb-1">Topic / Intent</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                    >
                      <option>Wholesale & Retail Partnership</option>
                      <option>Global Export / Container Inquiry</option>
                      <option>Tea Garden Sourcing / Collective</option>
                      <option>Consumer Order & Delivery Inquiry</option>
                      <option>General Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#414941] font-medium mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your requirements or question..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#f6fbf1] border border-[#dfe4da] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#765b00]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#00290f] hover:bg-[#104020] text-[#ffdf93] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
            Knowledge Center
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#00290f]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#ebefe6] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-serif text-base font-bold text-[#00290f] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#f6fbf1]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#765b00] transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#414941] leading-relaxed border-t border-[#ebefe6]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
