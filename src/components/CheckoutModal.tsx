import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote, 
  Lock, 
  CheckCircle, 
  ArrowLeft,
  QrCode,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { ShippingAddress, Order } from '../types';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    clearCart,
    showToast,
    pincode,
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
    landmark: 'Opposite City Center',
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

  if (!isOpen) return null;

  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPayable = Math.max(0, cartSubtotal - couponDiscount);

  // Address validation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName.trim() || !address.phone.trim() || !address.addressLine.trim() || !address.pincode.trim()) {
      setErrorMessage('Please fill in all mandatory shipping address fields.');
      return;
    }
    setErrorMessage('');
    setStep('payment');
  };

  // Payment initiation
  const handleInitiatePayment = () => {
    if (paymentMethod === 'CARD') {
      // Show 3D Secure Bank OTP screen simulation
      setStep('otp');
    } else {
      executeOrderCreation();
    }
  };

  const executeOrderCreation = async () => {
    setStep('processing');
    try {
      // Simulate gateway authorization delay
      await new Promise(r => setTimeout(r, 1600));

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

      // Trigger celebration fireworks confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      clearCart();
      showToast(`Order #${newOrder.orderNumber} placed successfully!`, 'success');
      onOrderSuccess(newOrder);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment authorization failed');
      setStep('payment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-lg font-serif-luxury text-stone-900">
              DECORIVA Secure Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between my-4 text-xs font-semibold text-stone-500">
          <div className={`flex items-center gap-1.5 ${step === 'address' ? 'text-amber-700 font-bold' : 'text-emerald-700'}`}>
            <span className="w-5 h-5 rounded-full bg-stone-100 border flex items-center justify-center text-[10px]">1</span>
            <span>Delivery Address</span>
          </div>
          <span className="h-px w-8 bg-stone-200" />
          <div className={`flex items-center gap-1.5 ${step === 'payment' || step === 'otp' ? 'text-amber-700 font-bold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-stone-100 border flex items-center justify-center text-[10px]">2</span>
            <span>Payment Gateway</span>
          </div>
          <span className="h-px w-8 bg-stone-200" />
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-stone-100 border flex items-center justify-center text-[10px]">3</span>
            <span>Confirmation</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: Address Form */}
        {step === 'address' && (
          <form onSubmit={handleProceedToPayment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Recipient Full Name *
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
                  Mobile Number (for delivery SMS & OTP) *
                </label>
                <input
                  type="text"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:border-amber-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Street Address / Apartment / Villa *
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
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:border-amber-600 outline-none"
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
                placeholder="e.g. Near City Mall"
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:border-amber-600 outline-none"
              />
            </div>

            {/* Order Items Preview */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <div className="flex justify-between font-semibold text-stone-800 pb-1 border-b border-stone-200">
                <span>Order Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="text-sm font-extrabold text-stone-900">{formatPrice(finalPayable)}</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium pt-1">
                Free Express Delivery Included • 7-Day Replacement Guarantee
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              CONTINUE TO PAYMENT ({formatPrice(finalPayable)})
            </button>
          </form>
        )}

        {/* STEP 2: Multi-Method Payment Gateway */}
        {step === 'payment' && (
          <div className="space-y-5">
            <button
              onClick={() => setStep('address')}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Address
            </button>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'UPI'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-900 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Smartphone className="w-5 h-5 text-amber-700" />
                <span className="text-xs font-bold">UPI / QR</span>
                <span className="text-[10px] text-stone-400">GPay, PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'CARD'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-900 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-700" />
                <span className="text-xs font-bold">Credit/Debit</span>
                <span className="text-[10px] text-stone-400">Visa, Master</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NET_BANKING')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'NET_BANKING'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-900 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Building2 className="w-5 h-5 text-emerald-700" />
                <span className="text-xs font-bold">NetBanking</span>
                <span className="text-[10px] text-stone-400">All Banks</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'COD'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-900 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold">Cash on Delivery</span>
                <span className="text-[10px] text-stone-400">Pay at Door</span>
              </button>
            </div>

            {/* Method Details Pane */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              
              {/* UPI Tab */}
              {paymentMethod === 'UPI' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                    <span className="text-xs font-bold text-stone-800">Scan QR or Enter UPI ID</span>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Instant Verification
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Simulated Dynamic QR Code */}
                    <div className="p-2.5 bg-white rounded-lg border border-stone-200 shadow-xs flex flex-col items-center shrink-0">
                      <div className="w-28 h-28 bg-stone-900 rounded p-1.5 flex items-center justify-center text-white">
                        <QrCode className="w-24 h-24 text-stone-100" />
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono mt-1">Scan via any UPI App</span>
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <label className="block text-xs font-semibold text-stone-700">
                        Virtual Payment Address (VPA / UPI ID)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white outline-none focus:border-amber-600 font-mono"
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
                    </div>
                  </div>
                </div>
              )}

              {/* CARD Tab */}
              {paymentMethod === 'CARD' && (
                <div className="space-y-3">
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
                        maxLength={4}
                        placeholder="•••"
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
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-stone-800">
                    Select Your Bank
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setSelectedBank(b)}
                        className={`p-2 rounded-lg border text-left font-medium transition-all ${
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
                <div className="space-y-2 text-xs text-stone-700">
                  <p className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-amber-600" />
                    Pay upon Delivery at Your Doorstep
                  </p>
                  <p className="text-[11px] text-stone-500">
                    You can pay using Cash, UPI QR on delivery agent device, or Debit Card when the package arrives.
                  </p>
                </div>
              )}
            </div>

            {/* Pay Action Button */}
            <button
              type="button"
              onClick={handleInitiatePayment}
              className="w-full py-3.5 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>PAY & PLACE ORDER ({formatPrice(finalPayable)})</span>
            </button>
          </div>
        )}

        {/* STEP 3: 3D Secure Bank OTP Simulator (Card verification) */}
        {step === 'otp' && (
          <div className="space-y-5 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-stone-900">3D Secure Verified by Visa</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                An authorization code was sent to the registered mobile number ending in <span className="font-semibold text-stone-800">43210</span>.
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-2">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center tracking-[0.5em] text-xl font-mono py-2.5 border-2 border-amber-600 rounded-lg outline-none font-bold"
              />
              <span className="text-[11px] text-stone-400 block">
                Demo OTP pre-filled: 4892
              </span>
            </div>

            <button
              type="button"
              onClick={executeOrderCreation}
              className="w-full py-3 bg-stone-900 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              AUTHORIZE PAYMENT ({formatPrice(finalPayable)})
            </button>
          </div>
        )}

        {/* STEP 4: Processing Animation */}
        {step === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="font-bold text-base text-stone-900 font-serif-luxury">
                Contacting Bank Gateway...
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Please do not refresh or close this browser window.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
