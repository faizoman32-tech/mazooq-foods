import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    setIsCheckoutOpen,
    showToast,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const freeShippingThreshold = 1500;
  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MAZOOQ10' || promoCode.trim().toUpperCase() === 'TASTETHESMILE') {
      setDiscountPercent(10);
      showToast('Promo Applied', '10% privilege discount applied to your order.');
    } else {
      showToast('Invalid Code', 'Try MAZOOQ10 for 10% privilege discount.');
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-[#00290f]/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#f6fbf1] shadow-2xl flex flex-col border-l border-[#ffdf93]/20">
          {/* Header */}
          <div className="p-6 bg-[#00290f] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#f2c027]" />
              <h3 className="font-serif text-lg text-white font-bold tracking-tight">
                Bespoke Order Bag
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-[#104020] text-[#ffdf93] px-6 py-3 text-xs">
            <div className="flex justify-between font-semibold mb-1">
              <span>{amountNeeded > 0 ? `Add ₹${amountNeeded} more for Free Delivery` : '🎉 Qualified for Free Insured Dispatch!'}</span>
              <span>{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#f2c027] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#765b00]/40 mx-auto" />
                <h4 className="font-serif text-lg text-[#00290f] font-semibold">Your bag is empty</h4>
                <p className="text-xs text-[#414941] max-w-xs mx-auto">
                  Explore our premium Assam teas, royal dates, and authentic Kerala snacks.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 bg-[#00290f] text-white text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Browse Pantry
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-xl shadow-sm border border-[#ebefe6] flex gap-4 items-center justify-between"
                >
                  <div className="w-16 h-16 rounded-lg bg-[#ebefe6] p-1.5 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#00290f] truncate">{item.name}</h4>
                    <p className="text-xs text-[#414941]">{item.variantSize}</p>
                    <div className="text-sm font-bold text-[#765b00] mt-1">₹{item.price}</div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="inline-flex items-center border border-[#dfe4da] rounded bg-[#f6fbf1]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#181d17] hover:bg-white font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#181d17] hover:bg-white font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[11px] text-[#414941]">
                        = ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-600/70 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-[#ebefe6] space-y-4 shadow-lg">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-[#717970]" />
                  <input
                    type="text"
                    placeholder="Coupon (try MAZOOQ10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-[#f1f5eb] border border-[#dfe4da] rounded focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#104020] text-[#ffdf93] text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#00290f]"
                >
                  Apply
                </button>
              </form>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-[#414941] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#181d17]">₹{subtotal}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Privilege Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-emerald-700">
                    {amountNeeded === 0 ? 'FREE' : '₹99 (Free above ₹1500)'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#00290f] pt-2 border-t border-[#ebefe6]">
                  <span>Total (Taxes Included)</span>
                  <span className="text-base text-[#765b00]">
                    ₹{finalTotal + (amountNeeded === 0 ? 0 : 99)}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 bg-[#f2c027] text-[#181d17] font-semibold text-xs uppercase tracking-wider rounded shadow-md hover:bg-[#ffdf93] transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#717970]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Complimentary insured transit • FSSAI certified batches</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
