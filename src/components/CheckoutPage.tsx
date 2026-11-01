import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote, 
  QrCode, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Tag, 
  ChevronRight,
  ArrowLeft,
  Truck,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { ShippingAddress } from '../types';
import { api } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    clearCart,
    showToast,
    pincode,
    setCurrentView,
    setLastOrder,
    formatPrice,
    currency
  } = useShop();

  const [step, setStep] = useState<'address' | 'payment' | 'otp' | 'processing'>('address');

  // Address state
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Pawan Kumar',
    phone: '+91 98765 43210',
    pincode: pincode || '110001',
    addressLine: 'Flat 402, Lotus Grand Residences, Outer Ring Road',
    city: 'New Delhi',
    state: 'Delhi',
    landmark: 'Near Central Plaza',
    addressType: 'Home'
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('pawan2004xy@oksbi');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8821',
    name: 'Pawan Kumar',
    expiry: '08/29',
    cvv: '842'
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [otpCode, setOtpCode] = useState('4892');
  const [errorMessage, setErrorMessage] = useState('');

  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPayable = Math.max(0, cartSubtotal - couponDiscount);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName.trim() || !address.phone.trim() || !address.addressLine.trim() || !address.pincode.trim()) {
      setErrorMessage('Please fill in all mandatory shipping address fields.');
      return;
    }
    setErrorMessage('');
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInitiatePayment = () => {
    if (paymentMethod === 'CARD') {
      setStep('otp');
    } else {
      executeOrderCreation();
    }
  };

  const executeOrderCreation = async () => {
    setStep('processing');
    try {
      await new Promise(r => setTimeout(r, 1500));

      const newOrder = await api.createOrder({
        items: cart,
        shippingAddress: address,
        paymentMethod,
        subtotal: cartSubtotal,
        discount: 0,
        couponCode: appliedCoupon?.code,
        couponDiscount,
        deliveryFee: 0,
        totalAmount: finalPayable,
        expectedDeliveryDate: 'Within 3-4 Business Days'
      });

      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 }
      });

      clearCart();
      setLastOrder(newOrder);
      showToast(`Order #${newOrder.orderNumber} successfully placed!`, 'success');
      setCurrentView('orders');
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment authorization failed');
      setStep('payment');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold font-serif-luxury text-stone-900 mb-2">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-stone-500 mb-6">
          Add some handcrafted home decor pieces to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => setCurrentView('shop')}
          className="bg-stone-900 hover:bg-amber-700 text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-md"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <button onClick={() => setCurrentView('home')} className="hover:text-stone-900">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <button onClick={() => setCurrentView('shop')} className="hover:text-stone-900">
          Catalog
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-bold">Secure Checkout</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold font-serif-luxury text-stone-900">
            DECORIVA Secure Payment Gateway
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit Bank Level Encryption</span>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between text-xs font-semibold max-w-xl">
        <div className={`flex items-center gap-2 ${step === 'address' ? 'text-amber-700 font-bold' : 'text-emerald-700'}`}>
          <span className="w-6 h-6 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center text-xs">1</span>
          <span>Delivery Address</span>
        </div>
        <span className="h-px w-10 sm:w-16 bg-stone-200" />
        <div className={`flex items-center gap-2 ${step === 'payment' || step === 'otp' ? 'text-amber-700 font-bold' : 'text-stone-400'}`}>
          <span className="w-6 h-6 rounded-full bg-stone-100 border flex items-center justify-center text-xs">2</span>
          <span>Payment Gateway</span>
        </div>
        <span className="h-px w-10 sm:w-16 bg-stone-200" />
        <div className="flex items-center gap-2 text-stone-400">
          <span className="w-6 h-6 rounded-full bg-stone-100 border flex items-center justify-center text-xs">3</span>
          <span>Order Confirmation</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form / Payment */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
          
          {/* STEP 1: Address Form */}
          {step === 'address' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <h2 className="text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
                1. Shipping & Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:border-amber-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Phone (For Delivery OTP) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:border-amber-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Street Address, Apartment, Flat No. *
                </label>
                <input
                  type="text"
                  required
                  value={address.addressLine}
                  onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:border-amber-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:border-amber-600 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:border-amber-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:border-amber-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={address.landmark || ''}
                  onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                  placeholder="e.g. Near City Center Mall"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:border-amber-600 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                <span>CONTINUE TO PAYMENT ({formatPrice(finalPayable)})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Multi-Method Payment Gateway */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h2 className="text-base font-bold text-stone-900">
                  2. Select Payment Gateway Method
                </h2>
                <button
                  onClick={() => setStep('address')}
                  className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Edit Address
                </button>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'UPI'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-900 font-bold shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-amber-700" />
                  <span className="text-xs">UPI / QR</span>
                  <span className="text-[10px] text-stone-400">GPay, PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'CARD'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-900 font-bold shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-700" />
                  <span className="text-xs">Debit / Credit</span>
                  <span className="text-[10px] text-stone-400">Visa, RuPay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NET_BANKING')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'NET_BANKING'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-900 font-bold shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-indigo-700" />
                  <span className="text-xs">Net Banking</span>
                  <span className="text-[10px] text-stone-400">All Major Banks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'COD'
                      ? 'border-amber-600 bg-amber-50/70 text-amber-900 font-bold shadow-xs'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-emerald-700" />
                  <span className="text-xs">Cash on Delivery</span>
                  <span className="text-[10px] text-stone-400">Pay at Door</span>
                </button>
              </div>

              {/* UPI Tab */}
              {paymentMethod === 'UPI' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-800">Scan QR Code or Enter VPA</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                      <Lock className="w-3 h-3" /> Real-time Verification
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col items-center shrink-0">
                      <div className="w-28 h-28 bg-stone-900 rounded p-1.5 flex items-center justify-center text-white">
                        <QrCode className="w-24 h-24 text-stone-100" />
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono mt-1">Scan via any UPI App</span>
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <label className="block text-xs font-semibold text-stone-700">
                        UPI ID / Virtual Payment Address
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@bank"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white outline-none font-mono"
                      />
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setUpiId('pawan2004xy@oksbi')}
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-200 hover:bg-stone-300 font-mono"
                        >
                          @oksbi
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiId('pawan2004xy@okhdfcbank')}
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-200 hover:bg-stone-300 font-mono"
                        >
                          @okhdfcbank
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiId('pawan2004xy@paytm')}
                          className="text-[10px] px-2 py-0.5 rounded bg-stone-200 hover:bg-stone-300 font-mono"
                        >
                          @paytm
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 pt-1">
                        Amount to authorize: <strong className="text-stone-900">{formatPrice(finalPayable)}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD Tab */}
              {paymentMethod === 'CARD' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-stone-200 text-xs font-bold text-stone-800">
                    <span>Card Information</span>
                    <span className="text-[10px] font-mono text-stone-400">Visa / Mastercard / RuPay</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white outline-none font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">Valid Thru</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NET BANKING Tab */}
              {paymentMethod === 'NET_BANKING' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <label className="block text-xs font-bold text-stone-800">
                    Choose Your Bank
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setSelectedBank(b)}
                        className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                          selectedBank === b
                            ? 'bg-amber-100 border-amber-600 text-amber-900 font-bold'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COD Tab */}
              {paymentMethod === 'COD' && (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-700">
                  <p className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    Pay upon Delivery at Doorstep
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Pay via Cash or UPI QR on the courier partner terminal upon delivery.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleInitiatePayment}
                className="w-full py-3.5 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>PAY & PLACE ORDER ({formatPrice(finalPayable)})</span>
              </button>
            </div>
          )}

          {/* STEP 3: 3D Secure OTP */}
          {step === 'otp' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">3D Secure Verified by Visa</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Please enter the demonstration security OTP sent to your registered phone.
              </p>
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-[0.5em] text-xl font-mono py-2.5 border-2 border-amber-600 rounded-lg outline-none font-bold"
                />
                <span className="text-[11px] text-stone-400 block mt-1">Pre-filled Demo OTP: 4892</span>
              </div>
              <button
                type="button"
                onClick={executeOrderCreation}
                className="w-full max-w-xs py-3 bg-stone-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                AUTHORIZE PAYMENT ({formatPrice(finalPayable)})
              </button>
            </div>
          )}

          {/* STEP 4: Processing */}
          {step === 'processing' && (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="font-bold text-base text-stone-900 font-serif-luxury">
                Connecting to Secure Bank Gateway...
              </h3>
              <p className="text-xs text-stone-500">
                Authorizing transaction. Please do not close or reload this window.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Item List */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4 sticky top-24">
          <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider text-[11px] text-stone-400">
            Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
          </h3>

          {/* Items Preview */}
          <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-800 truncate">{item.product.title}</p>
                    <p className="text-[10px] text-stone-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-stone-900 shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="pt-3 border-t border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Cart Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>Express Delivery</span>
              <span className="text-emerald-700 font-bold">FREE</span>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-extrabold text-stone-900">
              <span>Total Payable</span>
              <span className="text-amber-800 font-mono">{formatPrice(finalPayable)}</span>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
            <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              <span>Guaranteed Delivery within 3-4 Days</span>
            </div>
            <p>Full transit insurance and 7-day hassle-free replacement included.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
