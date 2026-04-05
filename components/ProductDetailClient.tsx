'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiCheck, FiHeart, FiShoppingCart, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/store';
import { formatPackSize, getPackageVariants } from '@/lib/catalog';

type ProductView = Omit<Product, 'createdAt' | 'updatedAt'>;

interface ProductDetailClientProps {
  product: ProductView;
  relatedProducts: ProductView[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [mainImage, setMainImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { items, addItem, updateQuantity } = useCart();
  const router = useRouter();

  const gallery = useMemo(() => [product.image, ...(product.images || [])].filter(Boolean), [product]);
  const canScrollImages = gallery.length > 1;
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const finalPrice = product.bulkPrice || product.price;
  const bulkDiscount = product.bulkPrice
    ? Math.round(((product.price - product.bulkPrice) / product.price) * 100)
    : 0;
  const packageVariants = useMemo(() => getPackageVariants(product), [product.name, product.sku, product.packageGroup]);
  const cartQuantity = useMemo(
    () => items.find((item) => item.product.id === product.id)?.quantity ?? 0,
    [items, product.id],
  );
  const hasInCart = cartQuantity > 0;
  const canIncrease = cartQuantity < product.stock;

  useEffect(() => {
    setMainImage(0);
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
  }, [product.slug]);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addItem(product as Product, 1);
  };

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      setMainImage(Math.max(0, Math.min(index, gallery.length - 1)));
      return;
    }
    const width = scroller.clientWidth || 1;
    const nextIndex = Math.max(0, Math.min(index, gallery.length - 1));
    scroller.scrollTo({ left: nextIndex * width, behavior: 'smooth' });
    setMainImage(nextIndex);
  };

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const width = scroller.clientWidth || 1;
    const nextIndex = Math.round(scroller.scrollLeft / width);
    if (nextIndex !== mainImage) setMainImage(nextIndex);
  };

  return (
    <main className="min-h-screen">
      <div className="container-max py-8 md:py-12">
        <div className="mb-8 flex items-center gap-3 text-sm text-gray-400">
          <Link href="/products" className="inline-flex items-center gap-2 transition-colors hover:text-primary-accent">
            <FiArrowLeft />
            Back to products
          </Link>
          <span>/</span>
          <Link href={`/products?oilType=${product.type}`} className="transition-colors hover:text-primary-accent">
            {product.type.replace(/_/g, ' ')}
          </Link>
          <span>/</span>
          <span className="text-primary-accent">{product.name}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              {canScrollImages ? (
                <div
                  ref={scrollerRef}
                  onScroll={handleScroll}
                  className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  {gallery.map((src, index) => (
                    <div key={`${src}-${index}`} className="relative w-full shrink-0 snap-center">
                      <div className="relative aspect-[4/5] w-full">
                        <Image
                          src={src}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          sizes="(min-width: 1024px) 48vw, 100vw"
                          className="object-contain p-8"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={gallery[0] || product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="object-contain p-8"
                  />
                </div>
              )}

              {canScrollImages ? (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() => scrollToIndex(mainImage - 1)}
                    disabled={mainImage === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 p-2 text-white backdrop-blur transition-colors hover:bg-black/45 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => scrollToIndex(mainImage + 1)}
                    disabled={mainImage === gallery.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 p-2 text-white backdrop-blur transition-colors hover:bg-black/45 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiChevronRight size={18} />
                  </button>

                  <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                    {gallery.map((_, index) => (
                      <span
                        key={index}
                        className={`h-1.5 w-1.5 rounded-full ${index === mainImage ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex max-w-full gap-3 overflow-x-auto pb-1 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => scrollToIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#120605] md:h-auto md:w-full md:shrink md:aspect-square ${
                    index === mainImage ? 'border-primary-accent' : 'border-white/10 hover:border-primary-accent/40'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={72}
                    height={72}
                    className="h-full w-full object-contain p-2 md:p-3"
                  />
                </button>
              ))}
            </div>
         //==<div className="flex items-stretch  gap-3">
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
                       <p>{product.bulkPrice && <p className="mt-2 text-sm text-emerald-300">Save {bulkDiscount}% on bulk-friendly pricing</p>}</p>
                     </div>
                   </div>
                   
         
                   <div className="rounded-3xl border border-white/10 bg-black/15 p-2 flex flex-col h-full justify-center">
                     <div
                       className={`relative h-12 overflow-hidden rounded-2xl bg-primary-accent text-[#1b0c04] shadow-[0_16px_38px_rgba(246,139,44,0.24)] transition-[width] duration-300 ease-out focus-within:ring-2 focus-within:ring-primary-accent/60 focus-within:ring-offset-2 focus-within:ring-offset-black/30 ${
                         hasInCart ? 'w-32' : 'w-24'
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
             ====
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
                       
                     
              
          </div>
          

          <div className="space-y-8">
            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex  items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-primary">{product.type.replace(/_/g, ' ')}</span>
                    {product.featured && <span className="badge badge-secondary">Featured</span>}
                    {product.bulkPrice && <span className="badge badge-success">Bulk price</span>}
          
                  </div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-500">{product.brand}</p>
                  <h1 className="text-3xl font-bold md:text-5xl">{product.name}</h1>

                </div>
                <button
    onClick={() => setIsWishlisted((prev) => !prev)}
    className="mt-1 shrink-0 rounded-full border border-white/10 bg-white/5 p-3 text-gray-200 transition-all duration-300 hover:border-orange-400 hover:text-orange-400 hover:-translate-y-1"
  >
    <FiHeart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
  </button>
                
               
              </div>

              <div className="flex items-center gap-2 text-amber-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} size={16} fill="currentColor" />
                ))}
                <span className="text-sm text-gray-400">(trusted by retail and garage buyers)</span>
              </div>

              <p className="max-w-3xl text-gray-300">{product.longDescription || product.description}</p>

              <div className="rounded-3xl border border-primary-accent/20 bg-primary-accent/10 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm uppercase tracking-[0.24em] text-primary-accent">Price</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-4xl font-bold text-white">{formatPrice(finalPrice)}</span>
                      {product.bulkPrice && <span className="text-sm line-through text-gray-500">{formatPrice(product.price)}</span>}
                    </div>
                    {product.bulkPrice && <p className="mt-2 text-sm text-emerald-300">Save {bulkDiscount}% on bulk-friendly pricing</p>}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 md:justify-end">
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Stock</p>
                      <p className="mt-2 font-semibold text-emerald-300">{product.stock} units ready</p>
                    </div>

                    <div
                      className={`relative h-12 overflow-hidden rounded-2xl bg-primary-accent text-[#1b0c04] shadow-[0_16px_44px_rgba(246,139,44,0.24)] transition-[width] duration-300 ease-out focus-within:ring-2 focus-within:ring-primary-accent/60 focus-within:ring-offset-2 focus-within:ring-offset-[#120605] ${
                        hasInCart ? 'w-52' : 'w-40'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        aria-label={`Add ${product.name} to cart`}
                        className={`absolute inset-0 flex h-12 w-full items-center justify-center gap-2 px-4 text-base font-black transition-all duration-300 ${
                          hasInCart ? 'pointer-events-none -translate-x-6 opacity-0' : 'translate-x-0 opacity-100'
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <FiShoppingCart size={18} />
                        Add to cart
                      </button>

                      <div
                        className={`absolute inset-0 flex h-12 w-full items-center justify-between px-3 transition-all duration-300 ${
                          hasInCart ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-6 opacity-0'
                        }`}
                        aria-label={`${product.name} quantity in cart`}
                      >
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/10 text-xl font-black transition-colors hover:bg-black/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                        >
                          -
                        </button>
                        <span className="min-w-[3rem] text-center text-base font-black tabular-nums">{cartQuantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={!canIncrease}
                          onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/10 text-xl font-black transition-colors hover:bg-black/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              

              
            </div>

            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:grid-cols-[1fr_0.9fr]">
              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Compatibility</p>
                  <h2 className="mt-2 text-2xl font-bold">Vehicles this product fits</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.vehicleTypes?.map((type) => (
                    <span key={type} className="badge badge-secondary">
                      {type}
                    </span>
                  ))}
                </div>
                {product.compatibilityNotes?.length ? (
                  <ul className="space-y-2 text-sm text-gray-300">
                    {product.compatibilityNotes.map((note) => (
                      <li key={note} className="flex items-start gap-2">
                        <FiCheck className="mt-0.5 text-primary-accent" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Use case</p>
                  <h2 className="mt-2 text-2xl font-bold">Why choose it</h2>
                </div>
                <p className="text-sm text-gray-300">{product.useCase || product.description}</p>
                <div className="grid gap-2">
                  {(product.benefits || []).map((benefit) => (
                    <div key={benefit} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-bold">Specifications</h2>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
                    <FiCheck className="text-primary-accent" />
                    <span>
                      Viscosity: <span className="font-semibold text-white">{product.viscosity || 'N/A'}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
                    <FiCheck className="text-primary-accent" />
                    <span className="min-w-0 break-words">
                      SKU: <span className="font-semibold text-white">{product.sku}</span>
                    </span>
                  </div>
                  {(product.specifications || []).map((spec) => (
                    <div key={spec} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
                      <FiCheck className="text-primary-accent" />
                      {spec}
                    </div>
                  ))}
                </div>
              </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Related products</p>
                  <h2 className="mt-2 text-2xl font-bold">Other products used in the same service bay</h2>
                </div>
                <Link href="/products" className="text-sm font-semibold text-primary-accent">
                  View catalog
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}`}
                    className="rounded-3xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-primary-accent/40 hover:bg-black/30"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{item.brand}</p>
                    <h3 className="mt-2 text-lg font-semibold">{item.name}</h3>
                    <p className="mt-2 text-sm text-gray-400">{item.viscosity || 'Compatible lubrication option'}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        {item.quantity} {item.quantityUnit}
                      </span>
                      <span className="text-sm font-bold text-primary-accent">{formatPrice(item.bulkPrice || item.price)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
