import React, { useState } from 'react';
import { useCart, PageView } from '../context/CartContext';
import { PRODUCTS, Product } from '../data/products';
import { COMPANY } from '../data/company';
import {
  Award,
  Sparkles,
  ArrowDown,
  ArrowRight,
  Check,
  Star,
  ShoppingBag,
  Eye,
  ShieldCheck,
  Globe2,
  Phone,
  Mail,
  HeartHandshake,
  Sprout,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { addToCart, setQuickViewProduct, setActivePage, showToast } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});

  const filteredProducts = PRODUCTS.filter((item) =>
    selectedCategory === 'all' ? true : item.category === selectedCategory
  );

  const handleSelectVariant = (productId: string, variantIndex: number) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }));
  };

  const handleQuickAdd = (product: Product) => {
    const variantIndex = selectedVariants[product.id] || 0;
    const variant = product.variants[variantIndex];
    addToCart(product, variant.size, variant.price);
  };

  const navigateTo = (page: PageView) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: HERO */}
      <section className="relative w-full bg-[url('/images/Assam_Estates.png')] bg-cover bg-center overflow-hidden text-[#f6fbf1] pt-12 pb-24 -mt-20 pt-32">
        {/* Deep Forest Green transparent overlay */}
        <div className="absolute inset-0 bg-[#19281E]/60 pointer-events-none" />
        {/* Ambient Gilded Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path className="text-[#ffdf93]" d="M0,0 L100,100 M100,0 L0,100" stroke="currentColor" strokeWidth="0.3" />
            <circle className="text-[#ffdf93]" cx="50" cy="50" fill="none" r="30" stroke="currentColor" strokeWidth="0.3" />
            <circle className="text-[#ffdf93]" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="0.15" />
          </svg>
        </div>
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#104020] rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#765b00]/20 rounded-full blur-3xl opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#104020] text-[#ffdf93] rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-[#f2c027]" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                100% Assam Black Tea • Pure Taste • Built With Trust
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-bold leading-tight tracking-tight">
              From India’s Flavours <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#ffdf93]">to the World.</span>
            </h1>

            <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
              Discover carefully selected Indian foods brought together under the Mazooq name — from 100% Assam tea and premium dates to nuts, snacks, and royal spices. Building a global food brand from India.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#catalogue"
                className="px-8 py-3.5 bg-[#f2c027] text-[#181d17] font-semibold rounded uppercase tracking-wider shadow-md hover:bg-[#ffdf93] transition-all flex items-center gap-2 text-xs font-bold"
              >
                <span>Explore Our Products</span>
                <ArrowDown className="w-4 h-4" />
              </a>
              <button
                onClick={() => navigateTo('retailer-portal')}
                className="px-8 py-3.5 bg-white/10 text-[#ffdf93] font-semibold rounded uppercase tracking-wider hover:bg-white/20 transition-all flex items-center gap-2 text-xs cursor-pointer"
              >
                <span>Become a Retailer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Credentials Strip */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#ffdf93]/20 max-w-lg">
              <div>
                <span className="block font-serif text-2xl text-[#ffdf93] font-bold">100%</span>
                <span className="text-xs text-white/70">Authentic Origin Sourced</span>
              </div>
              <div>
                <span className="block font-serif text-2xl text-[#ffdf93] font-bold">Direct</span>
                <span className="text-xs text-white/70">Tea Gardens of Assam</span>
              </div>
              <div>
                <span className="block font-serif text-2xl text-[#ffdf93] font-bold">Pan-India</span>
                <span className="text-xs text-white/70">& Global Logistics Hub</span>
              </div>
            </div>
          </div>

          {/* Right Visual Pack Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-[#f2c027]/15 rounded-2xl filter blur-2xl transform scale-95" />
              <div className="relative bg-white/5 p-4 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/10">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAybDLrLNN8c55HFScWTh6V4bGB1COcUKEYXyI903Xxgwj0fg07uwpNVwm6YliSnBbOT7rVuqp-WIIudaf-JTy5rVvu7Zopko0NZm36F_yO-3VLad-XKZQ0I5mjsp0ZOZwfe5kmtqFjHxeJ4fNK2Vp-GBoW-41Ukc3sGuX6Ve1rfzz29M75iC0kj4PysKglL63s5Ck4KMHd60ok_7hRy41595YT9T1M200NksrIu6RySEab0EtpSbdrngG9-t3uX8isOAE"
                  alt="Mazooq Premium Gold Assam Black Tea Packaging"
                  className="w-full h-auto rounded-lg shadow-lg object-contain transform hover:scale-[1.02] transition-transform duration-500"
                />
                {/* Quality Badge Overlay */}
                <div className="absolute -bottom-4 -left-4 bg-[#002815] text-[#ffdf93] p-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#ffdf93]/20">
                  <Award className="w-8 h-8 text-[#f2c027]" />
                  <div>
                    <p className="uppercase tracking-wider text-[10px] text-white/70 font-semibold">
                      Heritage Batch
                    </p>
                    <p className="text-xs uppercase font-bold leading-tight text-white">
                      Export Quality Guaranteed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: BRAND PILLARS */}
      <section className="py-24 bg-[#f6fbf1] text-[#181d17]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
              The Mazooq Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#00290f] font-bold tracking-tight">
              One Brand. Many Flavours.
            </h2>
            <p className="text-base text-[#414941] leading-relaxed">
              Mazooq Foods connects authentic Indian production groups with modern retail and future international markets under one unified standard of trust, taste, and packaging excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Pillar 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative group border border-[#ebefe6]">
              <div className="w-14 h-14 rounded-full bg-[#f1f5eb] flex items-center justify-center text-[#765b00] mb-6 group-hover:bg-[#00290f] group-hover:text-[#ffdf93] transition-colors">
                <Sprout className="w-7 h-7" />
              </div>
              <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
                Origin Integrity
              </span>
              <h3 className="font-serif text-xl text-[#00290f] font-bold mt-2 mb-3">
                Authenticity
              </h3>
              <p className="text-sm text-[#414941] leading-relaxed">
                Direct sourcing from heritage growing regions including the lush tea gardens of Assam, untouched date groves, and coastal coconut-rich plantations.
              </p>
              <div className="mt-6 flex items-center gap-1 text-xs uppercase font-semibold text-[#765b00] tracking-wider">
                <span>Direct garden harvest</span>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative group border border-[#ebefe6]">
              <div className="w-14 h-14 rounded-full bg-[#f1f5eb] flex items-center justify-center text-[#765b00] mb-6 group-hover:bg-[#00290f] group-hover:text-[#ffdf93] transition-colors">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
                Rigorous Craft
              </span>
              <h3 className="font-serif text-xl text-[#00290f] font-bold mt-2 mb-3">
                Quality
              </h3>
              <p className="text-sm text-[#414941] leading-relaxed">
                Strict grading, traditional aroma preservation, vacuum-tight aromatic barriers, and uncompromised food compliance standards verified batch by batch.
              </p>
              <div className="mt-6 flex items-center gap-1 text-xs uppercase font-semibold text-[#765b00] tracking-wider">
                <span>Laboratory approved</span>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative group border border-[#ebefe6]">
              <div className="w-14 h-14 rounded-full bg-[#f1f5eb] flex items-center justify-center text-[#765b00] mb-6 group-hover:bg-[#00290f] group-hover:text-[#ffdf93] transition-colors">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
                Shared Prosperity
              </span>
              <h3 className="font-serif text-xl text-[#00290f] font-bold mt-2 mb-3">
                Partnership
              </h3>
              <p className="text-sm text-[#414941] leading-relaxed">
                Empowering local growers, smallholders, modern supermarkets, and export distributors together through transparent fair pricing and long-term contracts.
              </p>
              <div className="mt-6 flex items-center gap-1 text-xs uppercase font-semibold text-[#765b00] tracking-wider">
                <span>Sustainable ecosystem</span>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PRODUCT FAMILY SHOWCASE */}
      <section className="py-20 bg-[#f1f5eb] text-[#181d17]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
                Culinary Collections
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#00290f] font-bold tracking-tight mt-1">
                Discover the Mazooq Family
              </h2>
            </div>
            <p className="text-sm text-[#414941] max-w-md">
              Explore our range of premium staples, crafted with devotion to purity and packed fresh for daily enjoyment and gifting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Family 1: Tea */}
            <div
              onClick={() => navigateTo('mazooq-tea')}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer border border-[#ebefe6]"
            >
              <div className="h-64 overflow-hidden bg-[#104020] relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAj0UGrrCpUB9BiFOlEvVi7EnevX9f92Sn6-uVj9ILb5P9gsawLfifKExinItrfZnu7BoDj-DoXmRL-dIGbOGaPmoE80MTgDAvQHjTdZOrVUqn5fb5dA3d5pPkeLHMYNOOD51axay2xHZkxtrhrhNTJ1p13dgPxn3OvbDZ8J-Ertge2LthOWF9YK9EaEerZssFV-V4jUEq1iaAErjQn5JynBEUNEBM-BeKeojRiMhEkjkTBYqhCGQ571_K7N97RM2wESU4"
                  alt="Mazooq Assam Tea"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#00290f] text-[#ffdf93] text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Flagship Range
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#00290f] group-hover:text-[#765b00] transition-colors">
                    Mazooq Tea
                  </h3>
                  <p className="text-sm text-[#414941] mt-2">
                    Finest 100% Assam black tea & heritage CTC blends with bold liquor and rich aroma.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#ebefe6] flex items-center justify-between text-[#765b00] text-xs uppercase font-semibold tracking-wider">
                  <span>View 4 Teas</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Family 2: Dates */}
            <div
              onClick={() => navigateTo('mazooq-dates')}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer border border-[#ebefe6]"
            >
              <div className="h-64 overflow-hidden bg-[#ebefe6] relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpVBWCsAdw7Ijvu4BNHSjggsOu4iVxR8Tx3H6rw3au2bF2SpvALnz5F08f-DJSaeJHkMCW2tWIqe4nmolVqN_tQszOKpu6DbGBxrTASqJdzUxY4YBYqtw_Nm7hw7GxYM95Nxc1aXkHRb3KtvlG_KfcLtXftH8fLtHBqC_suwXOf4AQtlFRJCyx6z8IpAVqxnf1Vk5dGGnZL6STr8JrHwD7NcTc1ewnN-d1_voKHWzNOo7dR2SSH4dL4Q"
                  alt="Mazooq Dates Assortment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#f2c027] text-[#181d17] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Royal Selection
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#00290f] group-hover:text-[#765b00] transition-colors">
                    Mazooq Dates
                  </h3>
                  <p className="text-sm text-[#414941] mt-2">
                    Plump Medjool, auspicious Ajwa, and artisanal stuffed date confections.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#ebefe6] flex items-center justify-between text-[#765b00] text-xs uppercase font-semibold tracking-wider">
                  <span>View 4 Varieties</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Family 3: Nuts */}
            <div
              onClick={() => {
                setSelectedCategory('nuts');
                document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer border border-[#ebefe6]"
            >
              <div className="h-64 overflow-hidden bg-[#ebefe6] relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWg9usFzJ__iR09vd6gQK3XVp2kOSzExZaMvLa_mroWQ8nn_XiAdOrlCVwbyqsi-T8YSyCCoaVWEod40nDTg7wFf9JoVUBD13fWX72K-mVs0iIAI-zBRsZJMdIdMbgsfLDAi2pP-1NLMthX8LaltQAZZ04pXOm76TqG45TP9zBU6DVp-UO1eIaiiYiC1CusLjsHtX_oDRvnIR8i40mnUPSXzKGCV88pq6p-zAouu5U4hJKMYz-eFhlbw"
                  alt="Mazooq Roasted Nuts and Cashews"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#084026] text-[#b8efc9] text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Nutrient Dense
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#00290f] group-hover:text-[#765b00] transition-colors">
                    Mazooq Nuts
                  </h3>
                  <p className="text-sm text-[#414941] mt-2">
                    Whole slow-roasted jumbo cashews, sweet California almonds & golden raisins.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#ebefe6] flex items-center justify-between text-[#765b00] text-xs uppercase font-semibold tracking-wider">
                  <span>View 4 Selections</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Family 4: Snacks */}
            <div
              onClick={() => {
                setSelectedCategory('snacks');
                document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer border border-[#ebefe6]"
            >
              <div className="h-64 overflow-hidden bg-[#ebefe6] relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBClIRZ-lAygkIzfhsI71RdtlXJrqJV9YO40ocUY-QzyGHBITbEi_QmgpQiKAd7TWUtGPxtMGcTmNrSUEWzGTH55hAgQn1JGn5-Ardir7RvzQ8OHHEKY4GCfzNBdW-q1t8vEHMojxyPL7kMW68irU8Cwcze0aRY591qs173SS1r7DSmEhgFuC_fVbqQM_am5Kj909ws4ZMcVGcbpMLbpeDsRjOXwNeWVGqIYlcV_IsU77ldWdIycYf6TQ"
                  alt="Mazooq Kerala Banana Chips"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#00290f] text-[#ffdf93] text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Artisanal Crisp
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#00290f] group-hover:text-[#765b00] transition-colors">
                    Mazooq Snacks
                  </h3>
                  <p className="text-sm text-[#414941] mt-2">
                    Golden Nendran Kerala banana chips in pure coconut oil and tapioca crisps.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#ebefe6] flex items-center justify-between text-[#765b00] text-xs uppercase font-semibold tracking-wider">
                  <span>View 4 Snacks</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Family 5: Spices */}
            <div
              onClick={() => {
                setSelectedCategory('spices');
                document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer border border-[#ebefe6]"
            >
              <div className="h-64 overflow-hidden bg-[#ebefe6] relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHQwjRRI0HM46SKi-WfGnWpnkAq0zxidg3MDLX0Cg6dAOAQIWqmYh11V2lt8o1hNoIqTjy7Ba3vxf8A3MMAQBfhxytlye3qsOsvyxbMHjMtkbxGX3_ybfY6mav1n8rC4_q1zRrgTVdiEVZ_Qr3DO-EWruPRkHJxE4QV0LZQJOjdDbFtkjlwT9iISJ-geapyHklo4PLKlCyRIj_asPsSU8gaBDKHyChazlRdCTuvlNz3h2qqXHKuWw-nw"
                  alt="Mazooq Pure Origin Spices"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#765b00] text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Pure Harvest
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#00290f] group-hover:text-[#765b00] transition-colors">
                    Mazooq Spices
                  </h3>
                  <p className="text-sm text-[#414941] mt-2">
                    High-curcumin Lakadong turmeric, fragrant Kashmiri chilli, and royal garam masala.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#ebefe6] flex items-center justify-between text-[#765b00] text-xs uppercase font-semibold tracking-wider">
                  <span>View 4 Spices</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Family 6: Future Roadmap */}
            <div className="bg-[#00290f] text-white p-8 rounded-2xl shadow-md flex flex-col justify-between relative overflow-hidden border border-[#ffdf93]/20">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#f2c027]/15 rounded-full blur-2xl" />
              <div>
                <span className="text-xs uppercase font-semibold text-[#ffdf93] tracking-widest">
                  Roadmap 2026-2027
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-2">
                  More from Mazooq
                </h3>
                <p className="text-sm text-white/80 mt-3 leading-relaxed">
                  We are actively formulating cold-pressed virgin coconut and sesame oils, single-origin wildflower raw honey, and organic wellness herbal infusions.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20">
                <button
                  onClick={() => navigateTo('retailer-portal')}
                  className="inline-flex items-center gap-2 text-[#ffdf93] text-xs uppercase font-semibold tracking-wider hover:text-white transition-colors cursor-pointer"
                >
                  <span>Partner for New Launches</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: EDITORIAL TEA FEATURE */}
      <section className="py-24 bg-[#002815] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <svg className="w-full h-full" fill="none" viewBox="0 0 400 400">
            <circle className="text-[#ffdf93]" cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" />
            <path className="text-[#ffdf93]" d="M50 200 C 150 100, 250 300, 350 200" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Pack Column */}
            <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
              <div className="relative max-w-lg w-full bg-white/5 p-4 sm:p-6 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1zJDlXaKc_0S2kUvLH72skXokBCkD0_mZR0I9RynjCqy2iyfeg8atLlpZrO6szqpdToTxB3T8hR95BzW2wHpo4Qy120UU6HXRRX3LUVgtz01WQNbNZlsEbvo3ZeYyfary2aNHmWuDY7rufWtldGXw2qcVG30q2zffxOu0l_lKcxseDpbcjpb2PDIrkBAErzb21wp742zlwb9r7uGvC--60Vm_4FcgG7PI6SwsNcpfxMFekGINm1zgHwtonePUo7Qr9ew"
                  alt="Mazooq Premium Gold Assam Black Tea 1kg Pack Details"
                  className="w-full h-auto rounded-xl shadow-2xl object-cover"
                />
                <div className="absolute -top-3 -right-3 bg-[#f2c027] text-[#181d17] px-4 py-1.5 rounded-full text-xs uppercase font-bold tracking-widest shadow-lg">
                  Official Pack
                </div>
              </div>
            </div>

            {/* Editorial Story Column */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-wider">
                <span>Harvest of the Brahmaputra Valley</span>
              </div>
              <span className="block font-serif text-xl text-[#ffdf93] italic">
                Mazooq Premium Gold Tea
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight tracking-tight">
                The Taste of Assam
              </h2>
              <p className="text-base sm:text-lg text-white/85 leading-relaxed">
                Carefully selected from the finest 100% Assam tea gardens & expertly blended to deliver a rich aroma, bold flavour, and deeply satisfying cup every single morning.
              </p>

              {/* Packaging Spec Table */}
              <div className="bg-[#00290f]/70 rounded-xl p-5 shadow-inner space-y-3 text-xs text-white/85 border border-white/10">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Ingredients</span>
                  <span className="font-semibold text-white">100% Assam Black Tea (Camellia sinensis)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Origin & Packing</span>
                  <span className="text-white">Amingaon, Guwahati, Kamrup, Assam</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Marketed By</span>
                  <span className="text-white">Mazooq Foods Pvt Ltd, Kerala, India</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Pack Weights</span>
                  <span className="text-white font-semibold">250g • 500g • 1 kg Heritage Stand-up Pouch</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-white/60">Preparation</span>
                  <span className="text-white">Brew 3–5 min in freshly boiled water; serve hot or iced</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-4">
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-white/60">
                    Starts From
                  </span>
                  <span className="font-serif text-2xl text-[#ffdf93] font-bold">
                    ₹199 <span className="text-xs font-normal text-white/70">/ 250g pack</span>
                  </span>
                </div>
                <button
                  onClick={() => {
                    const tea = PRODUCTS.find((p) => p.id === 'mazooq-premium-gold-tea');
                    if (tea) addToCart(tea, '250g', 199);
                  }}
                  className="px-8 py-3.5 bg-[#f2c027] text-[#181d17] font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-[#ffdf93] transition-colors cursor-pointer"
                >
                  Shop Mazooq Tea
                </button>
                <button
                  onClick={() => navigateTo('mazooq-tea')}
                  className="text-white hover:text-[#ffdf93] text-xs uppercase font-semibold tracking-wider underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Explore Tasting Notes →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: MAZOOQ DATES SPOTLIGHT */}
      <section className="py-24 bg-[#f6fbf1] text-[#181d17]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Left */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
                Royal Desert Harvest
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#00290f] font-bold tracking-tight">
                Naturally Sweet. Naturally Mazooq.
              </h2>
              <p className="font-serif text-xl text-[#414941] italic font-normal">
                Handpicked Dates from Trusted Groves
              </p>
              <p className="text-base text-[#414941] leading-relaxed">
                From the soft, caramel notes of authentic Medjool to the venerated Ajwa dates of Medina, each batch is sorted for uniform size, moisture perfection, and unblemished skin.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#ebefe6] shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5eb] flex items-center justify-center text-[#765b00] shrink-0">
                    <Star className="w-5 h-5 fill-[#f2c027] text-[#765b00]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#00290f]">Jumbo Royal Medjool</h4>
                    <p className="text-xs text-[#414941] mt-0.5">
                      Naturally rich in fibre, potassium, and wholesome vitality without added sucrose or glucose glaze.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[#ebefe6] shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5eb] flex items-center justify-center text-[#765b00] shrink-0">
                    <Award className="w-5 h-5 text-[#765b00]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#00290f]">Auspicious Ajwa Dates</h4>
                    <p className="text-xs text-[#414941] mt-0.5">
                      Deep ebony shade, velvety texture, and rich heritage known across the globe for restorative properties.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigateTo('mazooq-dates')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00290f] text-white text-xs font-semibold uppercase tracking-wider rounded shadow hover:bg-[#104020] transition-colors cursor-pointer"
                >
                  <span>Explore Dates Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Right */}
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#ebefe6] border border-[#ebefe6]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpVBWCsAdw7Ijvu4BNHSjggsOu4iVxR8Tx3H6rw3au2bF2SpvALnz5F08f-DJSaeJHkMCW2tWIqe4nmolVqN_tQszOKpu6DbGBxrTASqJdzUxY4YBYqtw_Nm7hw7GxYM95Nxc1aXkHRb3KtvlG_KfcLtXftH8fLtHBqC_suwXOf4AQtlFRJCyx6z8IpAVqxnf1Vk5dGGnZL6STr8JrHwD7NcTc1ewnN-d1_voKHWzNOo7dR2SSH4dL4Q"
                  alt="Mazooq Premium Dates in Brass Platter with Arabic Tea"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 max-h-[520px]"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-[#00290f]/90 text-white p-4 rounded-xl backdrop-blur-md flex items-center justify-between shadow-xl border border-white/10">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#ffdf93] tracking-widest block">
                      Presentation Gift Box
                    </span>
                    <p className="text-sm font-serif font-bold text-white">
                      Gourmet Cask Series • Oxygen Barrier Sealed
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo('mazooq-dates')}
                    className="px-3.5 py-1.5 bg-[#f2c027] text-[#181d17] rounded text-xs font-bold uppercase tracking-wider hover:bg-[#ffdf93]"
                  >
                    View Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: INTERACTIVE COMPLETE PRODUCT CATALOGUE (20 SKUs) */}
      <section className="py-24 bg-[#f1f5eb] text-[#181d17]" id="catalogue">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
              Curated Pantry • 20 Signature SKUs
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#00290f] font-bold tracking-tight">
              Shop Mazooq
            </h2>
            <p className="text-sm text-[#414941]">
              Select from our complete range of teas, dates, nuts, snacks, and spices. All products packaged in compliance with export-grade barrier foils.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pb-10">
            {[
              { id: 'all', label: 'All Products (20)' },
              { id: 'tea', label: 'Mazooq Tea (4)' },
              { id: 'dates', label: 'Mazooq Dates (4)' },
              { id: 'nuts', label: 'Nuts & Dry Fruits (4)' },
              { id: 'snacks', label: 'Mazooq Snacks (4)' },
              { id: 'spices', label: 'Mazooq Spices (4)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase font-semibold tracking-wider transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#00290f] text-white shadow-md'
                    : 'bg-white text-[#414941] hover:text-[#00290f] hover:bg-[#ebefe6] shadow-sm'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 20 Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const activeVariantIdx = selectedVariants[product.id] || 0;
              const activeVariant = product.variants[activeVariantIdx] || product.variants[0];

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#ebefe6] group"
                >
                  <div>
                    {/* Image Area */}
                    <div className="relative h-52 bg-[#ebefe6] rounded-xl overflow-hidden flex items-center justify-center p-3 mb-4">
                      {product.tag && (
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-[#f2c027] text-[#181d17] rounded text-[10px] font-bold uppercase tracking-wider shadow">
                          {product.tag}
                        </span>
                      )}
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white text-[#00290f] rounded-full shadow transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <span className="text-[11px] uppercase font-bold text-[#765b00] tracking-widest block">
                      {product.categoryLabel}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#00290f] mt-1 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#414941] mt-1 line-clamp-2">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Pricing and Variant Selector */}
                  <div className="mt-4 pt-3 border-t border-[#ebefe6]">
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      {product.variants.map((variant, idx) => (
                        <button
                          key={variant.size}
                          onClick={() => handleSelectVariant(product.id, idx)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                            activeVariantIdx === idx
                              ? 'bg-[#00290f] text-white shadow-sm'
                              : 'bg-[#f1f5eb] text-[#414941] hover:bg-[#dfe4da]'
                          }`}
                        >
                          {variant.size}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-serif text-lg text-[#00290f] font-bold">
                          ₹{activeVariant.price}
                        </span>
                        <span className="block text-[10px] text-[#717970]">Taxes included</span>
                      </div>

                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="px-3.5 py-2 bg-[#00290f] text-[#ffdf93] hover:bg-[#104020] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: LOCAL PRODUCER STORY */}
      <section className="py-24 bg-[#f6fbf1] text-[#181d17]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Copy */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
                Empowerment • Fair Trade • Heritage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#00290f] font-bold tracking-tight">
                Growing With India’s Producers
              </h2>
              <p className="text-base text-[#414941] leading-relaxed">
                Mazooq Foods aims to create better market opportunities for local production groups by bringing their harvest into modern retail and future global markets.
              </p>

              <div className="space-y-6 pt-4">
                {/* Stage 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f2c027] text-[#181d17] flex items-center justify-center font-bold text-sm shrink-0 shadow">
                    1
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#00290f] uppercase tracking-wider">
                      Source Local
                    </h3>
                    <p className="text-sm text-[#414941] mt-1">
                      Working directly with independent tea gardens in Kamrup, spice farmer cooperatives, and coastal agro-collectives to ensure authentic traceability.
                    </p>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f2c027] text-[#181d17] flex items-center justify-center font-bold text-sm shrink-0 shadow">
                    2
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#00290f] uppercase tracking-wider">
                      Build Brands
                    </h3>
                    <p className="text-sm text-[#414941] mt-1">
                      Elevating packaging, food safety compliance, and shelf presence under the trusted Mazooq label, turning raw produce into prized retail items.
                    </p>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f2c027] text-[#181d17] flex items-center justify-center font-bold text-sm shrink-0 shadow">
                    3
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#00290f] uppercase tracking-wider">
                      Reach Markets
                    </h3>
                    <p className="text-sm text-[#414941] mt-1">
                      Connecting regional culinary treasures to premium supermarkets across India and structuring supply channels for global diaspora and international connoisseurs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Mosaic */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-md bg-[#ebefe6] border border-[#ebefe6]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHQwjRRI0HM46SKi-WfGnWpnkAq0zxidg3MDLX0Cg6dAOAQIWqmYh11V2lt8o1hNoIqTjy7Ba3vxf8A3MMAQBfhxytlye3qsOsvyxbMHjMtkbxGX3_ybfY6mav1n8rC4_q1zRrgTVdiEVZ_Qr3DO-EWruPRkHJxE4QV0LZQJOjdDbFtkjlwT9iISJ-geapyHklo4PLKlCyRIj_asPsSU8gaBDKHyChazlRdCTuvlNz3h2qqXHKuWw-nw"
                    alt="Assorted Whole Indian Spices"
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-[#ebefe6]">
                  <span className="font-serif text-2xl text-[#765b00] font-bold block">
                    Assam Facility
                  </span>
                  <p className="text-xs text-[#414941] mt-1">
                    Single-origin processing unit based in Amingaon, Guwahati (FSSAI Lic. 10326002000025).
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-6 bg-[#00290f] text-white rounded-2xl shadow-md border border-[#ffdf93]/20">
                  <span className="font-serif text-2xl text-[#ffdf93] font-bold block">
                    Kerala Facility
                  </span>
                  <p className="text-xs text-white/80 mt-1">
                    Artisanal snack and distribution facility in Palakkad District (FSSAI Lic. 11325009001048).
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md bg-[#ebefe6] border border-[#ebefe6]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBClIRZ-lAygkIzfhsI71RdtlXJrqJV9YO40ocUY-QzyGHBITbEi_QmgpQiKAd7TWUtGPxtMGcTmNrSUEWzGTH55hAgQn1JGn5-Ardir7RvzQ8OHHEKY4GCfzNBdW-q1t8vEHMojxyPL7kMW68irU8Cwcze0aRY591qs173SS1r7DSmEhgFuC_fVbqQM_am5Kj909ws4ZMcVGcbpMLbpeDsRjOXwNeWVGqIYlcV_IsU77ldWdIycYf6TQ"
                    alt="Kerala Banana Chips Preparation"
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: GLOBAL VISION MAP */}
      <section className="py-24 bg-[#00290f] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase font-semibold text-[#ffdf93] tracking-widest">
              Future Export Roadmap
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-tight">
              Made in India. Made for the World.
            </h2>
            <p className="text-base text-white/85 leading-relaxed">
              From Indian producers to customers and retailers beyond our borders. Building our future export roadmap across Middle East, Europe, Asia, Africa, and North America.
            </p>
          </div>

          {/* Schematic Global Map Visual */}
          <div className="relative bg-[#002815]/90 rounded-2xl p-6 sm:p-12 shadow-2xl backdrop-blur-md overflow-hidden border border-[#ffdf93]/15">
            <div className="w-full h-80 sm:h-96 relative flex items-center justify-center">
              {/* Abstract World Vector */}
              <svg className="w-full h-full opacity-40" fill="none" stroke="currentColor" viewBox="0 0 1000 500">
                <path className="text-[#ffdf93]" d="M150,150 Q200,100 300,140 T450,130" strokeWidth="1.5" />
                <path className="text-[#ffdf93]" d="M180,250 Q220,380 280,420" strokeWidth="1.5" />
                <path className="text-[#ffdf93]" d="M480,180 Q520,120 620,150 T750,120" strokeWidth="1.5" />
                <path className="text-[#ffdf93]" d="M500,240 Q550,380 600,400" strokeWidth="1.5" />
                <path className="text-[#ffdf93]" d="M680,220 Q750,260 820,240" strokeWidth="1.5" />
                <path className="text-[#ffdf93]" d="M780,350 Q850,380 880,440" strokeWidth="1.5" />
                {/* Radiating Arcs from India Center */}
                <path className="text-[#f2c027]" d="M690,240 Q600,180 520,200" strokeDasharray="4 4" strokeWidth="2" />
                <path className="text-[#f2c027]" d="M690,240 Q620,120 540,140" strokeDasharray="4 4" strokeWidth="2" />
                <path className="text-[#f2c027]" d="M690,240 Q750,180 800,220" strokeDasharray="4 4" strokeWidth="2" />
                <path className="text-[#f2c027]" d="M690,240 Q500,140 280,180" strokeDasharray="6 6" strokeWidth="2" />
                <path className="text-[#f2c027]" d="M690,240 Q620,320 560,340" strokeDasharray="4 4" strokeWidth="2" />
              </svg>

              {/* Core Hub: India */}
              <div className="absolute top-[48%] left-[69%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffdf93] opacity-75" />
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-[#f2c027] items-center justify-center text-[#181d17] text-[10px] font-bold">
                    IN
                  </span>
                </span>
                <span className="text-[#ffdf93] text-xs uppercase font-bold mt-1 tracking-wider">
                  India Origin
                </span>
              </div>

              {/* Target Node: Middle East */}
              <div className="absolute top-[42%] left-[54%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#ffdf93] shadow" />
                <span className="text-white/90 text-[11px] uppercase tracking-wider font-semibold mt-1">
                  GCC / Dubai
                </span>
              </div>

              {/* Target Node: Europe */}
              <div className="absolute top-[28%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#ffdf93] shadow" />
                <span className="text-white/90 text-[11px] uppercase tracking-wider font-semibold mt-1">
                  UK & Europe
                </span>
              </div>

              {/* Target Node: North America */}
              <div className="absolute top-[35%] left-[26%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#ffdf93] shadow" />
                <span className="text-white/90 text-[11px] uppercase tracking-wider font-semibold mt-1">
                  North America
                </span>
              </div>

              {/* Target Node: South East Asia */}
              <div className="absolute top-[52%] left-[82%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[#ffdf93] shadow" />
                <span className="text-white/90 text-[11px] uppercase tracking-wider font-semibold mt-1">
                  ASEAN
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10 text-center">
              <div>
                <span className="font-serif text-base text-[#ffdf93] block font-bold">
                  Export Quality Standard
                </span>
                <span className="text-xs text-white/70">Standardized multilingual packs</span>
              </div>
              <div>
                <span className="font-serif text-base text-[#ffdf93] block font-bold">
                  Traceable Batches
                </span>
                <span className="text-xs text-white/70">Direct garden to sea freight</span>
              </div>
              <div>
                <span className="font-serif text-base text-[#ffdf93] block font-bold">
                  Institutional Sizing
                </span>
                <span className="text-xs text-white/70">Bulk crates & boutique tins</span>
              </div>
              <div>
                <span className="font-serif text-base text-[#ffdf93] block font-bold">
                  Trade Enquiries
                </span>
                <span className="text-xs text-white/70">+91 70021 70175</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: B2B RETAILER CALLOUT BANNER */}
      <section className="py-20 bg-[#f6fbf1] text-[#181d17]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-gradient-to-r from-[#00290f] via-[#104020] to-[#00290f] text-white rounded-2xl p-8 sm:p-14 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden border border-[#ffdf93]/15">
            <div className="space-y-4 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-wider">
                <span>Wholesale & Retail Network</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold tracking-tight leading-tight">
                Partner With Mazooq Foods
              </h2>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                Are you a supermarket distributor, organic food retailer, or import house? Join our certified retail network with attractive margin structures, flexible minimum order quantities, and assured packaging fresh guarantees.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-white/80">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#f2c027]" />
                  <span>+91 70021 70175</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#f2c027]" />
                  <span>info@mazooq.com</span>
                </span>
              </div>
            </div>

            <div className="shrink-0 relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigateTo('retailer-portal')}
                className="px-8 py-4 bg-[#f2c027] text-[#181d17] font-bold text-xs uppercase tracking-wider rounded text-center shadow-lg hover:bg-[#ffdf93] transition-all cursor-pointer"
              >
                Register as a Retailer
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className="px-8 py-4 bg-white/15 text-white font-semibold text-xs uppercase tracking-wider rounded text-center hover:bg-white/25 transition-all cursor-pointer"
              >
                Request Sample Kit
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
