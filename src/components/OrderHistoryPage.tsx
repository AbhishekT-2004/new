import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  FileText, 
  ArrowRight, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Banknote,
  Search,
  Filter,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';

export const OrderHistoryPage: React.FC = () => {
  const { 
    navigateToProduct, 
    navigateToTrackOrder, 
    setCurrentView, 
    formatPrice, 
    addToCart, 
    showToast 
  } = useShop();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
      showToast('Failed to load order history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchNumber = o.orderNumber.toLowerCase().includes(q);
      const matchTrack = o.trackingId.toLowerCase().includes(q);
      const matchItem = o.items.some(i => i.product.title.toLowerCase().includes(q));
      if (!matchNumber && !matchTrack && !matchItem) return false;
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full"><CheckCircle className="w-3 h-3" /> Delivered</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full"><Truck className="w-3 h-3" /> Out for Delivery</span>;
      case 'SHIPPED':
        return <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full"><Package className="w-3 h-3" /> Shipped</span>;
      case 'PROCESSING':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Processing</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">Order Placed</span>;
    }
  };

  const getPaymentIcon = (method: Order['paymentMethod']) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="w-3.5 h-3.5 text-amber-600" />;
      case 'CARD':
        return <CreditCard className="w-3.5 h-3.5 text-blue-600" />;
      case 'NET_BANKING':
        return <Building2 className="w-3.5 h-3.5 text-indigo-600" />;
      case 'COD':
        return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl font-bold font-serif-luxury text-stone-900">
              Orders & Payment History
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Review past purchases, download GST tax invoices, and track live deliveries in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('shop')}
            className="px-4 py-2 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Explore Decor Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Order #, Item, or AWB..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-amber-600 bg-stone-50"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {['ALL', 'PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st === 'ALL' ? 'All Orders' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Retrieving encrypted order records...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 max-w-md mx-auto my-6">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-serif-luxury text-stone-900 mb-1">
            No Orders Found
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            {searchTerm || statusFilter !== 'ALL'
              ? 'No orders match your filter criteria. Try adjusting the search term.'
              : "You haven't placed any orders yet. Discover our handcrafted home decor pieces today."}
          </p>
          <button
            onClick={() => setCurrentView('shop')}
            className="w-full py-2.5 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            Start Decor Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden hover:border-amber-400/80 transition-all"
            >
              {/* Order Card Header */}
              <div className="bg-stone-50/80 px-5 py-3.5 border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">ORDER PLACED</span>
                    <span className="font-semibold text-stone-800">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="hidden sm:block h-6 w-px bg-stone-200" />

                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">TOTAL PAID</span>
                    <span className="font-extrabold text-stone-900 font-mono">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>

                  <div className="hidden sm:block h-6 w-px bg-stone-200" />

                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">SHIP TO</span>
                    <span className="font-semibold text-stone-800">
                      {order.shippingAddress.fullName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">ORDER # {order.orderNumber}</span>
                    <span className="font-mono text-[11px] text-stone-500">AWB: {order.trackingId}</span>
                  </div>
                  <button
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className="px-3 py-1.5 border border-stone-200 hover:border-amber-600 bg-white hover:bg-amber-50/40 text-stone-700 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tax Invoice</span>
                  </button>
                </div>
              </div>

              {/* Order Card Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-stone-500">
                      {order.status === 'DELIVERED'
                        ? 'Package was handed directly to recipient'
                        : `Estimated delivery by ${order.expectedDeliveryDate}`}
                    </span>
                  </div>

                  {/* Payment Info Badge */}
                  <div className="flex items-center gap-1.5 bg-stone-100 px-2.5 py-1 rounded-md text-xs text-stone-700 font-medium">
                    {getPaymentIcon(order.paymentMethod)}
                    <span>Payment: <strong className="font-bold">{order.paymentMethod}</strong></span>
                    <span className="text-stone-400">•</span>
                    <span className={order.paymentStatus === 'PAID' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          onClick={() => navigateToProduct(item.product.id)}
                          className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200 cursor-pointer shrink-0 hover:opacity-90"
                        />
                        <div className="min-w-0">
                          <h4
                            onClick={() => navigateToProduct(item.product.id)}
                            className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-amber-700 cursor-pointer line-clamp-1"
                          >
                            {item.product.title}
                          </h4>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            Category: {item.product.category} • Color: {item.selectedColor || item.product.color}
                          </p>
                          <p className="text-xs font-bold text-stone-800 mt-1">
                            {formatPrice(item.product.price)} × {item.quantity} = <span className="font-mono">{formatPrice(item.product.price * item.quantity)}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                        <button
                          onClick={() => {
                            addToCart(item.product, 1);
                            showToast(`Added ${item.product.title} to bag!`, 'success');
                          }}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Buy Again</span>
                        </button>

                        <button
                          onClick={() => navigateToProduct(item.product.id)}
                          className="px-3 py-1.5 border border-stone-200 hover:border-amber-600 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          View Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="text-stone-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Courier: {order.carrier} (Verified GPS dispatch)</span>
                  </div>

                  <button
                    onClick={() => navigateToTrackOrder(order.orderNumber)}
                    className="px-4 py-2 bg-stone-900 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Live GPS Tracking</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-lg font-serif-luxury text-stone-900">
                  Official Tax Invoice
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="text-stone-400 hover:text-stone-900 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-stone-700">
              <div className="flex justify-between items-start pb-3 border-b border-stone-100">
                <div>
                  <h4 className="font-extrabold text-base font-serif-luxury text-stone-900">
                    DECORIVA HOME DECOR
                  </h4>
                  <p className="text-stone-500">Artisanal Living & AI Architecture Private Limited</p>
                  <p className="text-stone-400 text-[10px]">GSTIN: 07AAACA1234F1Z8 • Certified Retailer</p>
                </div>
                <div className="text-right">
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">GST TAX INVOICE</span>
                  <p className="font-mono font-bold text-stone-900 mt-1">Invoice #: {selectedInvoiceOrder.orderNumber}</p>
                  <p className="text-stone-500 text-[11px]">Date: {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-3.5 bg-stone-50 rounded-xl border border-stone-100">
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px] text-stone-400">Shipped To:</p>
                  <p className="font-semibold text-stone-900 mt-0.5">{selectedInvoiceOrder.shippingAddress.fullName}</p>
                  <p className="text-stone-600">{selectedInvoiceOrder.shippingAddress.addressLine}</p>
                  <p className="text-stone-600">{selectedInvoiceOrder.shippingAddress.city}, {selectedInvoiceOrder.shippingAddress.state} - {selectedInvoiceOrder.shippingAddress.pincode}</p>
                  <p className="text-stone-500 mt-0.5">Phone: {selectedInvoiceOrder.shippingAddress.phone}</p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px] text-stone-400">Logistics & Payment:</p>
                  <p className="text-stone-700 mt-0.5"><span className="text-stone-400">Carrier:</span> {selectedInvoiceOrder.carrier}</p>
                  <p className="text-stone-700 font-mono text-[11px]"><span className="text-stone-400">AWB:</span> {selectedInvoiceOrder.trackingId}</p>
                  <p className="text-stone-700"><span className="text-stone-400">Method:</span> {selectedInvoiceOrder.paymentMethod} ({selectedInvoiceOrder.paymentStatus})</p>
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
                  {selectedInvoiceOrder.items.map((item, idx) => (
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
                <p className="text-stone-600">Subtotal: <span className="font-mono">{formatPrice(selectedInvoiceOrder.subtotal)}</span></p>
                {selectedInvoiceOrder.couponDiscount > 0 && (
                  <p className="text-emerald-700">Coupon Discount ({selectedInvoiceOrder.couponCode}): <span className="font-mono">-{formatPrice(selectedInvoiceOrder.couponDiscount)}</span></p>
                )}
                <p className="text-stone-600">Delivery Fee: <span className="text-emerald-700 font-bold">FREE</span></p>
                <p className="text-sm font-extrabold text-stone-900 pt-1">
                  Total Paid: <span className="font-mono text-amber-800">{formatPrice(selectedInvoiceOrder.totalAmount)}</span>
                </p>
              </div>

              <p className="text-center text-[10px] text-stone-400 pt-3 border-t border-stone-100">
                Official computer-generated tax invoice. Verified for college e-commerce project demonstration.
              </p>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-stone-200 hover:border-amber-600 text-stone-700 rounded-lg text-xs font-semibold"
              >
                Print Invoice
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
