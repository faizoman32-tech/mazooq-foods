import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Star, ShoppingBag, ShieldCheck, MapPin, Sparkles, Check } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedVariantIndex(0);
    setQuantity(1);
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentVariant = quickViewProduct.variants[selectedVariantIndex] || quickViewProduct.variants[0];

  const handleAdd = () => {
    addToCart(quickViewProduct, currentVariant.size, currentVariant.price, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#00290f]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#f6fbf1] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#ffdf93]/20 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Image Column */}
          <div className="md:col-span-5 bg-[#ebefe6] p-6 flex flex-col items-center justify-center relative min-h-[300px]">
            {quickViewProduct.tag && (
              <span className="absolute top-4 left-4 bg-[#765b00] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                {quickViewProduct.tag}
              </span>
            )}
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="max-h-72 w-auto object-contain drop-shadow-xl"
            />
            <div className="mt-4 text-center">
              <span className="text-[11px] text-[#717970] uppercase tracking-wider block font-medium">
                Origin Authenticity
              </span>
              <p className="text-xs text-[#00290f] font-semibold mt-0.5 flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#765b00]" />
                <span>{quickViewProduct.origin}</span>
              </p>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold text-[#765b00] tracking-wider">
                  {quickViewProduct.categoryLabel}
                </span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{quickViewProduct.rating}</span>
                  <span className="text-[#717970] font-normal">({quickViewProduct.reviewsCount})</span>
                </div>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#00290f] leading-snug">
                {quickViewProduct.name}
              </h2>
              <p className="text-xs text-[#414941] mt-2 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Story snippet */}
              <div className="bg-white p-3 rounded-lg border border-[#dfe4da] mt-3 text-[11px] text-[#414941]">
                <span className="font-bold text-[#00290f] block mb-0.5">Heritage Notes:</span>
                {quickViewProduct.story}
              </div>

              {/* Nutrition Table */}
              <div className="mt-4 pt-3 border-t border-[#ebefe6]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#717970] block mb-1.5">
                  Nutritional Values & Compliance:
                </span>
                <div className="grid grid-cols-5 gap-1 text-center bg-white p-2 rounded-lg border border-[#dfe4da] text-[10px]">
                  <div>
                    <span className="text-[#717970] block">Energy</span>
                    <span className="font-bold text-[#181d17]">{quickViewProduct.nutrition.calories}</span>
                  </div>
                  <div>
                    <span className="text-[#717970] block">Protein</span>
                    <span className="font-bold text-[#181d17]">{quickViewProduct.nutrition.protein}</span>
                  </div>
                  <div>
                    <span className="text-[#717970] block">Carbs</span>
                    <span className="font-bold text-[#181d17]">{quickViewProduct.nutrition.carbs}</span>
                  </div>
                  <div>
                    <span className="text-[#717970] block">Fat</span>
                    <span className="font-bold text-[#181d17]">{quickViewProduct.nutrition.fat}</span>
                  </div>
                  <div>
                    <span className="text-[#717970] block">Sodium</span>
                    <span className="font-bold text-[#181d17]">{quickViewProduct.nutrition.sodium}</span>
                  </div>
                </div>
              </div>

              {/* Ingredients & Prep */}
              <div className="mt-3 text-[11px] space-y-1 text-[#414941]">
                <p>
                  <strong className="text-[#00290f]">Ingredients:</strong> {quickViewProduct.ingredients}
                </p>
                <p>
                  <strong className="text-[#00290f]">Serving Suggestion:</strong> {quickViewProduct.preparationOrUsage}
                </p>
                {quickViewProduct.fssaiNumber && (
                  <p className="text-[10px] text-emerald-800 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>FSSAI License No. {quickViewProduct.fssaiNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Variant & Action Bar */}
            <div className="pt-4 border-t border-[#dfe4da] space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#00290f] block mb-2">
                  Select Pack Size:
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.variants.map((v, idx) => (
                    <button
                      key={v.size}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        selectedVariantIndex === idx
                          ? 'bg-[#00290f] text-[#ffdf93] shadow-md ring-2 ring-[#765b00]'
                          : 'bg-white text-[#414941] border border-[#dfe4da] hover:bg-[#ebefe6]'
                      }`}
                    >
                      {v.size} • ₹{v.price}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-2xl font-serif font-bold text-[#00290f]">
                    ₹{currentVariant.price * quantity}
                  </div>
                  <span className="text-[10px] text-[#717970] block">Taxes included</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#dfe4da] rounded-lg bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1.5 text-xs text-[#181d17] hover:bg-[#ebefe6] font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1.5 text-xs text-[#181d17] hover:bg-[#ebefe6] font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="px-6 py-2.5 bg-[#f2c027] hover:bg-[#ffdf93] text-[#181d17] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
