import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Star, 
  ShieldCheck, 
  ChevronDown, 
  SlidersHorizontal,
  Sliders,
  Grid3X3,
  Layers
} from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/mockProducts';

export const CatalogSection: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
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
    formatPrice
  } = useShop();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const prods = await api.getProducts({
          category: selectedCategory,
          search: searchQuery,
          inStock: inStockFilter
        });
        setProducts(prods);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, searchQuery, inStockFilter]);

  // Apply client-side filters (Price range, Ratings, Assured, Sort)
  const filteredProducts = products.filter((p) => {
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (ratingFilter > 0 && p.rating < ratingFilter) return false;
    if (assuredFilter && p.badge !== 'Aura Assured' && p.badge !== 'DECORIVA Assured') return false;
    return true;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    return 0; // relevance / default
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8" id="catalog">
      
      {/* Top Bar with count, active query & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-stone-900 flex items-center gap-2">
            <span>{selectedCategory}</span>
            {searchQuery && (
              <span className="text-xs font-normal text-stone-500 font-sans">
                for "{searchQuery}"
              </span>
            )}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Showing {sortedProducts.length} handcrafted pieces • Free Express Delivery
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3 py-2 rounded-lg border border-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Filters</span>
          </button>

          {/* Flipkart-Style Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="font-semibold text-stone-500 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 outline-none focus:border-amber-600 shadow-2xs"
            >
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Flipkart-Style Left Filter Sidebar */}
        <div className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="font-bold text-xs uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" /> Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] font-semibold text-stone-500 hover:text-amber-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                Categories
              </h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-amber-50 text-amber-900 font-bold border-l-2 border-amber-600'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="border-t border-stone-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Price Range
                </h4>
                <span className="text-xs font-bold font-mono text-amber-800">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={500}
                step={10}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(250)}</span>
                <span>{formatPrice(500)}+</span>
              </div>
            </div>

            {/* Customer Rating Filter */}
            <div className="border-t border-stone-100 pt-4">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Customer Rating
              </h4>
              <div className="space-y-1.5 text-xs text-stone-700">
                {[4, 3].map((stars) => (
                  <label key={stars} className="flex items-center gap-2 cursor-pointer hover:text-stone-900">
                    <input
                      type="radio"
                      name="ratingFilter"
                      checked={ratingFilter === stars}
                      onChange={() => setRatingFilter(ratingFilter === stars ? 0 : stars)}
                      className="accent-amber-600"
                    />
                    <span className="flex items-center gap-1 font-medium">
                      {stars}★ & above
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-2 cursor-pointer hover:text-stone-900">
                  <input
                    type="radio"
                    name="ratingFilter"
                    checked={ratingFilter === 0}
                    onChange={() => setRatingFilter(0)}
                    className="accent-amber-600"
                  />
                  <span>All Ratings</span>
                </label>
              </div>
            </div>

            {/* Assured & In-Stock Toggles */}
            <div className="border-t border-stone-100 pt-4 space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer text-xs">
                <span className="flex items-center gap-1.5 font-medium text-stone-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> DECORIVA Assured Only
                </span>
                <input
                  type="checkbox"
                  checked={assuredFilter}
                  onChange={(e) => setAssuredFilter(e.target.checked)}
                  className="rounded accent-amber-600 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-xs">
                <span className="font-medium text-stone-800">In Stock Items Only</span>
                <input
                  type="checkbox"
                  checked={inStockFilter}
                  onChange={(e) => setInStockFilter(e.target.checked)}
                  className="rounded accent-amber-600 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

          </div>
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-stone-500">Curating luxury decor pieces...</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                <Sliders className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg font-serif-luxury text-stone-900 mb-1">
                No matching home decor found
              </h3>
              <p className="text-xs text-stone-500 mb-5 max-w-sm mx-auto">
                Try widening your price range or clearing specific filter tags to discover other artisan pieces.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </section>
  );
};
