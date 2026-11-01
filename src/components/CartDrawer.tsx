import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  ArrowRight,
  Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    setCurrentView,
    navigateToProduct,
    formatPrice
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!cartDrawerOpen) return null;

  // Calculate discount on MRP
  const totalMrp = cart.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
  const retailDiscount = totalMrp - cartSubtotal;
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, cartSubtotal - couponDiscount);
  const totalSavings = retailDiscount + couponDiscount;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput.trim());
    setCouponLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-base font-serif-luxury text-stone-900">
                Your Decor Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg font-serif-luxury text-stone-800 mb-1">
                Your bag is empty
              </h3>
              <p className="text-xs text-stone-500 mb-6 max-w-xs">
                Explore our curated ceramics, lighting, and textiles to adorn your sanctuary.
              </p>
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  setCurrentView('home');
                }}
                className="bg-stone-900 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg text-xs font-semibold transition-colors"
              >
                Start Exploring
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-stone-100">
              
              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 py-2 items-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      onClick={() => {
                        setCartDrawerOpen(false);
                        navigateToProduct(item.product.id);
                      }}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-100 cursor-pointer shrink-0 border border-stone-200"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 
                        onClick={() => {
                          setCartDrawerOpen(false);
                          navigateToProduct(item.product.id);
                        }}
                        className="text-xs font-semibold text-stone-800 truncate cursor-pointer hover:text-amber-700"
                      >
                        {item.product.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Color: {item.selectedColor || item.product.color}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-stone-600 hover:text-stone-900"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-stone-600 hover:text-stone-900"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price & Delete */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-stone-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Redemption Section */}
              <div className="pt-4">
                <p className="text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" /> Apply Discount Coupon
                </p>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-xs">
                    <div>
                      <div className="flex items-center gap-1 text-emerald-800 font-bold">
                        <Check className="w-3.5 h-3.5" /> {appliedCoupon.code} Applied
                      </div>
                      <p className="text-[11px] text-emerald-700">
                        Saved ${appliedCoupon.discountAmount} ({appliedCoupon.discountPercent}% off)
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-600 hover:underline font-semibold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. DECORIVA15 or FESTIVE25"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-lg uppercase tracking-wider outline-none focus:border-amber-600"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1.5">{couponError}</p>
                )}

                {/* Quick Coupon suggestions */}
                {!appliedCoupon && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setCouponInput('DECORIVA15')}
                      className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-mono hover:bg-amber-100"
                    >
                      DECORIVA15 (15% OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCouponInput('FESTIVE25')}
                      className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-mono hover:bg-amber-100"
                    >
                      FESTIVE25 (25% OFF)
                    </button>
                  </div>
                )}
              </div>

              {/* Flipkart-Style Price Breakdown */}
              <div className="pt-4 space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[10px]">
                  Price Details
                </h4>

                <div className="flex justify-between text-stone-600">
                  <span>Price ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>{formatPrice(totalMrp)}</span>
                </div>

                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount</span>
                  <span>-{formatPrice(retailDiscount)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>

                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-extrabold text-stone-900">
                  <span>Total Amount</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-2 rounded-lg text-center mt-2">
                    You will save {formatPrice(totalSavings)} on this order 🎉
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  onCheckout();
                }}
                className="w-full py-3.5 bg-stone-900 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted & 100% Payment Protected</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
