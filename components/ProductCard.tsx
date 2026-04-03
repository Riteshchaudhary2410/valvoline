'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiHeart, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/store';
import { formatPackSize, getPackageVariants } from '@/lib/catalog';

interface ProductCardProps {
  product: Product;
  showPackageSizes?: boolean;
}

export default function ProductCard({ product, showPackageSizes = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedMessage, setAddedMessage] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { items, addItem, updateQuantity } = useCart();
  const router = useRouter();
  const gallery = useMemo(() => [product.image, ...(product.images || [])].filter(Boolean), [product]);
  const canScrollImages = gallery.length > 1;
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pointerStateRef = useRef<{ pointerId: number; startX: number; startScrollLeft: number; moved: boolean } | null>(null);
  const packageVariants = useMemo(() => getPackageVariants(product), [product.name, product.sku, product.packageGroup]);
  const isBikeOnly = product.vehicleTypes?.length === 1 && product.vehicleTypes[0] === 'Bike';
  const canShowPackageSizes = showPackageSizes && !isBikeOnly && packageVariants.length > 1;
  const cartQuantity = useMemo(
    () => items.find((item) => item.product.id === product.id)?.quantity ?? 0,
    [items, product.id],
  );

  useEffect(() => {
    if (!addedMessage) return;
    const timer = setTimeout(() => setAddedMessage(''), 1600);
    return () => clearTimeout(timer);
  }, [addedMessage]);

  useEffect(() => {
    setActiveImageIndex(0);
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = 0;
    }
  }, [product.slug]);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (product.stock === 0) return;
    addItem(product, 1);
    setAddedMessage('Added to cart');
  };

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const width = scroller.clientWidth || 1;
    scroller.scrollTo({ left: Math.max(0, index) * width, behavior: 'smooth' });
    setActiveImageIndex(Math.max(0, Math.min(index, gallery.length - 1)));
  };

  const handleImageScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const width = scroller.clientWidth || 1;
    const nextIndex = Math.round(scroller.scrollLeft / width);
    if (nextIndex !== activeImageIndex) setActiveImageIndex(nextIndex);
  };

  const handlePointerDown: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!canScrollImages) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    pointerStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: scroller.scrollLeft,
      moved: false,
    };
    scroller.setPointerCapture(event.pointerId);
  };

  const handlePointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    if (!canScrollImages) return;
    const state = pointerStateRef.current;
    const scroller = scrollerRef.current;
    if (!state || !scroller) return;
    const dx = event.clientX - state.startX;
    if (Math.abs(dx) > 6) state.moved = true;
    scroller.scrollLeft = state.startScrollLeft - dx;
  };

  const handlePointerUpOrCancel: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const state = pointerStateRef.current;
    const scroller = scrollerRef.current;
    if (state && scroller) {
      try {
        scroller.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    }
    pointerStateRef.current = null;
  };

  const handleClickCapture: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (!canScrollImages) return;
    const state = pointerStateRef.current;
    if (state?.moved) {
      event.preventDefault();
      event.stopPropagation();
      state.moved = false;
    }
  };

  const finalPrice = product.bulkPrice || product.price;
  const bulkDiscount = product.bulkPrice
    ? Math.round(((product.price - product.bulkPrice) / product.price) * 100)
    : 0;
  const hasInCart = cartQuantity > 0;
  const canIncrease = cartQuantity < product.stock;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary-accent/40 hover:bg-white/10">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#120605]">
            <div
              className="absolute inset-0"
              onClickCapture={handleClickCapture}
            >
              {canScrollImages ? (
                <div
                  ref={scrollerRef}
                  onScroll={handleImageScroll}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUpOrCancel}
                  onPointerCancel={handlePointerUpOrCancel}
                  onWheel={(event) => {
                    const scroller = scrollerRef.current;
                    if (!scroller) return;
                    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
                    if (scroller.scrollWidth <= scroller.clientWidth) return;
                    event.preventDefault();
                    scroller.scrollLeft += event.deltaY;
                  }}
                  className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  {gallery.map((src, index) => (
                    <div key={`${src}-${index}`} className="relative h-full w-full shrink-0 snap-center">
                      <Image
                        src={src}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="badge badge-primary">{product.type.replace(/_/g, ' ')}</span>
              {product.featured && <span className="badge badge-secondary">Featured</span>}
            </div>

            {canScrollImages ? (
              <>
                <div className="absolute right-14 top-4 flex items-center gap-1 rounded-full border border-white/10 bg-black/30 px-2 py-1 backdrop-blur">
                  {gallery.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white/40'}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    scrollToIndex(activeImageIndex - 1);
                  }}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 p-2 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 sm:pointer-events-auto"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    scrollToIndex(activeImageIndex + 1);
                  }}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 p-2 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 sm:pointer-events-auto"
                >
                  <FiChevronRight size={18} />
                </button>
              </>
            ) : null}

            <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/10 bg-black/40 p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  
                  <p className="mt-1 text-lg font-semibold leading-tight text-white">{product.name}</p>
                </div>
                {product.viscosity && (
                  <span className="rounded-full bg-primary-accent px-3 py-1 text-xs font-bold text-[#1b0c04]">
                    {product.viscosity}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        <button
          onClick={() => setIsWishlisted((prev) => !prev)}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 p-3 text-white transition-colors hover:border-primary-accent hover:text-primary-accent"
          aria-label="Wishlist"
        >
          <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div
        role="link"
        tabIndex={0}
        onClick={() => router.push(`/products/${product.slug}`)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            router.push(`/products/${product.slug}`);
          }
        }}
        className="flex flex-1 cursor-pointer flex-col gap-4 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
        aria-label={`View details for ${product.name}`}
      >
        <p className="line-clamp-2 text-[13px] leading-6 text-gray-300">{product.description}</p>
        <div className="flex items-center gap-1 text-sm text-amber-300">
          {Array.from({ length: 5 }).map((_, i) => (
            <FiStar key={i} size={14} fill="currentColor" />
          ))}
          <span className="ml-1 text-gray-500">(garage-trusted)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.vehicleTypes?.map((type) => (
            <span key={type} className="badge badge-secondary">
              {type}
            </span>
          ))}
        </div>

        {canShowPackageSizes ? (
          <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gray-500">
              Pack size <span className="font-semibold tracking-normal text-gray-500">(Pack of 1)</span>
            </p>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {packageVariants.map((variant) => {
                const isSelected = variant.slug === product.slug;
                return (
                  <button
                    key={variant.slug}
                    type="button"
                    aria-label={`${variant.name} ${formatPackSize(variant)} (Pack of 1)`}
                    aria-current={isSelected ? 'page' : undefined}
                    disabled={isSelected}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (isSelected) return;
                      router.push(`/products/${variant.slug}`);
                    }}
                    className={`min-w-[7.25rem] rounded-2xl border bg-black/20 px-3 py-2 text-left text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 ${
                      isSelected
                        ? 'cursor-default border-[#1d5db8] ring-2 ring-[#1d5db8]/25'
                        : 'border-white/10 hover:border-primary-accent/40'
                    }`}
                  >
                    <p className="text-sm font-black leading-snug">{formatPackSize(variant)}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-300">{formatPrice(variant.bulkPrice || variant.price)}</p>
                  </button>
                );
              })}
            </div>
          </div>
          
        ) : 
        (
          
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
            <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
              <p className="text-gray-500">Quantity</p>
              <p className="mt-1 font-semibold text-white">
                {product.quantity} {product.quantityUnit}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
              <p className="text-gray-500">Use case</p>
              <p className="mt-1 line-clamp-2 font-semibold text-white">{product.useCase || 'Workshop and retail use'}</p>
            </div>
          </div>
        )}
        

        <div className="flex items-stretch  gap-3">
          <div className="min-w-0 flex-1 rounded-3xl border border-primary-accent/15 bg-primary-accent/10 px-4 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary-accent">Price</p>
              <p className="min-w-0 truncate text-[10px] font-semibold text-gray-400">
                {product.bulkPrice ? `Save ${bulkDiscount}% • ${product.stock} in stock` : `${product.stock} in stock`}
              </p>
            </div>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-black text-white">{formatPrice(finalPrice)}</span>
              {product.bulkPrice ? (
                <span className="text-xs font-semibold text-gray-500 line-through">{formatPrice(product.price)}</span>
              ) : null}
            </div>
          </div>
          

          <div className="rounded-3xl border border-white/10 bg-black/15 p-2 flex flex-col h-full justify-center">
            <div
              className={`relative h-12 overflow-hidden rounded-2xl bg-primary-accent text-[#1b0c04] shadow-[0_16px_38px_rgba(246,139,44,0.24)] transition-[width] duration-300 ease-out focus-within:ring-2 focus-within:ring-primary-accent/60 focus-within:ring-offset-2 focus-within:ring-offset-black/30 ${
                hasInCart ? 'w-24' : 'w-24'
              }`}
            >
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`absolute inset-0 flex h-11 w-full items-center justify-center gap-2 px-3 text-sm font-black transition-all duration-300 ${
                  hasInCart ? 'pointer-events-none translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
                } disabled:cursor-not-allowed disabled:opacity-60`}
                aria-label={`Add ${product.name} to cart`}
              >
                <FiShoppingCart size={16} />
                Add
              </button>

              <div
                className={`absolute inset-0 flex h-11 w-full items-center justify-between px-2 transition-all duration-300 ${
                  hasInCart ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                }`}
                aria-label={`${product.name} quantity in cart`}
              >
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    updateQuantity(product.id, cartQuantity - 1);
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/10 text-lg font-black transition-colors hover:bg-black/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                >
                  -
                </button>
                <span className="min-w-[2.25rem] text-center text-sm font-black tabular-nums">{cartQuantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={!canIncrease}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    updateQuantity(product.id, cartQuantity + 1);
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-black/10 text-lg font-black transition-colors hover:bg-black/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {addedMessage ? <p className="text-xs font-semibold text-emerald-300">{addedMessage}</p> : null}



        {canShowPackageSizes && product.useCase ? <p className="line-clamp-1 text-xs text-gray-500">Use case: {product.useCase}</p> : null}
      </div>
    </div>
  );
}
