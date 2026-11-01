import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MapPin, 
  Tag, 
  Check, 
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Share2,
  Sparkles
} from 'lucide-react';
import { Product, Review } from '../types';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { ProductGallery } from './ProductGallery';
import { ReviewsModal } from './ReviewsModal';
import { ProductCard } from './ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    setCurrentView, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    pincode, 
    setPincode,
    showToast,
    setCartDrawerOpen,
    openAiChatWithPrompt,
    formatPrice,
    currency,
    setCurrencyConverterOpen
  } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState(pincode);
  const [pinVerified, setPinVerified] = useState(true);

  useEffect(() => {
    if (!selectedProductId) return;
    setLoading(true);

    const loadData = async () => {
      try {
        const prod = await api.getProductById(selectedProductId);
        if (prod) {
          setProduct(prod);
          // Load reviews
          const revs = await api.getReviews(prod.id);
          setReviews(revs);
          // Load related products
          const allProds = await api.getProducts({ category: prod.category });
          setRelatedProducts(allProds.filter(p => p.id !== prod.id).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedProductId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-stone-500">Loading exquisite decor details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold font-serif-luxury text-stone-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">The item you are looking for is currently unavailable or has been archived.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="bg-stone-900 text-white px-6 py-2.5 rounded-lg text-xs font-semibold hover:bg-amber-700 transition-colors"
        >
          Return to Decor Catalog
        </button>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const savingsAmount = product.originalPrice - product.price;

  // Star breakdown calculations
  const totalRevs = reviews.length || 1;
  const rating5 = reviews.filter(r => r.rating === 5).length;
  const rating4 = reviews.filter(r => r.rating === 4).length;
  const rating3 = reviews.filter(r => r.rating === 3).length;
  const rating2 = reviews.filter(r => r.rating === 2).length;
  const rating1 = reviews.filter(r => r.rating === 1).length;

  const handleBuyNow = () => {
    addToCart(product, 1);
    setCartDrawerOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.subtitle,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-5 overflow-x-auto whitespace-nowrap pb-1">
        <button onClick={() => setCurrentView('home')} className="hover:text-stone-900 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <button onClick={() => setCurrentView('home')} className="hover:text-stone-900 transition-colors">
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-xs sm:max-w-md">
          {product.title}
        </span>
      </nav>

      {/* Main Flipkart-Style 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Zoom Gallery + Sticky CTAs */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-5">
          <ProductGallery images={product.images} productTitle={product.title} />

          {/* Primary Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => addToCart(product, 1)}
              disabled={!product.inStock}
              className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                product.inStock
                  ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 active:scale-98'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                product.inStock
                  ? 'bg-stone-900 hover:bg-stone-800 text-white active:scale-98'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              BUY NOW
            </button>
          </div>

          {/* Flipkart-Style Assurance Badges */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-center text-xs">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span className="font-semibold text-stone-800">100% Genuine</span>
              <span className="text-[10px] text-stone-500">Artisan Certified</span>
            </div>
            <div className="flex flex-col items-center gap-1 border-x border-stone-200">
              <RotateCcw className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-stone-800">7 Days Return</span>
              <span className="text-[10px] text-stone-500">Hassle-Free Policy</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-stone-800">Free Delivery</span>
              <span className="text-[10px] text-stone-500">Live GPS Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Specs, Reviews, Offers */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header Title & Badges */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-1.5">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                {product.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-full border transition-all ${
                    wishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-stone-200 text-stone-500 hover:text-stone-900'
                  }`}
                  title={wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full border border-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif-luxury text-stone-900 leading-snug">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {product.subtitle}
            </p>

            {/* Ratings & Assured Banner */}
            <div className="flex items-center gap-3 mt-3">
              <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded shadow-xs">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-xs font-semibold text-stone-600">
                {product.reviewCount} Ratings & {reviews.length} Reviews
              </span>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-700" />
                DECORIVA Assured
              </span>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-extrabold text-stone-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-base text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-base font-extrabold text-emerald-700">
                {product.discountPercent}% off
              </span>
              <button
                type="button"
                onClick={() => setCurrencyConverterOpen(true)}
                className="ml-auto text-xs font-mono font-bold text-amber-800 bg-amber-100/70 hover:bg-amber-200/80 px-2.5 py-1 rounded-md border border-amber-300 transition-colors"
                title="View in Dollar / Rupees Converter"
              >
                {currency === 'INR' ? `≈ $${product.price} USD` : `≈ ₹${Math.round(product.price * 83.5).toLocaleString('en-IN')} INR`} ⇄
              </button>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Inclusive of all taxes • You save <span className="font-semibold text-emerald-700">{formatPrice(savingsAmount)}</span> on this order
            </p>
          </div>

          {/* Ask AI Stylist Interactive Card */}
          <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-amber-100/30 to-stone-50 rounded-xl border border-amber-300/60 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 fill-stone-950" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">Need styling advice for this piece?</p>
                <p className="text-[11px] text-stone-500">Ask DECORIVA AI how to pair this with your room palette</p>
              </div>
            </div>
            <button
              onClick={() => openAiChatWithPrompt(`How should I style the "${product.title}" in my living room or bedroom?`)}
              className="px-3 py-1.5 bg-stone-900 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors shadow-xs"
            >
              Ask AI Stylist
            </button>
          </div>

          {/* Available Offers Section (Flipkart style) */}
          <div className="space-y-2 border-t border-stone-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" /> Available Offers
            </h4>
            
            <div className="space-y-1.5 text-xs text-stone-700">
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-700 mt-0.5">•</span>
                <p>
                  <span className="font-semibold text-stone-900">Festive Offer:</span> Extra 25% off using coupon <span className="font-mono font-bold bg-amber-100 px-1 py-0.2 rounded text-amber-900">FESTIVE25</span> on orders above {formatPrice(150)}.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-700 mt-0.5">•</span>
                <p>
                  <span className="font-semibold text-stone-900">Bank Offer:</span> 5% Unlimited Cashback on Flipkart Axis Bank & HDFC Credit Cards.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-emerald-700 mt-0.5">•</span>
                <p>
                  <span className="font-semibold text-stone-900">Special Price:</span> Get extra {formatPrice(20)} off on this handpicked artisan piece.
                </p>
              </div>
            </div>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" /> Check Delivery Availability
            </h4>

            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter 6-digit PIN code"
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs focus:border-amber-600 outline-none"
              />
              <button
                onClick={() => {
                  if (pinInput.trim().length >= 4) {
                    setPincode(pinInput.trim());
                    setPinVerified(true);
                    showToast(`Delivery available for PIN ${pinInput}`, 'success');
                  }
                }}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold"
              >
                Check
              </button>
            </div>

            {pinVerified && (
              <div className="space-y-1 text-xs text-stone-600 pt-1">
                <p className="flex items-center gap-1.5 font-medium text-emerald-800">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Delivery in {product.deliveryDays} Business Days to {pincode}
                </p>
                <p className="text-[11px] text-stone-500">
                  Free Express Shipping • Cash on Delivery Available
                </p>
              </div>
            )}
          </div>

          {/* Product Highlights */}
          <div className="border-t border-stone-200 pt-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Product Highlights
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
              {product.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Specifications Table */}
          <div className="border-t border-stone-200 pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Specifications
            </h4>
            <div className="rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="grid grid-cols-3 p-3 bg-white hover:bg-stone-50/60 transition-colors">
                  <span className="font-semibold text-stone-500">{key}</span>
                  <span className="col-span-2 text-stone-900 font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Ratings & Reviews Section */}
          <div className="border-t border-stone-200 pt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold font-serif-luxury text-stone-900">
                  Ratings & Reviews
                </h4>
                <p className="text-xs text-stone-500">100% verified home decor buyers</p>
              </div>

              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-4 py-2 rounded-lg border border-stone-900 hover:bg-stone-900 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Rate Product
              </button>
            </div>

            {/* Ratings Breakdown Grid */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row gap-6 items-center">
              <div className="text-center sm:border-r border-stone-200 sm:pr-6 shrink-0">
                <div className="text-4xl font-extrabold text-stone-900 flex items-center justify-center gap-1">
                  <span>{product.rating}</span>
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-xs text-stone-500 mt-1">{product.reviewCount} Total Ratings</p>
                <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  96% Recommended
                </span>
              </div>

              {/* Progress bars */}
              <div className="w-full space-y-1.5 text-xs">
                {[
                  { star: 5, count: rating5 },
                  { star: 4, count: rating4 },
                  { star: 3, count: rating3 },
                  { star: 2, count: rating2 },
                  { star: 1, count: rating1 },
                ].map(({ star, count }) => {
                  const pct = Math.round((count / totalRevs) * 100);
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-7 text-stone-600 font-semibold">{star} ★</span>
                      <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            star >= 4 ? 'bg-emerald-600' : star === 3 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-stone-400 text-[11px]">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4 pt-2">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-0.5 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        <span>{rev.rating}</span>
                        <Star className="w-2.5 h-2.5 fill-white" />
                      </div>
                      <h5 className="text-xs font-bold text-stone-900">{rev.title}</h5>
                    </div>
                    <span className="text-[11px] text-stone-400">{rev.date}</span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>{rev.userName}</span>
                      {rev.verified && (
                        <span className="text-emerald-700 flex items-center gap-0.5">
                          <Check className="w-3 h-3 text-emerald-600" /> Verified Buyer
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => showToast('Thank you for your feedback!', 'success')}
                      className="flex items-center gap-1 text-stone-400 hover:text-stone-700"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rev.helpfulCount}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Similar / Recommended Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif-luxury text-stone-900">
                You May Also Like
              </h3>
              <p className="text-xs text-stone-500">Curated companions in {product.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      <ReviewsModal
        productId={product.id}
        productTitle={product.title}
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewAdded={(newRev) => {
          setReviews([newRev, ...reviews]);
          showToast('Your review has been published!', 'success');
        }}
      />
    </div>
  );
};
