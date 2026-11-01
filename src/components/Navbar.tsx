import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Package, 
  SlidersHorizontal, 
  Sparkles, 
  UserCheck, 
  ChevronDown,
  X,
  Calculator,
  ArrowRightLeft,
  Truck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CATEGORIES } from '../data/mockProducts';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    cartCount,
    setCartDrawerOpen,
    wishlist,
    userRole,
    setUserRole,
    pincode,
    setPincode,
    navigateToTrackOrder,
    showToast,
    setAiChatOpen,
    currency,
    setCurrency,
    toggleCurrency,
    setCurrencyConverterOpen,
    exchangeRate,
    formatPrice
  } = useShop();

  const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState(pincode);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentView !== 'home') {
      setCurrentView('home');
    }
  };

  const popularSearches = ['Ceramic Vase', 'Brass Pendant Lamp', 'Arch Mirror', 'Moroccan Wool Rug', 'Travertine Table'];

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Grand Living Festival Live: Flat 25% Off with code FESTIVE25
            </span>
            <span className="hidden md:inline-block text-stone-500">|</span>
            <span className="hidden md:inline-block text-stone-400">
              Free Express Delivery on all orders above {formatPrice(50)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Dollar into Rupees Currency Switcher */}
            <div className="flex items-center gap-1.5 bg-stone-800/90 rounded px-2 py-0.5 border border-stone-700">
              <span className="text-stone-400 text-[11px]">Currency:</span>
              <button
                type="button"
                onClick={toggleCurrency}
                className="font-bold text-amber-400 hover:text-white transition-colors px-1 text-xs flex items-center gap-1"
                title={`Active: ${currency === 'INR' ? 'Indian Rupees (₹)' : 'US Dollars ($)'}. Click to switch.`}
              >
                <span>{currency === 'INR' ? '🇮🇳 ₹ INR' : '🇺🇸 $ USD'}</span>
                <ArrowRightLeft className="w-2.5 h-2.5 text-stone-400" />
              </button>
              <button
                type="button"
                onClick={() => setCurrencyConverterOpen(true)}
                className="text-stone-400 hover:text-amber-300 p-0.5 rounded transition-colors"
                title="Open Dollar into Rupees Live Calculator (1 USD = ₹83.50)"
              >
                <Calculator className="w-3 h-3" />
              </button>
            </div>

            {/* Role Switcher for College Evaluation */}
            <div className="flex items-center gap-1 bg-stone-800/90 rounded px-2 py-0.5 border border-stone-700">
              <span className="text-stone-400 text-[11px]">Mode:</span>
              <button
                onClick={() => {
                  const newRole = userRole === 'shopper' ? 'admin' : 'shopper';
                  setUserRole(newRole);
                  if (newRole === 'admin') setCurrentView('admin');
                  else if (currentView === 'admin') setCurrentView('home');
                  showToast(`Switched to ${newRole === 'admin' ? 'Admin / Seller View' : 'Shopper View'}`, 'info');
                }}
                className={`font-semibold transition-colors px-1.5 py-0.5 rounded text-xs ${
                  userRole === 'admin' ? 'bg-amber-500 text-stone-950' : 'text-amber-300 hover:text-white'
                }`}
              >
                {userRole === 'admin' ? '👑 Admin' : '🛍️ Shopper'}
              </button>
            </div>

            {userRole === 'admin' ? (
              <button
                onClick={() => setCurrentView('order-management')}
                className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                  currentView === 'order-management' ? 'text-amber-400 font-bold' : 'text-stone-300 hover:text-amber-400'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Order Dispatch</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('orders')}
                className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                  currentView === 'orders' ? 'text-amber-400 font-bold' : 'text-stone-300 hover:text-amber-400'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Order & Payment History</span>
              </button>
            )}

            <button
              onClick={() => navigateToTrackOrder()}
              className="text-stone-300 hover:text-amber-400 hidden sm:flex items-center gap-1 transition-colors"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Flipkart-Style Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Brand Logo */}
            <div 
              onClick={() => {
                setSelectedCategory('All Decor');
                setSearchQuery('');
                setCurrentView('home');
              }}
              className="cursor-pointer flex flex-col group select-none shrink-0"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight font-serif-luxury text-stone-900 group-hover:text-amber-700 transition-colors">
                  DECOR<span className="text-amber-600">IVA</span>
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> Assured
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 -mt-1 font-medium">
                Home Decor & AI Stylist
              </span>
            </div>

            {/* Pincode Selector */}
            <button
              onClick={() => setPincodeModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-2.5 py-1.5 rounded-md transition-all border border-transparent hover:border-stone-200 shrink-0"
              title="Change Delivery Location"
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <div className="text-left">
                <p className="text-[10px] text-stone-400 leading-none">Deliver to</p>
                <p className="font-semibold text-stone-800 leading-tight">{pincode}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {/* Search Bar with Autocomplete & Suggestions */}
            <div className="flex-1 max-w-2xl relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search vases, brass pendant lamps, arched mirrors, rugs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-100/90 hover:bg-stone-100 focus:bg-white border border-stone-200 focus:border-amber-600 rounded-lg outline-none transition-all placeholder:text-stone-400 shadow-inner"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Instant Search Suggestions Dropdown */}
              {searchFocused && !searchQuery && (
                <div 
                  className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-stone-200 rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 text-xs text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular Home Decor Searches
                    </span>
                    <button 
                      onClick={() => setSearchFocused(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setSearchQuery(term);
                          setSearchFocused(false);
                          if (currentView !== 'home') setCurrentView('home');
                        }}
                        className="text-xs bg-stone-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300 border border-stone-200 px-2.5 py-1 rounded-md transition-all text-stone-700"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 sm:gap-3">
              
              {/* Shop Page Link */}
              <button
                onClick={() => setCurrentView('shop')}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  currentView === 'shop'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                Shop All
              </button>

              {/* Admin or Orders Button */}
              {userRole === 'admin' ? (
                <>
                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`flex items-center gap-1 px-2.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                      currentView === 'admin'
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                    title="Admin Sales Dashboard"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Analytics</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('order-management')}
                    className={`hidden md:flex items-center gap-1 px-2.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                      currentView === 'order-management'
                        ? 'bg-stone-900 text-amber-400 font-bold shadow-xs'
                        : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
                    title="Order & Shipment Management"
                  >
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dispatch</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setCurrentView('orders')}
                  className={`hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    currentView === 'orders'
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                  title="My Orders & Payment History"
                >
                  <Package className="w-4 h-4 text-stone-500" />
                  <span>Orders</span>
                </button>
              )}

              {/* Currency Button (Dollar into Rupees) */}
              <button
                type="button"
                onClick={() => setCurrencyConverterOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-stone-200 text-stone-800 hover:border-amber-600 hover:bg-amber-50/40 text-xs font-bold transition-all"
                title="Dollar into Rupees (USD ⇄ INR) Conversion Calculator"
              >
                <span className="text-amber-700 font-extrabold">{currency === 'INR' ? '₹ INR' : '$ USD'}</span>
                <Calculator className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => setCurrentView('wishlist')}
                className={`relative p-2.5 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-all ${
                  currentView === 'wishlist' ? 'bg-amber-50 text-amber-700' : ''
                }`}
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* AI Decor Stylist Button */}
              <button
                onClick={() => setAiChatOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-sm transition-all active:scale-95"
                title="Ask DECORIVA AI Stylist"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                <span className="hidden sm:inline">AI Stylist</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative flex items-center gap-2 bg-stone-900 hover:bg-amber-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-amber-400 text-stone-950 text-[11px] font-extrabold px-1.5 py-0.2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Categories Megamenu Strip */}
        <div className="bg-stone-50/80 border-t border-stone-200 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-2 sm:gap-6 py-2 text-xs whitespace-nowrap">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    if (currentView !== 'home') setCurrentView('home');
                  }}
                  className={`py-1 px-2.5 rounded font-medium transition-all relative ${
                    isActive
                      ? 'text-amber-800 bg-amber-100/70 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                  }`}
                >
                  {category}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Pincode Change Modal */}
      {pincodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-semibold text-stone-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                Select Delivery Location
              </h3>
              <button 
                onClick={() => setPincodeModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500 mt-3 mb-4">
              Enter your Indian Postal Code to check shipping availability, accurate delivery dates, and cash on delivery eligibility.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (tempPincode.trim().length >= 4) {
                  setPincode(tempPincode.trim());
                  setPincodeModalOpen(false);
                  showToast(`Delivery location set to ${tempPincode}`, 'success');
                }
              }}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value)}
                  placeholder="e.g. 110001"
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:border-amber-600 outline-none"
                />
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                >
                  Apply
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap gap-2 text-[11px] text-stone-600">
              <span>Quick metro pins:</span>
              <button onClick={() => { setPincode('110001'); setPincodeModalOpen(false); }} className="hover:text-amber-700 underline">New Delhi (110001)</button>
              <button onClick={() => { setPincode('400001'); setPincodeModalOpen(false); }} className="hover:text-amber-700 underline">Mumbai (400001)</button>
              <button onClick={() => { setPincode('560001'); setPincodeModalOpen(false); }} className="hover:text-amber-700 underline">Bengaluru (560001)</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
