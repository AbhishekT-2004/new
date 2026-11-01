import { Product, Order, Review, SalesAnalytics } from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, COUPONS } from '../data/mockProducts';

const API_BASE = '/api';

// Initial pre-seeded orders for instant live tracking demonstration
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'AL-98241',
    trackingId: 'TRK-BLUEDART-882190',
    carrier: 'BlueDart Express Air Cargo',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedColor: 'Warm Oatmeal'
      },
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedColor: 'Warm Brass Gold'
      }
    ],
    subtotal: 224,
    discount: 22,
    couponCode: 'WELCOME10',
    couponDiscount: 20,
    deliveryFee: 0,
    totalAmount: 204,
    shippingAddress: {
      fullName: 'Pawan Kumar',
      phone: '+91 98765 43210',
      pincode: '110001',
      addressLine: 'A-42, Gulmohar Avenue, Near Central Park',
      city: 'New Delhi',
      state: 'Delhi',
      landmark: 'Opposite Heritage Club',
      addressType: 'Home'
    },
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    status: 'OUT_FOR_DELIVERY',
    expectedDeliveryDate: 'Today by 7:00 PM',
    createdAt: '2026-10-03T09:15:00Z',
    timeline: [
      {
        status: 'PLACED',
        title: 'Order Placed & Verified',
        description: 'Payment authorized via UPI (Ref: UPI-984029381)',
        timestamp: '03 Oct 2026, 09:15 AM',
        completed: true,
        location: 'AuraLuxe Central Hub'
      },
      {
        status: 'PROCESSING',
        title: 'Packed & Quality Certified',
        description: 'Passed 4-point fragile item inspection & reinforced bubble wrapping',
        timestamp: '03 Oct 2026, 02:40 PM',
        completed: true,
        location: 'Fulfillment Center, Gurugram'
      },
      {
        status: 'SHIPPED',
        title: 'Dispatched with BlueDart Express',
        description: 'In transit via Flight BD-402',
        timestamp: '04 Oct 2026, 08:30 AM',
        completed: true,
        location: 'Delhi Regional Air Sorting Facility'
      },
      {
        status: 'OUT_FOR_DELIVERY',
        title: 'Out for Delivery',
        description: 'Courier Associate Rajesh (OTP: 4892) is out for delivery',
        timestamp: '05 Oct 2026, 08:15 AM',
        completed: true,
        location: 'Connaught Place Delivery Hub, New Delhi'
      },
      {
        status: 'DELIVERED',
        title: 'Expected Delivery',
        description: 'Estimated delivery by 7:00 PM today',
        timestamp: '05 Oct 2026, by 07:00 PM',
        completed: false,
        location: 'Customer Address'
      }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'AL-97832',
    trackingId: 'TRK-DELHIVERY-774129',
    carrier: 'Delhivery Surface Premium',
    items: [
      {
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        selectedColor: 'Ivory & Charcoal Black'
      }
    ],
    subtotal: 219,
    discount: 0,
    couponCode: 'FESTIVE25',
    couponDiscount: 54.75,
    deliveryFee: 0,
    totalAmount: 164.25,
    shippingAddress: {
      fullName: 'Pawan Kumar',
      phone: '+91 98765 43210',
      pincode: '110001',
      addressLine: 'A-42, Gulmohar Avenue',
      city: 'New Delhi',
      state: 'Delhi',
      landmark: 'Near Central Park',
      addressType: 'Home'
    },
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    status: 'DELIVERED',
    expectedDeliveryDate: 'Delivered on 01 Oct 2026',
    createdAt: '2026-09-27T14:20:00Z',
    timeline: [
      {
        status: 'PLACED',
        title: 'Order Placed',
        description: 'Prepaid via HDFC Visa Infinite (Ending in 4091)',
        timestamp: '27 Sep 2026, 02:20 PM',
        completed: true
      },
      {
        status: 'PROCESSING',
        title: 'Packed',
        description: 'Packaged in waterproof heavy-duty wool transport case',
        timestamp: '28 Sep 2026, 11:00 AM',
        completed: true
      },
      {
        status: 'SHIPPED',
        title: 'Shipped',
        description: 'Transit via express overland truck',
        timestamp: '29 Sep 2026, 06:15 PM',
        completed: true
      },
      {
        status: 'OUT_FOR_DELIVERY',
        title: 'Out for Delivery',
        description: 'Out for morning delivery window',
        timestamp: '01 Oct 2026, 09:10 AM',
        completed: true
      },
      {
        status: 'DELIVERED',
        title: 'Delivered Successfully',
        description: 'Package delivered & signed by Pawan Kumar',
        timestamp: '01 Oct 2026, 01:45 PM',
        completed: true
      }
    ]
  }
];

