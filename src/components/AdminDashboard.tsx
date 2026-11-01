import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertTriangle, 
  Truck, 
  Search, 
  RefreshCw,
  X,
  Eye
} from 'lucide-react';
import { Product, Order, SalesAnalytics } from '../types';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/mockProducts';

export const AdminDashboard: React.FC = () => {
  const { showToast, navigateToTrackOrder, formatPrice } = useShop();

  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders'>('analytics');
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Inventory filtering & modal
  const [inventorySearch, setInventorySearch] = useState('');
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form
  const [newProduct, setNewProduct] = useState({
    title: '',
    subtitle: '',
    category: 'Vases & Planters',
    price: 99,
    originalPrice: 159,
    discountPercent: 38,
    stockQuantity: 15,
    inStock: true,
    material: 'Ceramic Stoneware',
    color: 'Ivory Cream',
    dimensions: '10" D x 18" H',
    deliveryDays: 3,
    warranty: '1 Year Brand Guarantee',
    description: 'Artisanal architectural home decor piece handcrafted with timeless aesthetics.',
    images: [
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=85'
    ]
  });

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsData, prods, ords] = await Promise.all([
        api.getAnalytics(),
        api.getProducts(),
        api.getOrders()
      ]);
      setAnalytics(analyticsData);
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = async (product: Product, delta: number) => {
    const newQty = Math.max(0, product.stockQuantity + delta);
    try {
      const updated = await api.updateProduct(product.id, {
        stockQuantity: newQty,
        inStock: newQty > 0
      });
      setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
      showToast(`Updated "${product.title}" stock to ${newQty}`, 'success');
    } catch (err: any) {
      showToast('Failed to update stock', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const ok = await api.deleteProduct(id);
      if (ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Product removed from catalog', 'info');
      }
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createProduct({
        ...newProduct,
        rating: 4.8,
        reviewCount: 1,
        freeDelivery: true,
        highlights: [
          'Handcrafted with premium materials',
          'Eco-friendly low-emission glazing',
          'Felt protective pads included'
        ],
        specifications: {
          'Material': newProduct.material,
          'Dimensions': newProduct.dimensions,
          'Color': newProduct.color,
          'Warranty': newProduct.warranty
        }
      });
      setProducts([created, ...products]);
      setAddProductModalOpen(false);
      showToast(`Product "${created.title}" added to catalog!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, `Milestone updated to ${newStatus} by warehouse dispatch team`);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast(`Order #${updated.orderNumber} status changed to ${newStatus}`, 'success');
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    p.category.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      
      {/* Header with Title and Mode Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs">
              ADMIN
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-stone-900">
              DECORIVA Merchant Console
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time Sales Analytics, Inventory Control, and Order Logistics Dispatch Center
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <span>Sales Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'inventory'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Aggregating MongoDB collection records...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: SALES ANALYTICS */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-8">
              
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-luxury">
                    {formatPrice(analytics.totalRevenue)}
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +18.4% vs last month
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-luxury">
                    {analytics.totalOrders}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Avg Order Value: <span className="font-bold text-stone-800">{formatPrice(analytics.averageOrderValue)}</span>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Customers</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-luxury">
                    {analytics.totalCustomers}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Active Indian Metro Buyers
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Conversion Rate</span>
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif-luxury">
                    {analytics.conversionRate}%
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                    Industry benchmark: 2.1%
                  </p>
                </div>
              </div>

              {/* Monthly Revenue Chart & Category Sales Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Monthly Revenue Bar Chart Simulation */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-sm font-serif-luxury text-stone-900">
                        Monthly Revenue Growth
                      </h4>
                      <p className="text-xs text-stone-500">Trailing 6-month gross transaction value</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      +28.4% YoY
                    </span>
                  </div>

                  <div className="h-64 flex items-end justify-between gap-3 pt-6 border-b border-stone-100">
                    {analytics.monthlyRevenue.map((m) => {
                      const maxRev = 18000;
                      const heightPercent = Math.min(100, Math.round((m.revenue / maxRev) * 100));
                      return (
                        <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] font-mono text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            ${m.revenue}
                          </span>
                          <div
                            className="w-full max-w-[48px] bg-stone-900 group-hover:bg-amber-600 rounded-t-lg transition-all"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-xs font-semibold text-stone-700 mt-1">
                            {m.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Revenue Distribution */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
                  <h4 className="font-bold text-sm font-serif-luxury text-stone-900">
                    Category Breakdown
                  </h4>

                  <div className="space-y-3">
                    {analytics.categoryBreakdown.map((cat) => (
                      <div key={cat.category} className="space-y-1 text-xs">
                        <div className="flex justify-between font-medium">
                          <span className="text-stone-700">{cat.category}</span>
                          <span className="text-stone-900 font-bold">${cat.sales.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-600 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(15, (cat.sales / 12000) * 100))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Top Selling Products */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
                <h4 className="font-bold text-sm font-serif-luxury text-stone-900 mb-4">
                  Top Performing Pieces
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analytics.topProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                      <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-semibold text-stone-800 truncate">{p.title}</h5>
                        <p className="text-[11px] text-stone-500">{p.unitsSold} units sold</p>
                        <p className="text-xs font-bold text-amber-700 mt-0.5">${p.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Filter inventory by title or category..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl outline-none focus:border-amber-600"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadAllAdminData()}
                    className="p-2 border border-stone-200 rounded-xl hover:bg-stone-50 text-stone-600"
                    title="Reload data"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setAddProductModalOpen(true)}
                    className="px-4 py-2 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Decor Product</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="p-3.5">Product</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Price / MRP</th>
                        <th className="p-3.5">Stock Level</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="p-3.5 flex items-center gap-3">
                            <img src={p.images[0]} alt={p.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-semibold text-stone-900 truncate">{p.title}</p>
                              <p className="text-[10px] text-stone-400">ID: {p.id}</p>
                            </div>
                          </td>
                          <td className="p-3.5 text-stone-600">{p.category}</td>
                          <td className="p-3.5">
                            <span className="font-bold text-stone-900">{formatPrice(p.price)}</span>
                            <span className="text-stone-400 line-through ml-1 text-[11px]">{formatPrice(p.originalPrice)}</span>
                          </td>
                          <td className="p-3.5">
                            {/* Stock Stepper */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleStockChange(p, -1)}
                                className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-stone-900 w-6 text-center">
                                {p.stockQuantity}
                              </span>
                              <button
                                onClick={() => handleStockChange(p, 1)}
                                className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              p.stockQuantity === 0
                                ? 'bg-rose-100 text-rose-800'
                                : p.stockQuantity <= 5
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {p.stockQuantity === 0 ? 'Out of Stock' : p.stockQuantity <= 5 ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ORDER MANAGEMENT & LOGISTICS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                  <h4 className="font-bold text-sm font-serif-luxury text-stone-900">
                    Live Dispatch & Order Management
                  </h4>
                  <p className="text-xs text-stone-500">
                    Change status below to instantly update the customer tracking timeline
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="p-3.5">Order #</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Destination</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Tracking Status</th>
                        <th className="p-3.5 text-right">Dispatch Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="p-3.5">
                            <span className="font-mono font-bold text-stone-900">{o.orderNumber}</span>
                            <span className="block text-[10px] text-stone-400 font-mono">{o.trackingId}</span>
                          </td>
                          <td className="p-3.5">
                            <p className="font-semibold text-stone-800">{o.shippingAddress.fullName}</p>
                            <p className="text-[10px] text-stone-500">{o.shippingAddress.phone}</p>
                          </td>
                          <td className="p-3.5 text-stone-600">
                            {o.shippingAddress.city}, {o.shippingAddress.pincode}
                          </td>
                          <td className="p-3.5 font-bold text-stone-900 font-mono">
                            {formatPrice(o.totalAmount)}
                            <span className="block text-[10px] font-normal text-stone-400 font-sans">{o.paymentMethod}</span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              o.status === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : o.status === 'OUT_FOR_DELIVERY'
                                ? 'bg-blue-100 text-blue-800'
                                : o.status === 'CANCELLED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}>
                              {o.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                className="border border-stone-200 rounded-lg px-2 py-1 text-xs bg-white text-stone-700 outline-none"
                              >
                                <option value="PLACED">Placed</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </select>

                              <button
                                onClick={() => navigateToTrackOrder(o.orderNumber)}
                                className="p-1.5 text-stone-500 hover:text-amber-700"
                                title="View Customer Tracker"
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
              </div>
            </div>
          )}

        </>
      )}

      {/* Add New Product Modal */}
      {addProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="font-bold text-lg font-serif-luxury text-stone-900">
                Add New Decor Item
              </h3>
              <button onClick={() => setAddProductModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. Sculptural Travertine Bookends (Set of 2)"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={newProduct.subtitle}
                  onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                  placeholder="e.g. Solid honed Italian beige stone with stepped geometry"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none focus:border-amber-600 bg-white"
                  >
                    {CATEGORIES.filter(c => c !== 'All Decor').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    min={1}
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Original MRP ($)</label>
                  <input
                    type="number"
                    min={1}
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">High-Res Photo URL</label>
                <input
                  type="url"
                  value={newProduct.images[0]}
                  onChange={(e) => setNewProduct({ ...newProduct, images: [e.target.value, newProduct.images[1] || e.target.value] })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg outline-none focus:border-amber-600 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setAddProductModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-amber-700 text-white rounded-lg font-bold shadow-md"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
