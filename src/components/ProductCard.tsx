import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateToProduct, addToCart, toggleWishlist, isInWishlist, formatPrice } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const wishlisted = isInWishlist(product.id);

  // If there are at least 2 images, switch to second on hover
  const displayImage = isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-xl border border-stone-200/80 hover:border-amber-400 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Top Image Container */}
      <div 
        onClick={() => navigateToProduct(product.id)}
        className="relative aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer"
      >
        <img
          src={displayImage}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide shadow-xs ${
              product.badge === 'DECORIVA Assured' || product.badge === 'Aura Assured'
                ? 'bg-amber-500 text-stone-950 flex items-center gap-0.5' 
                : product.badge === 'Bestseller' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-stone-900 text-amber-300'
            }`}>
              {(product.badge === 'DECORIVA Assured' || product.badge === 'Aura Assured') && <ShieldCheck className="w-2.5 h-2.5" />}
              {product.badge === 'Aura Assured' ? 'DECORIVA Assured' : product.badge}
            </span>
          )}

          {product.discountPercent >= 40 && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-600 text-white">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all z-20 ${
            wishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/80 text-stone-600 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Urgent Stock Pill */}
        {product.inStock && product.stockQuantity <= 5 && (
          <div className="absolute bottom-2 left-2.5 right-2.5 bg-amber-900/90 text-amber-200 text-[10px] font-medium px-2 py-0.5 rounded text-center backdrop-blur-xs flex items-center justify-center gap-1">
            <Zap className="w-2.5 h-2.5 text-amber-400" />
            Only {product.stockQuantity} left in stock!
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
            {product.category}
          </p>

          {/* Title */}
          <h3
            onClick={() => navigateToProduct(product.id)}
            className="text-xs sm:text-sm font-semibold text-stone-800 group-hover:text-amber-700 line-clamp-2 cursor-pointer transition-colors leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Flipkart-Style Rating Badge */}
          <div className="flex items-center gap-2 mt-2">
            <div className="inline-flex items-center gap-1 bg-emerald-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
            <span className="text-[11px] text-stone-500 font-medium">
              ({product.reviewCount})
            </span>
            <span className="text-[10px] text-emerald-700 font-medium hidden sm:inline">
              Assured
            </span>
          </div>

          {/* Price details */}
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-base sm:text-lg font-extrabold text-stone-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-stone-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-xs font-bold text-emerald-700">
              {product.discountPercent}% off
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
            <span className="text-emerald-700 font-medium">Free delivery</span>
            <span>•</span>
            <span>In {product.deliveryDays} days</span>
          </div>
        </div>

        {/* Quick Add To Cart Button */}
        <div className="mt-3.5 pt-3 border-t border-stone-100 flex gap-2">
          <button
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              product.inStock
                ? 'bg-stone-900 hover:bg-amber-700 text-white active:scale-95 shadow-xs'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          <button
            onClick={() => navigateToProduct(product.id)}
            className="py-2 px-2.5 rounded-lg border border-stone-200 hover:border-amber-600 text-stone-600 hover:text-amber-700 text-xs font-medium transition-colors"
            title="View Details"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