// Browser Local Storage MongoDB Collection helper
function getStoredCollection<T>(key: string, defaultData: T[]): T[] {
  try {
    const raw = localStorage.getItem(`auraluxe_${key}`);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(`auraluxe_${key}`, JSON.stringify(defaultData));
    return defaultData;
  } catch {
    return defaultData;
  }
}

function setStoredCollection<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(`auraluxe_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Storage error', err);
  }
}

export const api = {
  // Products
  async getProducts(params?: { category?: string; search?: string; inStock?: boolean }): Promise<Product[]> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category && params.category !== 'All Decor') searchParams.append('category', params.category);
      if (params?.search) searchParams.append('search', params.search);
      if (params?.inStock) searchParams.append('inStock', 'true');

      const url = `${API_BASE}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback to local MongoDB-style store
    }

    let list = getStoredCollection<Product>('products', INITIAL_PRODUCTS);
    if (params?.category && params.category !== 'All Decor') {
      list = list.filter(p => p.category.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (params?.inStock) {
      list = list.filter(p => p.inStock && p.stockQuantity > 0);
    }
    return list;
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const list = getStoredCollection<Product>('products', INITIAL_PRODUCTS);
    return list.find(p => p.id === id) || null;
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const list = getStoredCollection<Product>('products', INITIAL_PRODUCTS);
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(newProd);
    setStoredCollection('products', list);
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const list = getStoredCollection<Product>('products', INITIAL_PRODUCTS);
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setStoredCollection('products', list);
      return list[idx];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch {
      // Fallback
    }

    const list = getStoredCollection<Product>('products', INITIAL_PRODUCTS);
    const filtered = list.filter(p => p.id !== id);
    setStoredCollection('products', filtered);
    return true;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    return getStoredCollection<Order>('orders', INITIAL_ORDERS);
  },

  async getOrderByIdOrTracking(query: string): Promise<Order | null> {
    try {
      const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const orders = getStoredCollection<Order>('orders', INITIAL_ORDERS);
    const q = query.trim().toLowerCase();
    return orders.find(o =>
      o.id.toLowerCase() === q ||
      o.orderNumber.toLowerCase() === q ||
      o.trackingId.toLowerCase() === q
    ) || null;
  },

  async createOrder(orderData: any): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const orders = getStoredCollection<Order>('orders', INITIAL_ORDERS);
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `DEC-${randomNum}`;
    const trackingId = `TRK-DECORIVA-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      trackingId,
      carrier: 'DECORIVA SwiftExpress Delivery',
      createdAt: now.toISOString(),
      timeline: [
        {
          status: 'PLACED',
          title: 'Order Placed & Confirmed',
          description: `Payment confirmed via ${orderData.paymentMethod}. Order received by seller.`,
          timestamp: `${formattedDate}, ${formattedTime}`,
          completed: true,
          location: 'Central Sorting Hub'
        },
        {
          status: 'PROCESSING',
          title: 'Quality Check & Packing',
          description: 'Items are undergoing safety inspection and multi-layer shockproof packing.',
          timestamp: 'Expected within 12 hours',
          completed: false,
          location: 'AuraLuxe Warehouse'
        },
        {
          status: 'SHIPPED',
          title: 'Dispatch to Logistics Partner',
          description: 'Package ready for courier pickup and transit.',
          timestamp: 'Expected within 24 hours',
          completed: false
        },
        {
          status: 'OUT_FOR_DELIVERY',
          title: 'Out for Delivery',
          description: 'Local courier partner will deliver to your doorstep.',
          timestamp: 'Scheduled day of delivery',
          completed: false
        },
        {
          status: 'DELIVERED',
          title: 'Delivered',
          description: 'Delivered to recipient address with OTP verification.',
          timestamp: orderData.expectedDeliveryDate || 'Within 3-4 business days',
          completed: false
        }
      ]
    };

    orders.unshift(newOrder);
    setStoredCollection('orders', orders);

    // Decrement stock in local products
    const products = getStoredCollection<Product>('products', INITIAL_PRODUCTS);
    for (const item of newOrder.items) {
      const prod = products.find(p => p.id === item.product.id);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        if (prod.stockQuantity === 0) prod.inStock = false;
      }
    }
    setStoredCollection('products', products);

    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: string, note?: string): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const orders = getStoredCollection<Order>('orders', INITIAL_ORDERS);
    const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) throw new Error('Order not found');

    order.status = status as any;
    const now = new Date();
    const formattedNow = `${now.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const stepIndex = order.timeline.findIndex(t => t.status === status);
    if (stepIndex !== -1) {
      for (let i = 0; i <= stepIndex; i++) {
        order.timeline[i].completed = true;
      }
      order.timeline[stepIndex].timestamp = formattedNow;
      if (note) order.timeline[stepIndex].description = note;
    }

    setStoredCollection('orders', orders);
    return order;
  },

  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const orders = getStoredCollection<Order>('orders', INITIAL_ORDERS);
    const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) throw new Error('Order not found');
    order.status = 'CANCELLED';
    setStoredCollection('orders', orders);
    return order;
  },

  // Reviews
  async getReviews(productId: string): Promise<Review[]> {
    try {
      const res = await fetch(`${API_BASE}/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const allRevs = getStoredCollection<Review>('reviews', INITIAL_REVIEWS);
    return allRevs.filter(r => r.productId === productId);
  },

  async submitReview(review: { productId: string; userName: string; rating: number; title: string; comment: string }): Promise<Review> {
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const allRevs = getStoredCollection<Review>('reviews', INITIAL_REVIEWS);
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpfulCount: 1
    };
    allRevs.unshift(newRev);
    setStoredCollection('reviews', allRevs);
    return newRev;
  },

  // Coupons
  async validateCoupon(code: string, cartTotal: number): Promise<{ code: string; discountPercent: number; discountAmount: number; description: string }> {
    try {
      const res = await fetch(`${API_BASE}/coupon/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {
      // Fallback
    }

    const foundCoupon = COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!foundCoupon) {
      throw new Error('Invalid coupon code. Try AURALUXE15 or FESTIVE25');
    }
    if (cartTotal < foundCoupon.minOrderValue) {
      throw new Error(`Minimum order value of $${foundCoupon.minOrderValue} required for coupon ${foundCoupon.code}`);
    }

    const calculatedDiscount = Math.min(
      (cartTotal * foundCoupon.discountPercent) / 100,
      foundCoupon.maxDiscount
    );

    return {
      code: foundCoupon.code,
      discountPercent: foundCoupon.discountPercent,
      discountAmount: Number(calculatedDiscount.toFixed(2)),
      description: foundCoupon.description
    };
  },

  // Analytics
  async getAnalytics(): Promise<SalesAnalytics | null> {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      if (res.ok) {
        const data = await res.json();
        if (data.data) return data.data;
      }
    } catch {
      // Fallback
    }

    const orders = getStoredCollection<Order>('orders', INITIAL_ORDERS).filter(o => o.status !== 'CANCELLED');
    const products = getStoredCollection<Product>('products', INITIAL_PRODUCTS);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const monthlyRevenue = [
      { month: 'May', revenue: 4200, orders: 28 },
      { month: 'Jun', revenue: 5800, orders: 39 },
      { month: 'Jul', revenue: 7300, orders: 51 },
      { month: 'Aug', revenue: 8900, orders: 62 },
      { month: 'Sep', revenue: 11400, orders: 78 },
      { month: 'Oct', revenue: Math.max(14200, Math.round(totalRevenue * 1.5)), orders: Math.max(94, totalOrders + 85) }
    ];

    const categoryBreakdown = [
      { category: 'Vases & Planters', sales: 6800, count: 4 },
      { category: 'Lighting & Lamps', sales: 9400, count: 5 },
      { category: 'Wall Art & Mirrors', sales: 5200, count: 3 },
      { category: 'Rugs & Cushions', sales: 8100, count: 4 },
      { category: 'Sculptures & Accents', sales: 3400, count: 2 }
    ];

    const topProducts = products.slice(0, 4).map(p => ({
      id: p.id,
      title: p.title,
      unitsSold: Math.floor(p.reviewCount * 1.8),
      revenue: Math.floor(p.price * p.reviewCount * 1.8),
      image: p.images[0]
    }));

    return {
      totalRevenue: totalRevenue || 38240,
      totalOrders: totalOrders || 148,
      averageOrderValue: averageOrderValue || 258,
      totalCustomers: 184,
      conversionRate: 3.42,
      monthlyRevenue,
      categoryBreakdown,
      topProducts
    };
  }
};
