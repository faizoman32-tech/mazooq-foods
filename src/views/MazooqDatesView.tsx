import React from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { Star, ShoppingBag, Eye, Heart, Sparkles, ShieldCheck, Gift } from 'lucide-react';

export const MazooqDatesView: React.FC = () => {
  const { addToCart, setQuickViewProduct } = useCart();
  const dateProducts = PRODUCTS.filter((p) => p.category === 'dates');

  return (
    <div className="w-full bg-[#f6fbf1] text-[#181d17] pt-12 pb-24">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-16">
        <div className="bg-[#00290f] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-[#ffdf93]/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#104020] text-[#ffdf93] rounded-full text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#f2c027]" />
                <span>Royal Desert Harvest • Vault Selection</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight leading-tight">
                Mazooq Royal Dates <br />
                <span className="italic font-normal text-[#ffdf93]">Naturally Sweet. Naturally Mazooq.</span>
              </h1>
              <p className="text-base text-white/85 max-w-lg leading-relaxed">
                Hand-selected whole dates sorted for uniform plumpness, velvety flesh, and authentic origin purity. Free from chemical glucose polishing, artificial syrups, or preservatives.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <span className="text-white/60 block">Sweetness</span>
                  <span className="font-bold text-[#ffdf93]">100% Natural Fructose</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <span className="text-white/60 block">Texture</span>
                  <span className="font-bold text-[#ffdf93]">Soft, Caramel Pulp</span>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <span className="text-white/60 block">Packaging</span>
                  <span className="font-bold text-[#ffdf93]">Airtight Nitrogen Flush</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpVBWCsAdw7Ijvu4BNHSjggsOu4iVxR8Tx3H6rw3au2bF2SpvALnz5F08f-DJSaeJHkMCW2tWIqe4nmolVqN_tQszOKpu6DbGBxrTASqJdzUxY4YBYqtw_Nm7hw7GxYM95Nxc1aXkHRb3KtvlG_KfcLtXftH8fLtHBqC_suwXOf4AQtlFRJCyx6z8IpAVqxnf1Vk5dGGnZL6STr8JrHwD7NcTc1ewnN-d1_voKHWzNOo7dR2SSH4dL4Q"
                alt="Mazooq Dates Assortment"
                className="rounded-2xl shadow-2xl object-cover max-h-80 w-full hover:scale-105 transition-transform duration-500 border border-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dates Showcase Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-24">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
            The Royal Grove
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#00290f]">
            Four Curated Date Varieties
          </h2>
          <p className="text-sm text-[#414941]">
            From whole desert fruit to luxury stuffed confection casks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dateProducts.map((product) => {
            const defaultVariant = product.variants[0];
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#ebefe6] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 bg-[#ebefe6] rounded-xl overflow-hidden flex items-center justify-center p-3 mb-4">
                    {product.tag && (
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-[#765b00] text-white rounded text-[10px] font-bold uppercase tracking-wider">
                        {product.tag}
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover rounded-lg hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#765b00] tracking-wider block">
                    {product.categoryLabel}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#00290f] mt-1 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#414941] mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#ebefe6]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-serif text-lg font-bold text-[#00290f]">
                      ₹{defaultVariant.price}{' '}
                      <span className="text-xs font-normal text-[#717970]">
                        ({defaultVariant.size})
                      </span>
                    </span>
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="text-xs text-[#765b00] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(product, defaultVariant.size, defaultVariant.price)}
                    className="w-full py-2.5 bg-[#00290f] hover:bg-[#104020] text-[#ffdf93] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Wellness & Nutritional Value Card */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#ebefe6]">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs uppercase font-semibold text-[#765b00] tracking-widest">
              Ancient Superfood
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#00290f]">
              Why Choose Mazooq Dates?
            </h2>
            <p className="text-sm text-[#414941]">
              A powerhouse of essential micronutrients packed by nature.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#f1f5eb] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#00290f] text-[#ffdf93] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#00290f]">Heart & Muscle Vitality</h4>
              <p className="text-xs text-[#414941] leading-relaxed">
                Abundant in dietary potassium and magnesium which regulate blood pressure and promote steady muscular endurance.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f1f5eb] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#00290f] text-[#ffdf93] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#00290f]">Clean Sustained Stamina</h4>
              <p className="text-xs text-[#414941] leading-relaxed">
                Contains naturally balanced fructose, glucose, and soluble fiber, delivering steady energy without glycemic crashes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#f1f5eb] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#00290f] text-[#ffdf93] flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#00290f]">Bespoke Festive Gifting</h4>
              <p className="text-xs text-[#414941] leading-relaxed">
                Available in royal gilded presentation boxes, wooden casket hampers, and vacuum tins for corporate and festive celebrations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
