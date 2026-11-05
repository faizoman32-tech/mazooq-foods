import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, CheckCircle, Truck, CreditCard, ShieldCheck, ArrowRight, Printer } from 'lucide-react';
import { whatsappLink } from '../data/company';
import { WhatsAppIcon } from './WhatsAppIcon';
import { POLICY_SETTINGS } from '../data/policies';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

/** Dynamically loads the official Razorpay Checkout script. */
function loadRazorpayCheckout(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const existing = document.getElementById('razorpay-checkout-js') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type PaymentMethod = 'cod' | 'upi' | 'card';

const PAYMENT_MODE_LABEL: Record<PaymentMethod, string> = {
  cod: 'Cash on Delivery',
  upi: 'Paid Online — UPI (Razorpay)',
  card: 'Paid Online — Card / NetBanking (Razorpay)',
};

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, subtotal, clearCart, showToast, isApprovedRetailer } = useCart();

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentInfo, setPaymentInfo] = useState<{ method: PaymentMethod; paymentId?: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod' as PaymentMethod,
  });
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  if (!isCheckoutOpen) return null;

  // Same rule the server charges (server/payments-core.js); retailers have their own threshold.
  const shippingCost = isApprovedRetailer
    ? (subtotal >= POLICY_SETTINGS.retailerFreeShippingAbove ? 0 : POLICY_SETTINGS.retailerShippingFee)
    : (subtotal >= POLICY_SETTINGS.freeShippingAbove ? 0 : POLICY_SETTINGS.shippingFee);
  const orderTotal = subtotal + shippingCost;

  const cartPayload = () =>
    cart.map((item) => ({
      productId: item.productId,
      variantSize: item.variantSize,
      quantity: item.quantity,
    }));

  const customerPayload = () => ({
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
  });

  const finishOrder = (orderRef: string, info: { method: PaymentMethod; paymentId?: string }, serverTotal?: number) => {
    setConfirmedOrderId(orderRef);
    setConfirmedTotal(typeof serverTotal === 'number' ? serverTotal : orderTotal);
    setPaymentInfo(info);
    setStep('success');
    clearCart();
    showToast('Order Placed Successfully', `Your order #${orderRef} is confirmed!`);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      showToast('Incomplete Address', 'Please fill in all mandatory delivery fields.');
      return;
    }

    setIsProcessing(true);
    try {
      // ---- Cash on Delivery: server-validated order capture ----
      if (formData.paymentMethod === 'cod') {
        const res = await fetch('/api/orders/cod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: cartPayload(), customer: customerPayload() }),
        });
        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.ok) {
          if (import.meta.env.DEV) {
            // Local preview without the payment server - simulate so the flow can be tested.
            finishOrder('MZQ-' + Math.floor(100000 + Math.random() * 900000), { method: 'cod' });
            return;
          }
          throw new Error(data?.message || 'Could not place the order. Please try again.');
        }
        finishOrder(data.receipt, { method: 'cod' }, data.totals?.total);
        return;
      }

      // ---- Online payment via Razorpay (UPI / Card / NetBanking) ----
      const createRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartPayload(), customer: customerPayload() }),
      });
      const createData = await createRes.json().catch(() => null);

      if (!createRes.ok || !createData?.ok) {
        if (import.meta.env.DEV) {
          // Local preview without configured Razorpay keys - simulate a paid order.
          showToast('Demo Mode', 'Razorpay is not configured locally - simulating a successful payment.');
          finishOrder('MZQ-' + Math.floor(100000 + Math.random() * 900000), {
            method: formData.paymentMethod,
            paymentId: 'demo_' + Date.now(),
          });
          return;
        }
        throw new Error(
          createData?.message ||
            'Online payment is not available right now. Please try again or choose Cash on Delivery.'
        );
      }

      const scriptLoaded = await loadRazorpayCheckout();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Could not load Razorpay Checkout. Please check your internet connection and try again.');
      }

      await new Promise<void>((resolve, reject) => {
        const razorpay = new window.Razorpay({
          key: createData.keyId,
          amount: createData.amount, // paise, calculated server-side
          currency: createData.currency || 'INR',
          name: 'Mazooq Foods',
          description: `Order ${createData.receipt}`,
          order_id: createData.orderId,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          notes: { receipt: createData.receipt },
          theme: { color: '#00290f' },
          handler: async (response: any) => {
            try {
              // Server-side signature verification + Razorpay cross-check.
              const verifyRes = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  customer: customerPayload(),
                  items: cartPayload(),
                }),
              });
              const verifyData = await verifyRes.json().catch(() => null);
              if (!verifyRes.ok || !verifyData?.ok) {
                throw new Error(verifyData?.message || 'Payment verification failed. If money was deducted, contact info@mazooq.com.');
              }
              finishOrder(createData.receipt || verifyData.receipt || response.razorpay_order_id, {
                method: formData.paymentMethod,
                paymentId: response.razorpay_payment_id,
              }, typeof verifyData.amount === 'number' ? verifyData.amount : undefined);
              resolve();
            } catch (err: any) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () =>
              reject(new Error('Payment window closed before completion. You have not been charged — place the order again when ready.')),
          },
        });

        razorpay.on('payment.failed', (resp: any) => {
          reject(new Error(resp?.error?.description || 'Payment failed at the gateway. No amount was captured.'));
        });

        razorpay.open();
      });
    } catch (err: any) {
      setPaymentError(err?.message || 'Payment could not be completed. Please try again.');
      showToast('Payment Failed', err?.message || 'Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('details');
    setPaymentError('');
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
                    placeholder="e.g. Ahmed Rahman"
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
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-[#dfe4da] rounded-lg px-3 py-2 focus:outline-none focus:border-[#765b00]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[#414941] mb-1 font-medium">Email for Order & Invoice</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
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
                    placeholder="House / Flat, Street, Landmark"
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
                    placeholder="City"
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
                      placeholder="State"
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
                      placeholder="6-digit PIN"
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
                    GPay, PhonePe, Paytm, BHIM — secured by Razorpay
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

              <div className="pt-2 border-t border-[#ebefe6] space-y-1">
                <div className="flex justify-between text-[#717970]">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-[#717970]">
                  <span>Shipping {shippingCost === 0 ? `(Free over ₹${(isApprovedRetailer ? POLICY_SETTINGS.retailerFreeShippingAbove : POLICY_SETTINGS.freeShippingAbove).toLocaleString('en-IN')})` : ''}</span>
                  <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#00290f] pt-1">
                  <span>Total Payable Amount</span>
                  <span className="text-base text-[#765b00]">₹{orderTotal}</span>
                </div>
              </div>
            </div>

            {paymentError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
                {paymentError}
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 ${
                isProcessing
                  ? 'bg-stone-300 text-stone-500 cursor-wait'
                  : 'bg-[#f2c027] hover:bg-[#ffdf93] text-[#181d17] cursor-pointer'
              }`}
            >
              <span>
                {isProcessing
                  ? 'Processing...'
                  : formData.paymentMethod === 'cod'
                    ? `Confirm & Place Order (₹${orderTotal})`
                    : `Pay ₹${orderTotal} Securely`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center gap-1.5 text-xs text-[#717970]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Genuine Origin Guarantee • Direct Fresh Packaging</span>
              </div>
              <span className="text-[11px]">
                Online payments are processed securely by Razorpay. Mazooq never stores your card details.
              </span>
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
                Our team has been notified and will start packing your order.
                {formData.email ? ` A confirmation has been sent to ${formData.email}.` : ''} We'll share tracking details once your parcel is dispatched.
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
                <span className="font-semibold text-[#181d17]">
                  {paymentInfo ? PAYMENT_MODE_LABEL[paymentInfo.method] : '—'}
                </span>
              </div>
              {paymentInfo?.paymentId && (
                <div className="flex justify-between py-1 border-b border-[#ebefe6]">
                  <span className="text-[#717970]">Payment ID:</span>
                  <span className="font-mono text-[11px] text-[#181d17]">{paymentInfo.paymentId}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#ebefe6]">
                <span className="text-[#717970]">Estimated Delivery:</span>
                <span className="font-semibold text-emerald-700">{POLICY_SETTINGS.deliveryEstimate}</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-sm text-[#00290f]">
                <span>Total Amount:</span>
                <span className="text-[#765b00]">₹{confirmedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={whatsappLink(`Hi Mazooq Foods, I have a question about my order #${confirmedOrderId}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-[#25D366] text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#1ebe5a]"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>WhatsApp Us</span>
              </a>
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
