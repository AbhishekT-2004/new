import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ShoppingBag, 
  ArrowRight, 
  RotateCcw, 
  ChevronRight,
  Maximize2,
  Minimize2,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  recommendedProducts?: Product[];
  timestamp: string;
}

export const AIChatbot: React.FC = () => {
  const { 
    aiChatOpen, 
    setAiChatOpen, 
    initialAiPrompt, 
    navigateToProduct, 
    addToCart, 
    showToast,
    formatPrice,
    currency,
    exchangeRate,
    setCurrencyConverterOpen
  } = useShop();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello! I am your **DECORIVA AI Decor Stylist**. Whether you're refreshing a cozy corner, choosing statement lighting, or curating artisanal centerpieces, I'm here to recommend the perfect handcrafted decor pieces from our catalog.",
      recommendedProducts: [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1]],
      timestamp: 'Just now'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (aiChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
      if (initialAiPrompt) {
        handleSendMessage(initialAiPrompt);
      }
    }
  }, [aiChatOpen, initialAiPrompt]);

  const quickPrompts = [
    '🛋️ Style my living room console',
    '💡 Warm ambient lamps for bedroom',
    '🎁 Housewarming gifts under $100',
    '🌿 Vases for dried pampas grass',
    '📐 How to choose the right rug size'
  ];

  // Intelligent Decoriva AI Knowledge & Product Matching Engine
  const generateAIResponse = (userQuery: string): { text: string; recommendedProducts?: Product[] } => {
    const q = userQuery.toLowerCase();
    const matchedProducts: Product[] = [];

    // Keyword matching with catalog
    if (q.includes('vase') || q.includes('pampas') || q.includes('flower') || q.includes('console') || q.includes('ceramic') || q.includes('plant')) {
      const vase = INITIAL_PRODUCTS.find(p => p.id === 'prod-1');
      if (vase) matchedProducts.push(vase);
    }

    if (q.includes('lamp') || q.includes('light') || q.includes('pendant') || q.includes('glow') || q.includes('ambient') || q.includes('ceiling') || q.includes('brass')) {
      const lamp = INITIAL_PRODUCTS.find(p => p.id === 'prod-2');
      const mushroom = INITIAL_PRODUCTS.find(p => p.id === 'prod-8');
      if (lamp) matchedProducts.push(lamp);
      if (mushroom && !matchedProducts.includes(mushroom)) matchedProducts.push(mushroom);
    }

    if (q.includes('mirror') || q.includes('dressing') || q.includes('arch') || q.includes('wall') || q.includes('entryway') || q.includes('hallway')) {
      const mirror = INITIAL_PRODUCTS.find(p => p.id === 'prod-3');
      if (mirror) matchedProducts.push(mirror);
    }

    if (q.includes('rug') || q.includes('carpet') || q.includes('wool') || q.includes('floor') || q.includes('feet') || q.includes('living room')) {
      const rug = INITIAL_PRODUCTS.find(p => p.id === 'prod-4');
      if (rug && !matchedProducts.includes(rug)) matchedProducts.push(rug);
    }

    if (q.includes('sculpture') || q.includes('bronze') || q.includes('art') || q.includes('mantel') || q.includes('bookshelf') || q.includes('accent')) {
      const sculpture = INITIAL_PRODUCTS.find(p => p.id === 'prod-5');
      if (sculpture) matchedProducts.push(sculpture);
    }

    if (q.includes('tea') || q.includes('coffee') || q.includes('kitchen') || q.includes('dining') || q.includes('cup') || q.includes('wabi')) {
      const tea = INITIAL_PRODUCTS.find(p => p.id === 'prod-6');
      if (tea) matchedProducts.push(tea);
    }

    if (q.includes('table') || q.includes('travertine') || q.includes('marble') || q.includes('stone') || q.includes('furniture')) {
      const table = INITIAL_PRODUCTS.find(p => p.id === 'prod-7');
      if (table) matchedProducts.push(table);
    }

    if (q.includes('under 100') || q.includes('gift') || q.includes('budget') || q.includes('cheap')) {
      const affordable = INITIAL_PRODUCTS.filter(p => p.price <= 100);
      matchedProducts.push(...affordable.slice(0, 2));
    }

    // Default fallback if no specific keywords matched
    if (matchedProducts.length === 0) {
      matchedProducts.push(INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1]);
    }

    // Curate tailored stylist response
    if (q.includes('console') || q.includes('style my living room')) {
      return {
        text: "For a balanced, high-end living room console, the secret lies in the **'Rule of Thirds'** and height contrast:\n\n1. **Vertical Anchor**: Place our **Nordic Fluted Matte Ceramic Floor Vase** (or on a console corner) filled with tall dried botanicals.\n2. **Ambient Glow**: Add our **Smoked Amber Glass Mushroom Lamp** on the opposite side to provide cozy, 2700K warm halo lighting.\n3. **Sculptural Accent**: Anchor the center with the **Abstract Organic Cast Bronze Human Silhouette**.\n\nHere are the recommended artisan pieces for this look:",
        recommendedProducts: matchedProducts
      };
    }

    if (q.includes('lamp') || q.includes('light') || q.includes('glow')) {
      return {
        text: "Lighting sets the emotional tone of your home. We recommend layered lighting:\n\n• For overhead dining islands or reading nooks, our **Aura Brass & Frosted Opal Globe Pendant** diffuses light without glare.\n• For intimate bedside or shelf warmth, the **Smoked Amber Glass Mushroom Lamp** features 3-level dimming with 1970s retro elegance.\n\nExplore these handcrafted lighting pieces:",
        recommendedProducts: matchedProducts
      };
    }

    if (q.includes('rug') || q.includes('size')) {
      return {
        text: "When selecting a living room rug, ensure at least the front two legs of all seating rest on the rug to unify the conversation zone.\n\nOur **Hand-Tufted Berber Wool Geometric Area Rug (5ft x 8ft)** is handwoven in Rajasthan with 100% natural un-dyed New Zealand virgin wool. The 1.2-inch plush pile provides cloud-like comfort and natural sound absorption.",
        recommendedProducts: matchedProducts
      };
    }

    if (q.includes('gift') || q.includes('under 100')) {
      return {
        text: "Thoughtful housewarming and festive gifts that combine functional artistry under $100:\n\n• **Japanese Wabi-Sabi Ceramic Matcha & Tea Set ($79)**: Comes with a wooden bamboo tray and 4 cups.\n• **Smoked Amber Glass Mushroom Lamp ($69)**: Dimmable ambient luxury.\n• **Abstract Organic Cast Bronze Silhouette ($65)**: Timeless desk or mantel sculpture.",
        recommendedProducts: matchedProducts
      };
    }

    if (q.includes('rupee') || q.includes('rupees') || q.includes('dollar into rupee') || q.includes('inr') || q.includes('currency') || q.includes('convert')) {
      return {
        text: `**DECORIVA Dollar into Rupees Conversion Method:**\n\n• **Exchange Rate**: $1.00 USD = ₹${exchangeRate.toFixed(2)} INR\n• **Formula (USD to INR)**: Price in ₹ = Price in $ × ${exchangeRate.toFixed(2)}\n• **Formula (INR to USD)**: Price in $ = Price in ₹ ÷ ${exchangeRate.toFixed(2)}\n\nYou can switch between **₹ INR** and **$ USD** in the top navigation bar at any time. All items, discounts, and checkout invoices update automatically!`,
        recommendedProducts: matchedProducts.slice(0, 2)
      };
    }

    if (q.includes('mirror')) {
      return {
        text: "Arched mirrors instantly double perceived natural light and create architectural height. Our **Minimalist Arch Full-Length Dressing Mirror** uses 5mm copper-free HD glass with an explosion-proof membrane and champagne gold aerospace aluminum frame. It can either lean on its easel or mount flush to the wall.",
        recommendedProducts: matchedProducts
      };
    }

    return {
      text: `Based on your request, I recommend focusing on natural textures like honed stone, matte ceramics, and warm metallic accents. These cohesive elements bring warmth and organic serenity to any modern space.\n\nTake a look at these curated DECORIVA highlights:`,
      recommendedProducts: matchedProducts.slice(0, 2)
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(text);
      const botMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        recommendedProducts: response.recommendedProducts,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 750);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: "Chat refreshed! Tell me about the room, aesthetic, or budget you're looking to transform.",
        recommendedProducts: [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1]],
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Always visible on mobile & desktop) */}
      {!aiChatOpen && (
        <div className="fixed bottom-6 right-6 z-40 group">
          <button
            onClick={() => setAiChatOpen(true)}
            className="flex items-center gap-2.5 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:shadow-amber-500/20 border border-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Open DECORIVA AI Decor Stylist Chatbot"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md">
                <Sparkles className="w-4 h-4 fill-stone-950 text-stone-950 animate-spin-slow" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-stone-900 rounded-full animate-pulse" />
            </div>

            <div className="text-left">
              <p className="text-xs font-bold leading-tight flex items-center gap-1 text-white">
                DECORIVA AI <span className="text-amber-400">Stylist</span>
              </p>
              <p className="text-[10px] text-stone-400 leading-tight">
                Ask interior styling advice
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Floating AI Chat Window */}
      {aiChatOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-2xl border border-stone-200 overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-2xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white p-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 fill-stone-950" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-stone-900 rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm font-serif-luxury tracking-wide text-white">
                    DECOR<span className="text-amber-400">IVA</span> AI Stylist
                  </h3>
                  <span className="bg-amber-400/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  Interior Designer & Product Recommender
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-stone-400">
              <button
                onClick={handleResetChat}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Restart Chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setAiChatOpen(false)}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Carousel Strip */}
          <div className="bg-stone-50 border-b border-stone-200/80 px-3 py-2 overflow-x-auto no-scrollbar flex gap-1.5 whitespace-nowrap">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt.replace(/^[^\w\s]+/, '').trim())}
                className="text-[11px] font-medium bg-white hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-stone-200 text-stone-700 px-2.5 py-1 rounded-full transition-all shrink-0 shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-stone-900 text-white rounded-tr-none'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Interactive In-Chat Recommended Products */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" /> Recommended for You:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.recommendedProducts.map((p) => (
                          <div
                            key={p.id}
                            className="p-2 rounded-xl bg-stone-50 hover:bg-amber-50/50 border border-stone-200 flex flex-col justify-between transition-colors group"
                          >
                            <div className="flex gap-2">
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-12 h-12 rounded-lg object-cover bg-stone-200 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <h5 
                                  onClick={() => {
                                    navigateToProduct(p.id);
                                    if (!isExpanded) setAiChatOpen(false);
                                  }}
                                  className="text-[11px] font-bold text-stone-900 line-clamp-1 hover:text-amber-700 cursor-pointer"
                                >
                                  {p.title}
                                </h5>
                                <p className="text-[10px] text-stone-400 capitalize">{p.category}</p>
                                <div className="flex items-baseline gap-1 mt-0.5">
                                  <span className="font-extrabold text-stone-900 text-xs">{formatPrice(p.price)}</span>
                                  <span className="text-[10px] text-stone-400 line-through">{formatPrice(p.originalPrice)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-1.5 mt-2 pt-1 border-t border-stone-200/60">
                              <button
                                onClick={() => {
                                  addToCart(p, 1);
                                  showToast(`Added ${p.title} to bag!`, 'success');
                                }}
                                className="flex-1 py-1 px-1.5 bg-stone-900 hover:bg-amber-700 text-white rounded text-[10px] font-semibold flex items-center justify-center gap-1"
                              >
                                <ShoppingBag className="w-3 h-3" /> Add
                              </button>
                              <button
                                onClick={() => {
                                  navigateToProduct(p.id);
                                  if (!isExpanded) setAiChatOpen(false);
                                }}
                                className="py-1 px-2 border border-stone-200 hover:border-amber-600 text-stone-700 text-[10px] rounded font-medium"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1.5 ${
                      msg.sender === 'user' ? 'text-stone-400 text-right' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-stone-500 bg-white border border-stone-200 rounded-2xl rounded-tl-none p-3 max-w-[140px]">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium ml-1">Styling...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask about materials, room styling, or decor pieces..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs bg-stone-100 focus:bg-white border border-stone-200 focus:border-amber-600 rounded-xl outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 bg-stone-900 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between mt-2 text-[10px] text-stone-400 px-1">
              <span>DECORIVA AI Decor Assistant</span>
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Live Catalog Synced
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
