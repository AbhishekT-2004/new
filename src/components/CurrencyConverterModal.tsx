import React, { useState } from 'react';
import { X, ArrowRightLeft, Calculator, Check, Info, Sparkles } from 'lucide-react';
import { useShop, USD_TO_INR_RATE } from '../context/ShopContext';

export const CurrencyConverterModal: React.FC = () => {
  const {
    currency,
    setCurrency,
    currencyConverterOpen,
    setCurrencyConverterOpen,
    exchangeRate,
    showToast
  } = useShop();

  const [usdInput, setUsdInput] = useState<string>('50');
  const [inrInput, setInrInput] = useState<string>(String(Math.round(50 * exchangeRate)));

  if (!currencyConverterOpen) return null;

  const handleUsdChange = (val: string) => {
    setUsdInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setInrInput(String(Math.round(num * exchangeRate)));
    } else {
      setInrInput('');
    }
  };

  const handleInrChange = (val: string) => {
    setInrInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setUsdInput((num / exchangeRate).toFixed(2));
    } else {
      setUsdInput('');
    }
  };

  const presets = [10, 25, 50, 100, 250, 500];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
                <span>Dollar into Rupees Converter</span>
                <span className="text-[10px] bg-amber-500 text-stone-950 font-extrabold px-1.5 py-0.2 rounded uppercase">
                  Live Rate
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                DECORIVA Currency Conversion & Localization Engine
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrencyConverterOpen(false)}
            className="text-stone-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Active Store Currency Selector */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-stone-800">Current Store Currency</p>
              <p className="text-[11px] text-stone-500">
                All catalog items, checkout & invoices display in this format
              </p>
            </div>
            <div className="flex bg-stone-200/80 p-0.5 rounded-lg border border-stone-300">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                  currency === 'INR'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                <span>₹ INR</span>
                {currency === 'INR' && <Check className="w-3 h-3" />}
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all flex items-center gap-1 ${
                  currency === 'USD'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                <span>$ USD</span>
                {currency === 'USD' && <Check className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Live Exchange Formula Card */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 p-3.5 rounded-xl border border-amber-200 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Conversion Method (1 USD = ₹{exchangeRate.toFixed(2)} INR)</span>
            </div>
            <p className="text-[11px] text-amber-800 font-mono leading-relaxed">
              • Formula 1 (USD → INR): <span className="font-bold">₹ Amount = $ USD × {exchangeRate}</span>
              <br />
              • Formula 2 (INR → USD): <span className="font-bold">$ Amount = ₹ INR ÷ {exchangeRate}</span>
            </p>
          </div>

          {/* Interactive Calculator Inputs */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Dollar Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span>US Dollars ($)</span>
                  <span className="text-[10px] text-stone-400">USD</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={usdInput}
                    onChange={(e) => handleUsdChange(e.target.value)}
                    placeholder="Enter USD"
                    className="w-full pl-8 pr-3 py-2 text-sm font-semibold border border-stone-200 rounded-lg outline-none focus:border-amber-600 font-mono bg-white"
                  />
                </div>
              </div>

              {/* Rupees Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                  <span>Indian Rupees (₹)</span>
                  <span className="text-[10px] text-stone-400">INR</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={inrInput}
                    onChange={(e) => handleInrChange(e.target.value)}
                    placeholder="Enter INR"
                    className="w-full pl-8 pr-3 py-2 text-sm font-semibold border border-stone-200 rounded-lg outline-none focus:border-amber-600 font-mono bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Quick Conversion Presets */}
            <div>
              <p className="text-[11px] font-semibold text-stone-500 mb-1.5">Quick Dollar Presets:</p>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((amt) => {
                  const inrEq = Math.round(amt * exchangeRate);
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setUsdInput(String(amt));
                        setInrInput(String(inrEq));
                      }}
                      className="px-2.5 py-1 text-[11px] rounded-lg border border-stone-200 hover:border-amber-600 hover:bg-amber-50/50 transition-colors font-mono text-stone-700"
                    >
                      ${amt} = ₹{inrEq.toLocaleString('en-IN')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Academic / Project Note */}
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <p>
              <span className="font-semibold text-stone-800">College Project Implementation Note:</span> Multi-currency conversion uses standard ISO 4217 formatting with Indian numerical notation (<span className="font-mono">en-IN</span> lakhs & thousands). Toggle anytime to see all product prices adapt dynamically.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              const newCur = currency === 'INR' ? 'USD' : 'INR';
              setCurrency(newCur);
              showToast(`Switched store currency to ${newCur === 'INR' ? 'Rupees (₹)' : 'Dollars ($)'}`, 'success');
            }}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Switch to {currency === 'INR' ? '$ USD' : '₹ INR'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setCurrencyConverterOpen(false)}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
