import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Tag, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const BannerSlider: React.FC = () => {
  const { setSelectedCategory, showToast } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'Grand Living Fest: Handcrafted Sanctuaries',
      tagline: 'Mouth-blown glass lighting, fluted ceramics & wool rugs',
      discount: 'UP TO 50% OFF',
      code: 'FESTIVE25',
      category: 'Lighting & Lamps',
      bgGradient: 'from-stone-900 via-stone-800 to-amber-950',
      accentColor: 'text-amber-400',
      badge: 'Festive Season Exclusive',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 2,
      title: 'Nordic Organic Vases & Sculptural Vessels',
      tagline: 'Curated stoneware and matte terracotta centerpieces',
      discount: 'FLAT 40% OFF',
      code: 'AURALUXE15',
      category: 'Vases & Planters',
      bgGradient: 'from-amber-950 via-stone-900 to-stone-950',
      accentColor: 'text-amber-300',
      badge: 'Artisan Crafted',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 3,
      title: 'Hand-Tufted Moroccan & Berber Wool Rugs',
      tagline: 'Pure New Zealand virgin wool, cloud-soft underfoot comfort',
      discount: 'UP TO 45% OFF',
      code: 'FESTIVE25',
      category: 'Rugs & Cushions',
      bgGradient: 'from-stone-950 via-neutral-900 to-stone-900',
      accentColor: 'text-amber-400',
      badge: 'Heritage Loom Collection',
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=85'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2">
      {/* Hero Carousel Banner */}
      <div className={`relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r ${slide.bgGradient} text-white min-h-[300px] sm:min-h-[360px] flex items-center transition-all duration-700`}>
        
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-luminosity overflow-hidden">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover transform scale-105 transition-transform duration-1000"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-12 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {slide.badge}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-serif-luxury leading-tight mb-2">
            {slide.title}
          </h1>

          <p className="text-stone-300 text-sm sm:text-base font-light mb-4 sm:mb-6 max-w-lg">
            {slide.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedCategory(slide.category)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-lg text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              Shop {slide.category}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(slide.code);
                showToast(`Copied code "${slide.code}" to clipboard!`, 'success');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-amber-200 transition-colors cursor-pointer"
              title="Click to copy coupon"
            >
              <Tag className="w-3.5 h-3.5" />
              Use Code: <span className="font-bold underline">{slide.code}</span>
            </button>
          </div>
        </div>

        {/* Slide Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Flipkart-Style Value Assurance Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">DECORIVA Certified Quality</p>
            <p className="text-[11px] text-stone-500">6-point artisan inspection</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">Swift Express Delivery</p>
            <p className="text-[11px] text-stone-500">Real-time live map tracking</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">7-Day Free Replacement</p>
            <p className="text-[11px] text-stone-500">No questions asked return</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200/80 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">100% Genuine Handcrafted</p>
            <p className="text-[11px] text-stone-500">Direct from artisan studios</p>
          </div>
        </div>
      </div>
    </div>
  );
};
