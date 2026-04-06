'use client';

import React from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ImageGalleryDisplayProps {
  gallery: string[];
  currentIndex: number;
  canScroll: boolean;
  scrollerRef: React.RefObject<HTMLDivElement>;
  onScroll: () => void;
  onNavigate: (index: number) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  alt?: string;
}

/**
 * Reusable image gallery component for product display
 * Supports smooth scrolling, keyboard navigation, and touch gestures
 */
export function ImageGalleryDisplay({
  gallery,
  currentIndex,
  canScroll,
  scrollerRef,
  onScroll,
  onNavigate,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  alt = 'Product image',
}: ImageGalleryDisplayProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!canScroll) return;
    if (e.key === 'ArrowLeft') onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight') onNavigate(currentIndex + 1);
  };

  return (
    <>
      {/* Main Gallery Container */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
        {canScroll ? (
          <div
            ref={scrollerRef}
            onScroll={onScroll}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onKeyDown={handleKeyDown}
            className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Product image gallery"
            tabIndex={0}
          >
            {gallery.map((src, index) => (
              <div key={`${src}-${index}`} className="relative w-full shrink-0 snap-center">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={src}
                    alt={`${alt} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={gallery[0]}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        {/* Navigation Arrows */}
        {canScroll && (
          <>
            <button
              onClick={() => onNavigate(currentIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 opacity-0 transition-all hover:bg-white/30 focus:opacity-100 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <FiChevronLeft className="h-5 w-5 text-white" />
            </button>

            <button
              onClick={() => onNavigate(currentIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 opacity-0 transition-all hover:bg-white/30 focus:opacity-100 group-hover:opacity-100"
              aria-label="Next image"
            >
              <FiChevronRight className="h-5 w-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Indicator Dots */}
      {canScroll && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {gallery.map((_, index) => (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`View image ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </>
  );
}
