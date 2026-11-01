import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, navigateToProduct, setCurrentView, formatPrice } = useShop();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlistItems = async () => {
      setLoading(true);
      try {
        const all = await api.getProducts();
        const saved = all.filter(p => wishlist.includes(p.id));
        setProducts(saved);
      } catch (err) {
        console.error('Failed to load wishlist items', err);
      } finally {
        setLoading(false);
      }
    };
    loadWishlistItems();
  }, [wishlist]);

  const handleMoveToBag = (product: Product) => {
    addToCart(product, 1);
    toggleWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h1 className="text-xl sm:text-2xl font-bold font-serif-luxury text-stone-900">
              My Decor Wishlist
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'handcrafted piece' : 'handcrafted pieces'} saved for your dream space
          </p>
        </div>

        <button
          onClick={() => setCurrentView('home')}
          className="text-xs font-semibold text-stone-700 hover:text-amber-700 flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Retrieving saved treasures...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-xs max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg font-serif-luxury text-stone-900 mb-1">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Tap the heart icon on any lamp, ceramic vase, mirror, or rug to save it here for later.
          </p>
          <button
            onClick={() => setCurrentView('home')}
            className="w-full py-2.5 bg-stone-900 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Discover Decor Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
            >
              <div 
                onClick={() => navigateToProduct(product.id)}
                className="relative aspect-square w-full overflow-hidden bg-stone-100 cursor-pointer"
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-rose-600 shadow-md hover:bg-white"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                    {product.category}
                  </p>
                  <h3
                    onClick={() => navigateToProduct(product.id)}
                    className="text-xs font-semibold text-stone-800 line-clamp-2 hover:text-amber-700 cursor-pointer"
                  >
                    {product.title}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-extrabold text-stone-900">{formatPrice(product.price)}</span>
                    <span className="text-xs text-stone-400 line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="text-xs font-bold text-emerald-700">{product.discountPercent}% off</span>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-1">
                    {product.inStock ? (
                      <span className="text-emerald-700 font-medium">In Stock</span>
                    ) : (
                      <span className="text-rose-600 font-medium">Out of Stock</span>
                    )}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex gap-2">
                  <button
                    onClick={() => handleMoveToBag(product)}
                    disabled={!product.inStock}
                    className="flex-1 py-2 px-3 bg-stone-900 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Move to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
