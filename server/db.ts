import fs from 'fs';
import path from 'path';
import type { Product, Order, Review, SalesAnalytics } from '../src/types/index.ts';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../src/data/mockProducts.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  reviews: Review[];
}

// Sample orders for instant live tracking demonstration
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

class DatabaseEngine {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
          orders: parsed.orders && parsed.orders.length > 0 ? parsed.orders : INITIAL_ORDERS,
          reviews: parsed.reviews && parsed.reviews.length > 0 ? parsed.reviews : INITIAL_REVIEWS
        };
      }
    } catch (err) {
      console.error('Error loading database file, initializing defaults:', err);
    }

    const initialData: DatabaseSchema = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      reviews: INITIAL_REVIEWS
    };

    this.saveToDisk(initialData);
    return initialData;
  }

  private saveToDisk(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database to disk:', err);
    }
  }

  // --- Mongoose/MongoDB style ODM operations ---
  public getProducts(filter?: { category?: string; search?: string; inStock?: boolean }): Product[] {
    let result = [...this.data.products];
    if (filter?.category && filter.category !== 'All Decor') {
      result = result.filter(p => p.category.toLowerCase() === filter.category?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    if (filter?.inStock) {
      result = result.filter(p => p.inStock && p.stockQuantity > 0);
    }
    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.saveToDisk(this.data);
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.products[index] = { ...this.data.products[index], ...updates };
    this.saveToDisk(this.data);
    return this.data.products[index];
  }

  public deleteProduct(id: string): boolean {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.saveToDisk(this.data);
    return true;
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return this.data.orders;
  }

  public getOrderByIdOrTracking(query: string): Order | undefined {
    const q = query.trim().toLowerCase();
    return this.data.orders.find(o => 
      o.id.toLowerCase() === q || 
      o.orderNumber.toLowerCase() === q || 
      o.trackingId.toLowerCase() === q
    );
  }

  public createOrder(orderInput: Omit<Order, 'id' | 'orderNumber' | 'trackingId' | 'carrier' | 'timeline' | 'createdAt'>): Order {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `AL-${randomNum}`;
    const trackingId = `TRK-AURALUXE-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      ...orderInput,
      id: `ord-${Date.now()}`,
      orderNumber,
      trackingId,
      carrier: 'AuraLuxe SwiftExpress Delivery',
      createdAt: now.toISOString(),
      timeline: [
        {
          status: 'PLACED',
          title: 'Order Placed & Confirmed',
          description: `Payment confirmed via ${orderInput.paymentMethod}. Order received by seller.`,
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
          timestamp: orderInput.expectedDeliveryDate || 'Within 3-4 business days',
          completed: false
        }
      ]
    };

    // Decrement stock for ordered items
    for (const item of newOrder.items) {
      const prod = this.data.products.find(p => p.id === item.product.id);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        if (prod.stockQuantity === 0) {
          prod.inStock = false;
        }
      }
    }

    this.data.orders.unshift(newOrder);
    this.saveToDisk(this.data);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['status'], note?: string): Order | null {
    const order = this.data.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.status = status;
    const now = new Date();
    const formattedNow = `${now.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const stepIndex = order.timeline.findIndex(t => t.status === status);
    if (stepIndex !== -1) {
      // Mark all previous steps and current step as completed
      for (let i = 0; i <= stepIndex; i++) {
        order.timeline[i].completed = true;
      }
      order.timeline[stepIndex].timestamp = formattedNow;
      if (note) {
        order.timeline[stepIndex].description = note;
      }
    }

    this.saveToDisk(this.data);
    return order;
  }

  // --- Reviews ---
  public getReviewsByProduct(productId: string): Review[] {
    return this.data.reviews.filter(r => r.productId === productId);
  }

  public createReview(reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>): Review {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 1
    };

    this.data.reviews.unshift(newReview);

    // Update product rating and review count
    const prod = this.data.products.find(p => p.id === reviewData.productId);
    if (prod) {
      const prodReviews = this.data.reviews.filter(r => r.productId === prod.id);
      const totalScore = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      prod.rating = Number((totalScore / prodReviews.length).toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    this.saveToDisk(this.data);
    return newReview;
  }

  // --- Analytics ---
  public getAnalytics(): SalesAnalytics {
    const orders = this.data.orders.filter(o => o.status !== 'CANCELLED');
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const uniqueCustomers = new Set(orders.map(o => o.shippingAddress.phone)).size || 1;

    // Monthly revenue simulation
    const monthlyRevenue = [
      { month: 'May', revenue: 4200, orders: 28 },
      { month: 'Jun', revenue: 5800, orders: 39 },
      { month: 'Jul', revenue: 7300, orders: 51 },
      { month: 'Aug', revenue: 8900, orders: 62 },
      { month: 'Sep', revenue: 11400, orders: 78 },
      { month: 'Oct', revenue: Math.max(14200, Math.round(totalRevenue * 1.5)), orders: Math.max(94, totalOrders + 85) }
    ];

    // Category breakdown
    const categoryMap: Record<string, { sales: number; count: number }> = {};
    for (const prod of this.data.products) {
      if (!categoryMap[prod.category]) {
        categoryMap[prod.category] = { sales: 0, count: 0 };
      }
      categoryMap[prod.category].count += 1;
    }

    for (const order of orders) {
      for (const item of order.items) {
        const cat = item.product.category || 'Other';
        if (!categoryMap[cat]) categoryMap[cat] = { sales: 0, count: 0 };
        categoryMap[cat].sales += item.product.price * item.quantity;
      }
    }

    const categoryBreakdown = Object.entries(categoryMap).map(([category, stats]) => ({
      category,
      sales: stats.sales || 450,
      count: stats.count
    }));

    // Top products
    const topProducts = this.data.products.slice(0, 4).map(p => ({
      id: p.id,
      title: p.title,
      unitsSold: Math.floor(p.reviewCount * 1.8),
      revenue: Math.floor(p.price * p.reviewCount * 1.8),
      image: p.images[0]
    }));

    return {
      totalRevenue,
      totalOrders: this.data.orders.length,
      averageOrderValue,
      totalCustomers: uniqueCustomers + 140,
      conversionRate: 3.42,
      monthlyRevenue,
      categoryBreakdown,
      topProducts
    };
  }
}

export const db = new DatabaseEngine();
