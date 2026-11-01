import React from 'react';
import { CheckCircle2, Package, ArrowRight, Truck, FileText, X } from 'lucide-react';
import { Order } from '../types';
import { useShop } from '../context/ShopContext';

interface OrderSuccessModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const { navigateToTrackOrder, setCurrentView } = useShop();

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-center animate-in fade-in zoom-in-95 duration-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-[11px] uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Payment Confirmed
        </span>

        <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-stone-900 mt-2 mb-1">
          Thank You For Your Order!
        </h2>
        <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
          Your order has been recorded in the central dispatch system and is being prepped for dispatch.
        </p>

        {/* Order Details Card */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left text-xs space-y-2 mb-6">
          <div className="flex justify-between pb-2 border-b border-stone-200">
            <span className="text-stone-500">Order Reference</span>
            <span className="font-mono font-bold text-stone-900">{order.orderNumber}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-stone-200">
            <span className="text-stone-500">Logistics Tracking</span>
            <span className="font-mono text-stone-700 font-semibold">{order.trackingId}</span>
          </div>

          <div className="flex justify-between pb-2 border-b border-stone-200">
            <span className="text-stone-500">Delivering To</span>
            <span className="font-medium text-stone-900">{order.shippingAddress.fullName} ({order.shippingAddress.pincode})</span>
          </div>

          <div className="flex justify-between pt-1">
            <span className="text-stone-500">Amount Paid</span>
            <span className="font-extrabold text-stone-900 text-sm">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              navigateToTrackOrder(order.orderNumber);
            }}
            className="flex-1 py-3 px-4 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>TRACK SHIPMENT LIVE</span>
          </button>

          <button
            onClick={() => {
              onClose();
              setCurrentView('home');
            }}
            className="py-3 px-4 border border-stone-200 hover:border-stone-400 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
