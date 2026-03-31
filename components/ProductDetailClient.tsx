'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiCheck, FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/store';

type ProductView = Omit<Product, 'createdAt' | 'updatedAt'>;

interface ProductDetailClientProps {
  product: ProductView;
  relatedProducts: ProductView[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  const gallery = useMemo(() => [product.image, ...(product.images || [])], [product]);
  const finalPrice = product.bulkPrice || product.price;
  const bulkDiscount = product.bulkPrice
    ? Math.round(((product.price - product.bulkPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product as Product, quantity);
    setAddedToCart(true);
    window.setTimeout(() => setAddedToCart(false), 1600);
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
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <Image
                src={gallery[mainImage] || product.image}
                alt={product.name}
                width={900}
                height={1200}
                className="h-full w-full object-contain p-8"
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {gallery.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setMainImage(index)}
                  className={`overflow-hidden rounded-2xl border-2 transition-all ${
                    index === mainImage ? 'border-primary-accent' : 'border-white/10'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={220}
                    height={220}
                    className="h-full w-full object-contain p-3"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex flex-wrap items-start justify-between gap-4">
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
                  className="rounded-full border border-white/10 bg-white/5 p-3 text-gray-200 transition-colors hover:border-primary-accent hover:text-primary-accent"
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

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Viscosity</p>
                  <p className="mt-2 text-lg font-semibold">{product.viscosity || 'N/A'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Pack size</p>
                  <p className="mt-2 text-lg font-semibold">
                    {product.quantity} {product.quantityUnit}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-gray-500">SKU</p>
                  <p className="mt-2 text-lg font-semibold">{product.sku}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-primary-accent/20 bg-primary-accent/10 p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-primary-accent">Price</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-4xl font-bold text-white">{formatPrice(finalPrice)}</span>
                      {product.bulkPrice && <span className="text-sm line-through text-gray-500">{formatPrice(product.price)}</span>}
                    </div>
                    {product.bulkPrice && <p className="mt-2 text-sm text-emerald-300">Save {bulkDiscount}% on bulk-friendly pricing</p>}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-gray-500">Stock</p>
                    <p className="mt-2 font-semibold text-emerald-300">{product.stock} units ready</p>
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

            <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Specifications</h2>
                <div className="space-y-2">
                  {(product.specifications || []).map((spec) => (
                    <div key={spec} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-200">
                      <FiCheck className="text-primary-accent" />
                      {spec}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Order quantity</h2>
                <div className="flex gap-3">
                  <div className="flex flex-1 items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 transition-colors hover:text-primary-accent">
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                      className="w-16 bg-transparent text-center font-semibold text-white focus:outline-none"
                    />
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="text-gray-400 transition-colors hover:text-primary-accent">
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`btn ${addedToCart ? 'btn-secondary' : 'btn-primary'} rounded-2xl px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <FiShoppingCart size={18} />
                    {addedToCart ? 'Added' : 'Add to cart'}
                  </button>
                </div>
                <p className="text-sm text-gray-400">
                  Perfect for retail customers and workshop reorders. Checkout is currently a placeholder flow so you can keep browsing while payments are wired up.
                </p>
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
