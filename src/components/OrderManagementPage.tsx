import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  MapPin, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';

export const OrderManagementPage: React.FC = () => {
  const { showToast, navigateToTrackOrder, formatPrice, setCurrentView } = useShop();
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
      console.error('Failed to load orders for management', err);
      showToast('Failed to load order management data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await api.updateOrderStatus(
        orderId, 
        newStatus, 
        `Milestone set to ${newStatus} by warehouse dispatch team`
      );
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast(`Order #${updated.orderNumber} updated to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // Metrics
  const totalOrders = orders.length;
  const pendingDispatch = orders.filter(o => o.status === 'PLACED' || o.status === 'PROCESSING').length;
  const inTransit = orders.filter(o => o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY').length;
  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchNumber = o.orderNumber.toLowerCase().includes(q);
      const matchCustomer = o.shippingAddress.fullName.toLowerCase().includes(q);
      const matchCity = o.shippingAddress.city.toLowerCase().includes(q);
      const matchAWB = o.trackingId.toLowerCase().includes(q);
      if (!matchNumber && !matchCustomer && !matchCity && !matchAWB) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold font-serif-luxury text-stone-900">
              Order & Shipment Management
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Seller & warehouse operations: Update milestones, dispatch orders, review customer shipping destinations, and generate tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadOrders()}
            className="p-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl transition-colors"
            title="Refresh order database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentView('admin')}
            className="px-4 py-2 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Admin Sales Dashboard</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-1 text-xs font-semibold uppercase">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-stone-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900 font-serif-luxury">{totalOrders}</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Recorded across database</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600 mb-1 text-xs font-semibold uppercase">
            <span>Pending Dispatch</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900 font-serif-luxury">{pendingDispatch}</p>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Requires packing & pickup</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-blue-600 mb-1 text-xs font-semibold uppercase">
            <span>In Transit</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900 font-serif-luxury">{inTransit}</p>
          <p className="text-[11px] text-blue-700 font-medium mt-0.5">With SwiftExpress courier</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600 mb-1 text-xs font-semibold uppercase">
            <span>Delivered</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900 font-serif-luxury">{deliveredCount}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Customer verified arrival</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search order #, customer, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-amber-600 bg-stone-50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {['ALL', 'PLACED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st === 'ALL' ? 'All' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-stone-500">Querying database collection...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-stone-500">
            No matching orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3.5">Order Details</th>
                  <th className="p-3.5">Customer & Phone</th>
                  <th className="p-3.5">Shipping Destination</th>
                  <th className="p-3.5">Amount & Mode</th>
                  <th className="p-3.5">Current Milestone</th>
                  <th className="p-3.5 text-right">Dispatch Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* Order Details */}
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-stone-900">{o.orderNumber}</span>
                      <span className="block text-[10px] text-stone-400 font-mono">AWB: {o.trackingId}</span>
                      <span className="text-[10px] text-stone-500">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="p-3.5">
                      <p className="font-semibold text-stone-800">{o.shippingAddress.fullName}</p>
                      <p className="text-[10px] text-stone-500 font-mono">{o.shippingAddress.phone}</p>
                    </td>

                    {/* Destination */}
                    <td className="p-3.5 text-stone-600 max-w-xs">
                      <p className="truncate font-medium text-stone-800">{o.shippingAddress.city}, {o.shippingAddress.state}</p>
                      <p className="text-[10px] text-stone-400 truncate">{o.shippingAddress.addressLine} - {o.shippingAddress.pincode}</p>
                    </td>

                    {/* Amount & Payment */}
                    <td className="p-3.5">
                      <span className="font-bold text-stone-900 font-mono">{formatPrice(o.totalAmount)}</span>
                      <span className="block text-[10px] text-stone-400">
                        {o.paymentMethod} • <strong className={o.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}>{o.paymentStatus}</strong>
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        o.status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'OUT_FOR_DELIVERY'
                          ? 'bg-blue-100 text-blue-800'
                          : o.status === 'SHIPPED'
                          ? 'bg-indigo-100 text-indigo-800'
                          : o.status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Action Select & Buttons */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          className="border border-stone-200 rounded-lg px-2 py-1 text-xs bg-white text-stone-800 outline-none font-semibold focus:border-amber-600"
                        >
                          <option value="PLACED">Placed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>

                        <button
                          onClick={() => setSelectedInvoiceOrder(o)}
                          className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded-md"
                          title="View Tax Invoice"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigateToTrackOrder(o.orderNumber)}
                          className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-stone-100 rounded-md"
                          title="View Customer Tracking GPS View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-lg font-serif-luxury text-stone-900">
                  Customer Tax Invoice: {selectedInvoiceOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="text-stone-400 hover:text-stone-900 p-1"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-stone-700">
              <div className="flex justify-between items-start pb-2 border-b border-stone-100">
                <div>
                  <h4 className="font-bold text-stone-900">DECORIVA HOME DECOR</h4>
                  <p className="text-stone-400 text-[10px]">GSTIN: 07AAACA1234F1Z8</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-stone-900">Invoice #{selectedInvoiceOrder.orderNumber}</p>
                  <p className="text-stone-400">{new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-100 grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-stone-500 uppercase text-[10px] block">Customer:</span>
                  <p className="font-semibold">{selectedInvoiceOrder.shippingAddress.fullName}</p>
                  <p>{selectedInvoiceOrder.shippingAddress.addressLine}, {selectedInvoiceOrder.shippingAddress.city}</p>
                  <p>Ph: {selectedInvoiceOrder.shippingAddress.phone}</p>
                </div>
                <div>
                  <span className="font-bold text-stone-500 uppercase text-[10px] block">Logistics:</span>
                  <p>Courier: {selectedInvoiceOrder.carrier}</p>
                  <p className="font-mono">AWB: {selectedInvoiceOrder.trackingId}</p>
                  <p>Mode: {selectedInvoiceOrder.paymentMethod} ({selectedInvoiceOrder.paymentStatus})</p>
                </div>
              </div>

              <table className="w-full text-left border-collapse mt-2">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px]">
                    <th className="py-1.5">Item</th>
                    <th className="py-1.5 text-center">Qty</th>
                    <th className="py-1.5 text-right">Price</th>
                    <th className="py-1.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {selectedInvoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-1.5 font-medium">{it.product.title}</td>
                      <td className="py-1.5 text-center">{it.quantity}</td>
                      <td className="py-1.5 text-right font-mono">{formatPrice(it.product.price)}</td>
                      <td className="py-1.5 text-right font-mono font-bold">{formatPrice(it.product.price * it.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-2 border-t border-stone-200 text-right space-y-1">
                <p>Subtotal: <span className="font-mono">{formatPrice(selectedInvoiceOrder.subtotal)}</span></p>
                <p className="font-bold text-sm text-stone-900">
                  Total Paid: <span className="font-mono text-amber-800">{formatPrice(selectedInvoiceOrder.totalAmount)}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-stone-200 hover:border-amber-600 rounded-lg text-xs font-semibold"
              >
                Print
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
