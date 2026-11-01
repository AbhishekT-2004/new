export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  badge?: 'DECORIVA Assured' | 'Aura Assured' | 'Bestseller' | 'Trending' | 'Festive Deal' | 'Handcrafted';
  images: string[];
  description: string;
  highlights: string[];
  specifications: Record<string, string>;
  dimensions: string;
  material: string;
  color: string;
  deliveryDays: number;
  freeDelivery: boolean;
  warranty: string;
  featured?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
  landmark?: string;
  addressType: 'Home' | 'Work';
}

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface TimelineStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  location?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingId: string;
  carrier: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  deliveryFee: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING' | 'COD';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  status: OrderStatus;
  timeline: TimelineStep[];
  expectedDeliveryDate: string;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderValue: number;
  maxDiscount: number;
  description: string;
}

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  conversionRate: number;
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  categoryBreakdown: { category: string; sales: number; count: number }[];
  topProducts: { id: string; title: string; unitsSold: number; revenue: number; image: string }[];
}
