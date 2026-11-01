import React, { useState, useRef, MouseEvent } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, ZoomIn, ShieldCheck } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  productTitle: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productTitle }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLDivElement>(null);
  const activeImage = images[selectedIndex] || images[0];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePos({ x, y });
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 items-start select-none">
      
      {/* Thumbnail Strip (Vertical on Desktop, Horizontal on Mobile) */}
      <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[500px] no-scrollbar w-full md:w-20 shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            onMouseEnter={() => setSelectedIndex(idx)}
            className={`relative rounded-lg overflow-hidden border-2 aspect-square w-16 md:w-full transition-all shrink-0 bg-stone-100 ${
              selectedIndex === idx
                ? 'border-amber-600 ring-2 ring-amber-600/30'
                : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={img}
              alt={`${productTitle} angle ${idx + 1}`}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Main Image Stage with Precision Magnifier */}
      <div className="relative flex-1 w-full bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs">
        <div
          ref={imageRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setShowLightbox(true)}
          className="relative aspect-[4/5] sm:aspect-square w-full cursor-crosshair overflow-hidden group"
        >
          {/* Base High-Res Photo */}
          <img
            src={activeImage}
            alt={productTitle}
            className={`w-full h-full object-cover object-center transition-opacity duration-200 ${
              isHovering ? 'opacity-0 md:opacity-100' : 'opacity-100'
            }`}
          />

          {/* Flipkart-Style In-place 2.5x Zoom Preview on Hover */}
          {isHovering && (
            <div
              className="absolute inset-0 pointer-events-none hidden md:block"
              style={{
                backgroundImage: `url(${activeImage})`,
                backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat'
              }}
            />
          )}

          {/* Lens Indicator overlay for desktop */}
          {isHovering && (
            <div
              className="hidden md:block absolute w-32 h-32 border-2 border-amber-500/70 bg-amber-500/10 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 rounded-lg backdrop-blur-2xs shadow-lg"
              style={{
                left: `${mousePos.x}%`,
                top: `${mousePos.y}%`
              }}
            />
          )}

          {/* Floating Instructions & Zoom Button */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold bg-stone-950/70 text-stone-200 px-2.5 py-1 rounded-md backdrop-blur-md">
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
              Hover to zoom 2.5x
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowLightbox(true);
              }}
              className="pointer-events-auto ml-auto inline-flex items-center gap-1 text-[11px] font-semibold bg-white/90 hover:bg-white text-stone-800 hover:text-amber-700 px-3 py-1.5 rounded-md shadow-md backdrop-blur-md border border-stone-200 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          </div>

          {/* Aura Assured Watermark */}
          <div className="absolute top-3 left-3 bg-stone-900/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-md flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            Verified HD Studio Photos
          </div>

          {/* Next / Prev on Main Image */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal (Ultra High Resolution with 4x Zoom) */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => {
            setShowLightbox(false);
            setLightboxZoom(false);
          }}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-20 pb-2 border-b border-stone-800">
            <div>
              <p className="text-sm font-semibold text-stone-200">{productTitle}</p>
              <p className="text-xs text-stone-400">
                Photo {selectedIndex + 1} of {images.length} • Click anywhere to toggle 4x zoom
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxZoom(!lightboxZoom);
                }}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold flex items-center gap-1.5 text-amber-300 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
                <span>{lightboxZoom ? 'Reset Zoom' : 'Zoom 4x'}</span>
              </button>

              <button
                onClick={() => {
                  setShowLightbox(false);
                  setLightboxZoom(false);
                }}
                className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central Image Canvas */}
          <div 
            className="flex-1 flex items-center justify-center relative overflow-hidden my-4"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxZoom(!lightboxZoom);
            }}
          >
            <img
              src={activeImage}
              alt={productTitle}
              className={`max-h-[80vh] max-w-full object-contain transition-transform duration-300 cursor-zoom-in ${
                lightboxZoom ? 'scale-200 sm:scale-250 cursor-zoom-out' : 'scale-100'
              }`}
            />

            {/* Left & Right Nav */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white shadow-xl backdrop-blur-xs z-30"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white shadow-xl backdrop-blur-xs z-30"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div 
            className="flex justify-center gap-2 overflow-x-auto py-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  selectedIndex === idx ? 'border-amber-400 scale-105' : 'border-stone-700 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
