import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, CheckCircle, Truck, CreditCard, ShieldCheck, ArrowRight, Printer } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, subtotal, clearCart, showToast } = useCart();

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: 'Faiz O.',
    phone: '+91 98460 12345',
    email: 'faizoman32@gmail.com',
    address: 'Flat 4B, Emerald Residency, Civil Station',
    city: 'Palakkad',
    state: 'Kerala',
    pincode: '679101',
    paymentMethod: 'cod', // 'cod' | 'upi' | 'card'
  });
  const [confirmedOrderId, setConfirmedOrderId] = useState('');

  if (!isCheckoutOpen) return null;

  const shippingCost = subtotal >= 1500 ? 0 : 99;
  const orderTotal = subtotal + shippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      showToast('Incomplete Address', 'Please fill in all mandatory delivery fields.');
      return;
    }

    const orderId = 'MZQ-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmedOrderId(orderId);
    setStep('success');
    clearCart();
    showToast('Order Placed Successfully', `Your order #${orderId} is confirmed!`);
  };

  const handleClose = () => {
    setStep('details');
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#00290f]/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#f6fbf1] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#ffdf93]/20 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#00290f] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f2c027] text-[#181d17] flex items-center justify-center font-bold text-xs">
              MZ
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-tight text-white">
                {step === 'details' ? 'Mazooq Express Checkout' : 'Order Confirmed'}
              </h3>
              <p className="text-xs text-[#ffdf93]">
                {step === 'details' ? 'Direct dispatch from Assam & Kerala facilities' : `Order #${confirmedOrderId}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            {/* Delivery Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#765b00] flex items-center gap-1.5 mb-3">
                <Truck className="w-4 h-4" />
                <span>1. Shipping Destination</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#414941] mb-1 font-medium">Recipient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-[#dfe4da] rounded-lg px-3 py-2 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div>
                  <label className="block text-[#414941] mb-1 font-medium">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-[#dfe4da] rounded-lg px-3 py-2 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#414941] mb-1 font-medium">Email for Order & Invoice</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-[#dfe4da] rounded-lg px-3 py-2 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#414941] mb-1 font-medium">Street Address & Landmark *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white border border-[#dfe4da] rounded-lg px-3 py-2 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div>
                  <label className="block text-[#414941] mb-1 font-medium">City / District *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-[#dfe4da] rounded-lg px-3 py-2 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[#414941] mb-1 font-medium">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-white border border-[#dfe4da] rounded-lg px-3 py-2 focus:outline-none focus:border-[#765b00]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#414941] mb-1 font-medium">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full bg-white border border-[#dfe4da] rounded-lg px-3 py-2 focus:outline-none focus:border-[#765b00]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Selection */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#765b00] flex items-center gap-1.5 mb-3">
                <CreditCard className="w-4 h-4" />
                <span>2. Payment Option</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <label
                  className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'bg-white border-[#765b00] shadow-sm ring-1 ring-[#765b00]'
                      : 'bg-white/60 border-[#dfe4da] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#00290f]">Cash on Delivery</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className="text-[#765b00]"
                    />
                  </div>
                  <span className="text-[11px] text-[#414941] mt-2">
                    Pay safely at your doorstep upon verification
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    formData.paymentMethod === 'upi'
                      ? 'bg-white border-[#765b00] shadow-sm ring-1 ring-[#765b00]'
                      : 'bg-white/60 border-[#dfe4da] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#00290f]">UPI / QR Pay</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                      className="text-[#765b00]"
                    />
                  </div>
                  <span className="text-[11px] text-[#414941] mt-2">
                    GPay, PhonePe, Paytm, or BHIM instant scan
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'bg-white border-[#765b00] shadow-sm ring-1 ring-[#765b00]'
                      : 'bg-white/60 border-[#dfe4da] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#00290f]">Card / NetBanking</span>
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                      className="text-[#765b00]"
                    />
                  </div>
                  <span className="text-[11px] text-[#414941] mt-2">
                    Visa, MasterCard, RuPay with 3D Secure
                  </span>
                </label>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="bg-white p-4 rounded-xl border border-[#ebefe6] space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-[11px] text-[#717970] block">
                Order Items ({cart.length})
              </span>
              <div className="max-h-32 overflow-y-auto space-y-1.5 divide-y divide-[#ebefe6]">
                {cart.map((item) => (
                  <div key={item.id} className="pt-1.5 flex justify-between items-center text-xs">
                    <span className="truncate pr-4">
                      {item.name} <span className="text-[#717970]">({item.variantSize})</span> × {item.quantity}
                    </span>
                    <span className="font-semibold text-[#181d17] shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#ebefe6] flex justify-between font-bold text-sm text-[#00290f]">
                <span>Total Payable Amount</span>
                <span className="text-base text-[#765b00]">₹{orderTotal}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-4 bg-[#f2c027] hover:bg-[#ffdf93] text-[#181d17] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm & Place Order (₹{orderTotal})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-[#717970]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine Origin Guarantee • Direct Fresh Packaging</span>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="font-semibold uppercase tracking-widest text-xs text-[#765b00]">
                Thank you for choosing Mazooq
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#00290f] mt-1">
                Your Order #{confirmedOrderId} is Confirmed!
              </h2>
              <p className="text-xs text-[#414941] mt-2 max-w-md mx-auto leading-relaxed">
                We have notified our blending facility in Amingaon, Guwahati & distribution center in Palakkad. You will receive an SMS and email notification once your parcel is packed and dispatched.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-white p-5 rounded-xl border border-[#dfe4da] text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between py-1 border-b border-[#ebefe6]">
                <span className="text-[#717970]">Recipient:</span>
                <span className="font-semibold text-[#181d17]">{formData.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#ebefe6]">
                <span className="text-[#717970]">Shipping Address:</span>
                <span className="font-medium text-[#181d17] text-right">
                  {formData.address}, {formData.city}, {formData.state} - {formData.pincode}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#ebefe6]">
                <span className="text-[#717970]">Payment Mode:</span>
                <span className="font-semibold text-[#181d17] uppercase">{formData.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#ebefe6]">
                <span className="text-[#717970]">Estimated Delivery:</span>
                <span className="font-semibold text-emerald-700">3-4 Business Days</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-sm text-[#00290f]">
                <span>Total Amount:</span>
                <span className="text-[#765b00]">₹{orderTotal}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-white border border-[#dfe4da] text-[#181d17] rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#ebefe6]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={handleClose}
                className="px-6 py-2.5 bg-[#00290f] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#104020]"
              >
                Return to Store
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
