import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { BannerSlider } from './components/BannerSlider';
import { CatalogSection } from './components/CatalogSection';
import { ShoppingPage } from './components/ShoppingPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { OrderManagementPage } from './components/OrderManagementPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingPage } from './components/OrderTrackingPage';
import { WishlistPage } from './components/WishlistPage';
import { AdminDashboard } from './components/AdminDashboard';
import { CurrencyConverterModal } from './components/CurrencyConverterModal';
import { Footer } from './components/Footer';
import { AIChatbot } from './components/AIChatbot';
import { Order } from './types';

const MainLayout: React.FC = () => {
  const { currentView, lastOrder, setLastOrder, setCurrentView } = useShop();
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleOrderSuccess = (order: Order) => {
    setLastOrder(order);
    setSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
      {/* Top Navbar & Category Bar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <BannerSlider />
            <CatalogSection />
          </>
        )}

        {/* 1. Shopping Catalog Page */}
        {currentView === 'shop' && <ShoppingPage />}

        {/* 2. Product Detail Page with Zoom Gallery, Reviews & AI Stylist */}
        {currentView === 'product-detail' && <ProductDetailPage />}

        {/* 3. Dedicated Full-Page Checkout */}
        {currentView === 'checkout' && <CheckoutPage />}

        {/* 4. Orders & Payment History Page */}
        {currentView === 'orders' && <OrderHistoryPage />}

        {/* 5. Live GPS Order Tracking Page */}
        {currentView === 'order-track' && <OrderTrackingPage />}

        {/* 6. Customer Wishlist Page */}
        {currentView === 'wishlist' && <WishlistPage />}

        {/* 7. Admin Dashboard & Sales Analytics Page */}
        {currentView === 'admin' && <AdminDashboard />}

        {/* 8. Seller Order & Logistics Management Page */}
        {currentView === 'order-management' && <OrderManagementPage />}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer onCheckout={() => setCurrentView('checkout')} />

      {/* Quick Modal Checkout (when triggered directly) */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Post-Checkout Celebratory Success Modal */}
      <OrderSuccessModal
        isOpen={successModalOpen}
        order={lastOrder}
        onClose={() => setSuccessModalOpen(false)}
      />

      {/* Dollar into Rupees Currency Converter Modal */}
      <CurrencyConverterModal />

      {/* Floating DECORIVA AI Decor Chatbot */}
      <AIChatbot />

      {/* Comprehensive Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
