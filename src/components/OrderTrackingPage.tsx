import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle, 
  XCircle, 
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Calendar,
  ExternalLink,
  Printer,
  X
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';

export const OrderTrackingPage: React.FC = () => {
  const { activeTrackQuery, navigateToProduct, showToast, setCurrentView, formatPrice } = useShop();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState(activeTrackQuery || '');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    loadOrders();
  }, [activeTrackQuery]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await api.getOrders();
      setOrders(allOrders);

      if (activeTrackQuery) {
        const found = allOrders.find(
          o => o.orderNumber.toLowerCase() === activeTrackQuery.toLowerCase() ||
               o.trackingId.toLowerCase() === activeTrackQuery.toLowerCase() ||
               o.id.toLowerCase() === activeTrackQuery.toLowerCase()
        );
        if (found) {
          setSelectedOrder(found);
        } else if (allOrders.length > 0) {
          setSelectedOrder(allOrders[0]);
        }
      } else if (allOrders.length > 0) {
        setSelectedOrder(allOrders[0]);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const found = await api.getOrderByIdOrTracking(searchQuery.trim());
      if (found) {
        setSelectedOrder(found);
        showToast(`Located Order #${found.orderNumber}`, 'success');
      } else {
        showToast('No order matching that ID or Tracking code', 'error');
      }
    } catch (err) {
      showToast('Order not found', 'error');
    }
  };

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleCancelOrder = async (orderId: string) => {
    try {
      const updated = await api.cancelOrder(orderId);
      setSelectedOrder(updated);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast('Order cancelled successfully', 'info');
    } catch (err: any) {
      showToast(err.message || 'Cannot cancel this order', 'error');
    }
  };

  const handlePrintInvoice = (order: Order) => {
    setShowInvoiceModal(true);
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'ALL') return true;
    return o.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      
      {/* Page Title & Search Header */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
            <Truck className="w-3.5 h-3.5" />
            Flipkart-Grade Live Logistics Tracker
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-luxury tracking-tight mb-2">
            Track Your Home Decor Package
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm font-light mb-6">
            Enter your Order ID (e.g. <span className="text-amber-300 font-mono font-medium">AL-98241</span>) or Air Cargo Tracking ID to inspect real-time dispatch milestones.
          </p>

          <form onSubmit={handleSearchOrder} className="flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order # or Tracking ID..."
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-stone-800 text-white placeholder:text-stone-400 border border-stone-700 rounded-xl outline-none focus:border-amber-400 font-mono"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
            >
              Track
            </button>
          </form>
        </div>

        {/* Decorative background watermark */}
        <Package className="w-96 h-96 absolute -right-20 -bottom-24 text-stone-800/40 pointer-events-none" />
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Retrieving satellite tracking coordinates...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-xs">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-3" />
          <h3 className="font-bold text-lg font-serif-luxury text-stone-900 mb-1">No Orders Found</h3>
          <p className="text-xs text-stone-500 mb-6 max-w-sm mx-auto">
            You haven't placed any orders yet. Explore our handcrafted pieces to bring your space to life.
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition-colors"
          >
            Start Decor Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Orders Selector List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm font-serif-luxury text-stone-900">
                Order History ({orders.length})
              </h3>
              
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-stone-200 rounded-lg px-2 py-1 bg-white text-stone-600 outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                <option value="DELIVERED">Delivered</option>
                <option value="PROCESSING">Processing</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/50 shadow-md ring-1 ring-amber-600/20'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                      <span className="font-mono font-bold text-xs text-stone-900">
                        {order.orderNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'OUT_FOR_DELIVERY'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2 shrink-0">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-2xs"
                          />
                        ))}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-stone-800 truncate">
                          {order.items[0]?.product.title}
                          {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          ${order.totalAmount.toFixed(2)} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Live Tracking Progress & Timeline */}
          {selectedOrder && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Order Status Header Card */}
              <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold font-serif-luxury text-stone-900">
                        Order #{selectedOrder.orderNumber}
                      </h2>
                      <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                        {selectedOrder.trackingId}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-amber-600" />
                      Shipped via <span className="font-semibold text-stone-800">{selectedOrder.carrier}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handlePrintInvoice(selectedOrder)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 hover:border-amber-600 text-stone-700 hover:text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Invoice PDF
                    </button>

                    {selectedOrder.status !== 'DELIVERED' && selectedOrder.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Delivery Date Highlight */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-amber-700" />
                    <div>
                      <p className="text-[11px] text-amber-800 uppercase tracking-wider font-semibold">
                        Expected Delivery Milestone
                      </p>
                      <p className="text-sm font-bold text-stone-900">
                        {selectedOrder.expectedDeliveryDate}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-stone-600">
                    Payment: <span className="font-mono text-stone-900 font-bold">{selectedOrder.paymentMethod}</span>
                  </span>
                </div>

                {/* Flipkart Interactive Vertical Timeline */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
                    Milestone Progress Tracker
                  </h4>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                    {selectedOrder.timeline.map((step, idx) => {
                      const isComplete = step.completed;
                      const isCurrent = isComplete && (idx === selectedOrder.timeline.length - 1 || !selectedOrder.timeline[idx + 1]?.completed);
                      
                      return (
                        <div key={idx} className="relative flex items-start gap-4">
                          {/* Circle Dot indicator */}
                          <div
                            className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                              isComplete
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'bg-white border-stone-300 text-transparent'
                            } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className={`text-xs font-bold ${isComplete ? 'text-stone-900' : 'text-stone-400'}`}>
                                {step.title}
                              </h5>
                              <span className="text-[11px] text-stone-400 font-mono">
                                {step.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-stone-600 mt-0.5">
                              {step.description}
                            </p>
                            {step.location && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1 font-medium">
                                <MapPin className="w-2.5 h-2.5" /> {step.location}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Transit Map Checkpoints Visualizer */}
                <div className="pt-4 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" /> Live Transit Route Map
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      GPS Active
                    </span>
                  </div>

                  {/* Stylized Route Map Graphics */}
                  <div className="bg-stone-900 rounded-xl p-4 text-stone-300 relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs relative z-10">
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1 border border-emerald-500/40">
                          ✓
                        </div>
                        <p className="font-semibold text-white">Warehouse Hub</p>
                        <p className="text-[10px] text-stone-400">Gurugram</p>
                      </div>

                      <div className="flex-1 px-4 text-center">
                        <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-stone-700 relative">
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center animate-pulse shadow-md">
                            <Truck className="w-2.5 h-2.5" />
                          </div>
                        </div>
                        <p className="text-[10px] text-amber-300 mt-2 font-mono">In Transit • Flight BD-402</p>
                      </div>

                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-stone-700 text-stone-400 flex items-center justify-center mx-auto mb-1 border border-stone-600">
                          📍
                        </div>
                        <p className="font-semibold text-white">{selectedOrder.shippingAddress.city}</p>
                        <p className="text-[10px] text-stone-400">{selectedOrder.shippingAddress.pincode}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Order Items & Recipient Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-5 border border-stone-200 text-xs space-y-2">
                  <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[10px] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> Delivery Address
                  </h4>
                  <p className="font-bold text-stone-900 text-sm">
                    {selectedOrder.shippingAddress.fullName}
                  </p>
                  <p className="text-stone-600 leading-relaxed">
                    {selectedOrder.shippingAddress.addressLine}
                    {selectedOrder.shippingAddress.landmark && `, ${selectedOrder.shippingAddress.landmark}`}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p className="text-stone-700 font-semibold pt-1">
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                </div>

                {/* Payment Breakdown */}
                <div className="bg-white rounded-2xl p-5 border border-stone-200 text-xs space-y-2">
                  <h4 className="font-bold uppercase tracking-wider text-stone-400 text-[10px] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Payment & Billing
                  </h4>
                  <div className="flex justify-between text-stone-600">
                    <span>Items Total ({selectedOrder.items.length})</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Coupon Discount</span>
                      <span>-{formatPrice(selectedOrder.couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping Fee</span>
                    <span className="text-emerald-700 font-bold">FREE</span>
                  </div>
                  <div className="border-t border-stone-100 pt-2 flex justify-between font-bold text-stone-900 text-sm">
                    <span>Total Paid</span>
                    <span>{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

              </div>

              {/* Items in this shipment */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Items in this Shipment ({selectedOrder.items.length})
                </h4>

                <div className="divide-y divide-stone-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          onClick={() => navigateToProduct(item.product.id)}
                          className="w-14 h-14 rounded-lg object-cover bg-stone-100 cursor-pointer border border-stone-200"
                        />
                        <div>
                          <h5 
                            onClick={() => navigateToProduct(item.product.id)}
                            className="text-xs font-semibold text-stone-800 hover:text-amber-700 cursor-pointer"
                          >
                            {item.product.title}
                          </h5>
                          <p className="text-[11px] text-stone-400">
                            Qty: {item.quantity} • Color: {item.selectedColor || item.product.color}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-stone-900 shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* In-App Tax Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-lg font-serif-luxury text-stone-900">
                  Official Tax Invoice
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-extrabold font-serif-luxury text-stone-900">DECORIVA HOME DECOR</h4>
                  <p className="text-stone-500">Artisanal Living & AI Architecture Private Limited</p>
                  <p className="text-stone-400 text-[10px]">GSTIN: 07AAACA1234F1Z8 • Authorized Partner</p>
                </div>
                <div className="text-right">
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">TAX INVOICE</span>
                  <p className="font-mono font-bold text-stone-900 mt-1">Invoice #: {selectedOrder.orderNumber}</p>
                  <p className="text-stone-500 text-[11px]">Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3.5 bg-stone-50 rounded-xl border border-stone-100">
                <div>
                  <p className="font-bold text-stone-800 uppercase tracking-wider text-[10px] text-stone-400">Shipped To:</p>
                  <p className="font-semibold text-stone-900 mt-0.5">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-stone-600">{selectedOrder.shippingAddress.addressLine}</p>
                  <p className="text-stone-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                  <p className="text-stone-500 mt-0.5">Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>
                <div>
                  <p className="font-bold text-stone-800 uppercase tracking-wider text-[10px] text-stone-400">Logistics & Billing:</p>
                  <p className="text-stone-700 mt-0.5"><span className="text-stone-400">Carrier:</span> {selectedOrder.carrier}</p>
                  <p className="text-stone-700 font-mono text-[11px]"><span className="text-stone-400">AWB Track:</span> {selectedOrder.trackingId}</p>
                  <p className="text-stone-700"><span className="text-stone-400">Mode:</span> {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})</p>
                </div>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Unit Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2">
                        <span className="font-semibold text-stone-800">{item.product.title}</span>
                        <span className="block text-[10px] text-stone-400">Color: {item.selectedColor || item.product.color}</span>
                      </td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right font-mono">{formatPrice(item.product.price)}</td>
                      <td className="py-2 text-right font-mono font-bold">{formatPrice(item.product.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-stone-200 pt-3 space-y-1 text-right">
                <p className="text-stone-600">Subtotal: <span className="font-mono">{formatPrice(selectedOrder.subtotal)}</span></p>
                {selectedOrder.couponDiscount > 0 && (
                  <p className="text-emerald-700">Coupon Discount ({selectedOrder.couponCode}): <span className="font-mono">-{formatPrice(selectedOrder.couponDiscount)}</span></p>
                )}
                <p className="text-stone-600">Delivery Fee: <span className="text-emerald-700 font-bold">FREE</span></p>
                <p className="text-sm font-extrabold text-stone-900 pt-1">
                  Total Paid: <span className="font-mono text-amber-800">{formatPrice(selectedOrder.totalAmount)}</span>
                </p>
              </div>

              <p className="text-center text-[10px] text-stone-400 pt-3 border-t border-stone-100">
                This is a verified computer generated invoice. Built for college project e-commerce evaluation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
