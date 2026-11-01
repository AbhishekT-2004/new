import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '../types';
import { api } from '../services/api';

export type ViewType = 'home' | 'shop' | 'product-detail' | 'cart' | 'checkout' | 'orders' | 'order-track' | 'wishlist' | 'admin' | 'order-management';

export type Currency = 'INR' | 'USD';

export const USD_TO_INR_RATE = 83.5;

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface CouponInfo {
  code: string;
  discountPercent: number;
  discountAmount: number;
  description: string;
}

interface ShopContextType {
  // Currency & Dollar to Rupees Conversion
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  toggleCurrency: () => void;
  exchangeRate: number;
  formatPrice: (usdAmount: number, options?: { showBoth?: boolean; compact?: boolean }) => string;
  convertUsdToInr: (usd: number) => number;
  convertInrToUsd: (inr: number) => number;
  currencyConverterOpen: boolean;
  setCurrencyConverterOpen: (open: boolean) => void;

  // Navigation & View
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  navigateToProduct: (id: string) => void;
  activeTrackQuery: string | null;
  navigateToTrackOrder: (query?: string) => void;
  navigateToShop: (category?: string) => void;
  navigateToOrders: () => void;
  navigateToCheckout: () => void;
  navigateToAdmin: () => void;
  navigateToOrderManagement: () => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  ratingFilter: number;
  setRatingFilter: (rating: number) => void;
  inStockFilter: boolean;
  setInStockFilter: (inStock: boolean) => void;
  assuredFilter: boolean;
  setAssuredFilter: (assured: boolean) => void;
  resetFilters: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  // Coupons
  appliedCoupon: CouponInfo | null;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User & Pincode & Roles
  userRole: 'shopper' | 'admin';
  setUserRole: (role: 'shopper' | 'admin') => void;
  pincode: string;
  setPincode: (pin: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  // Last Placed Order (for success modal)
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;

  // AI Decor Chatbot
  aiChatOpen: boolean;
  setAiChatOpen: (open: boolean) => void;
  initialAiPrompt: string | null;
  openAiChatWithPrompt: (prompt?: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeTrackQuery, setActiveTrackQuery] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Decor');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [inStockFilter, setInStockFilter] = useState<boolean>(false);
  const [assuredFilter, setAssuredFilter] = useState<boolean>(false);

  // Cart & Storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('auraluxe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('auraluxe_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-2'];
    } catch {
      return ['prod-1', 'prod-2'];
    }
  });

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponInfo | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [pincode, setPincode] = useState('110001');
  const [userRole, setUserRole] = useState<'shopper' | 'admin'>('shopper');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [initialAiPrompt, setInitialAiPrompt] = useState<string | null>(null);

  const openAiChatWithPrompt = (prompt?: string) => {
    if (prompt) {
      setInitialAiPrompt(prompt);
    }
    setAiChatOpen(true);
  };

  // Currency State (defaults to Indian Rupee 'INR' with 1 USD = 83.50 INR)
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('decoriva_currency');
      return (saved === 'USD' || saved === 'INR') ? (saved as Currency) : 'INR';
    } catch {
      return 'INR';
    }
  });
  const [currencyConverterOpen, setCurrencyConverterOpen] = useState(false);
  const exchangeRate = USD_TO_INR_RATE;

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('decoriva_currency', c);
    } catch {}
    showToast(`Currency changed to ${c === 'INR' ? 'Indian Rupee (₹ INR)' : 'US Dollar ($ USD)'}`, 'info');
  };

  const toggleCurrency = () => {
    const next: Currency = currency === 'INR' ? 'USD' : 'INR';
    setCurrency(next);
  };

  // Dollar into Rupees Conversion Methods
  const convertUsdToInr = (usd: number): number => {
    return Math.round((Number(usd) || 0) * exchangeRate);
  };

  const convertInrToUsd = (inr: number): number => {
    return Number(((Number(inr) || 0) / exchangeRate).toFixed(2));
  };

  // Formats any price based on the selected currency
  const formatPrice = (usdAmount: number, options?: { showBoth?: boolean; compact?: boolean }): string => {
    const val = Number(usdAmount) || 0;
    if (currency === 'INR') {
      const inrAmount = Math.round(val * exchangeRate);
      const inrStr = `₹${inrAmount.toLocaleString('en-IN')}`;
      if (options?.showBoth) {
        return `${inrStr} ($${val.toLocaleString('en-US')})`;
      }
      return inrStr;
    } else {
      const usdStr = `$${val.toLocaleString('en-US')}`;
      if (options?.showBoth) {
        const inrAmount = Math.round(val * exchangeRate);
        return `${usdStr} (₹${inrAmount.toLocaleString('en-IN')})`;
      }
      return usdStr;
    }
  };

  useEffect(() => {
    localStorage.setItem('auraluxe_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('auraluxe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toast handler
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: selectedColor || product.color }];
    });
    showToast(`Added "${product.title}" to cart`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your Wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon handling
  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    try {
      const result = await api.validateCoupon(code, cartSubtotal);
      setAppliedCoupon(result);
      showToast(`Coupon "${result.code}" applied! You save $${result.discountAmount}`, 'success');
      return true;
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon');
      showToast(err.message || 'Failed to apply coupon', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    showToast('Coupon removed', 'info');
  };

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTrackOrder = (query?: string) => {
    if (query) {
      setActiveTrackQuery(query);
    }
    setCurrentView('order-track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToShop = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToOrders = () => {
    setCurrentView('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCheckout = () => {
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = () => {
    setUserRole('admin');
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToOrderManagement = () => {
    setUserRole('admin');
    setCurrentView('order-management');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSelectedCategory('All Decor');
    setSearchQuery('');
    setSortBy('relevance');
    setPriceRange([0, 500]);
    setRatingFilter(0);
    setInStockFilter(false);
    setAssuredFilter(false);
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        navigateToProduct,
        activeTrackQuery,
        navigateToTrackOrder,
        navigateToShop,
        navigateToOrders,
        navigateToCheckout,
        navigateToAdmin,
        navigateToOrderManagement,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        ratingFilter,
        setRatingFilter,
        inStockFilter,
        setInStockFilter,
        assuredFilter,
        setAssuredFilter,
        resetFilters,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDrawerOpen,
        setCartDrawerOpen,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        userRole,
        setUserRole,
        pincode,
        setPincode,
        toasts,
        showToast,
        dismissToast,
        lastOrder,
        setLastOrder,
        aiChatOpen,
        setAiChatOpen,
        initialAiPrompt,
        openAiChatWithPrompt,
        currency,
        setCurrency,
        toggleCurrency,
        exchangeRate,
        formatPrice,
        convertUsdToInr,
        convertInrToUsd,
        currencyConverterOpen,
        setCurrencyConverterOpen
      }}
    >
      {children}

      {/* Global Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium transition-all transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-emerald-50 border border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-rose-50 border border-rose-700'
                : 'bg-stone-900 text-stone-100 border border-stone-800'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-stone-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
