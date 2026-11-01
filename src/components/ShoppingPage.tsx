import React from 'react';
import { Sparkles, ChevronRight, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { CatalogSection } from './CatalogSection';
import { useShop } from '../context/ShopContext';

export const ShoppingPage: React.FC = () => {
  const { setCurrentView, openAiChatWithPrompt } = useShop();

  return (
    <div className="space-y-6">
      {/* Shopping Hero Strip */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <nav className="flex items-center gap-2 text-xs text-stone-400">
              <button onClick={() => setCurrentView('home')} className="hover:text-white">
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-amber-400 font-semibold">Shopping Catalog</span>
            </nav>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif-luxury tracking-tight text-white">
              Handcrafted Decor & Artisan Living
            </h1>
            <p className="text-xs sm:text-sm text-stone-300">
              Explore curated ceramic vessels, architectural lamps, hand-tufted wool rugs, and sculptural accents with live Indian Rupee (₹) and US Dollar ($) pricing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAiChatWithPrompt('Help me pick home decor items for my space based on budget and aesthetics')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-stone-950" />
              <span>Ask AI Decor Consultant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog with Sidebar Filters & Grid */}
      <CatalogSection />
    </div>
  );
};
