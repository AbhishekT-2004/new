import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Lock, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/mockProducts';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setCurrentView, navigateToTrackOrder, setUserRole, userRole, showToast } = useShop();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 pt-14 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top 4 Value Props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800/80">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">DECORIVA Assured Quality</h4>
              <p className="text-stone-400 text-xs mt-0.5">Every ceramic, stone, and brass piece certified against imperfections.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">Swift Express Freight</h4>
              <p className="text-stone-400 text-xs mt-0.5">Free delivery on luxury orders with real-time GPS tracking.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RotateCcw className="w-6 h-6 text-blue-500 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">7-Day Replacement</h4>
              <p className="text-stone-400 text-xs mt-0.5">Prompt hassle-free exchanges for fragile home decor.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-purple-500 shrink-0" />
            <div>
              <h4 className="font-bold text-white text-sm">PCI-DSS 256-Bit SSL</h4>
              <p className="text-stone-400 text-xs mt-0.5">Secure UPI, Credit Cards, and Net Banking gateways.</p>
            </div>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-stone-800/80">
          
          {/* Brand & Project Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold font-serif-luxury text-white">
                DECOR<span className="text-amber-500">IVA</span>
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                AI Decor
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed text-xs">
              Handcrafted sanctuaries for discerning homes with AI-powered interior styling assistance. Blending Scandinavian restraint with heritage Indian craftsmanship.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1 bg-stone-900 border border-stone-800 text-amber-400 px-2.5 py-1 rounded text-[11px] font-mono">
                🎓 Final Year College Project Submission
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Shop Categories
            </h5>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="hover:text-amber-400 transition-colors font-semibold text-amber-400"
                >
                  Explore All Collections →
                </button>
              </li>
              {CATEGORIES.slice(1, 6).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCurrentView('shop');
                    }}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support & Core Pages */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Store Pages & Portals
            </h5>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => setCurrentView('orders')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <span>Orders & Payment History</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToTrackOrder()}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Live GPS Order Tracking</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('checkout')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Secure Payment Gateway Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('wishlist')}
                  className="hover:text-amber-400 transition-colors"
                >
                  My Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserRole('admin');
                    setCurrentView('admin');
                  }}
                  className="hover:text-amber-400 transition-colors text-amber-300 font-semibold"
                >
                  👑 Admin Dashboard (Analytics)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserRole('admin');
                    setCurrentView('order-management');
                  }}
                  className="hover:text-amber-400 transition-colors text-amber-300 font-semibold"
                >
                  🚚 Seller Order Management
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & College Demo Details */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3">
              Technical Architecture
            </h5>
            <p className="text-stone-400 text-xs mb-3">
              Built with Node.js Express REST API, MongoDB Schema Models, React 19, TypeScript, and Tailwind CSS.
            </p>
            <div className="space-y-1.5 text-stone-400 text-[11px]">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>New Delhi, India</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>+91 98765 43210</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>pawan2004xy@gmail.com</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>© 2026 DECORIVA Home Decor & AI Design Inc. Designed for College E-Commerce Project Evaluation.</p>

          <div className="flex items-center gap-3">
            <span className="text-stone-400 font-medium">Accepted Payments:</span>
            <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-stone-300 font-mono text-[10px]">UPI</span>
            <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-stone-300 font-mono text-[10px]">VISA</span>
            <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-stone-300 font-mono text-[10px]">MasterCard</span>
            <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-stone-300 font-mono text-[10px]">RuPay</span>
            <span className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-stone-300 font-mono text-[10px]">Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
