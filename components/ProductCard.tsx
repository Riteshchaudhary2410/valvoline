'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiHeart, FiStar, FiZap } from 'react-icons/fi';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    if (!addedMessage) return;
    const timer = setTimeout(() => setAddedMessage(''), 1600);
    return () => clearTimeout(timer);
  }, [addedMessage]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, quantity);
    setAddedMessage(`Added ${quantity} to cart`);
  };

  const finalPrice = product.bulkPrice || product.price;
  const bulkDiscount = product.bulkPrice
    ? Math.round(((product.price - product.bulkPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary-accent/40 hover:bg-white/10">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#120605]">
            <Image
              src={product.image}
              alt={product.name}
              width={900}
              height={1200}
              className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <span className="badge badge-primary">{product.type.replace(/_/g, ' ')}</span>
              {product.featured && <span className="badge badge-secondary">Featured</span>}
            </div>

            <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/10 bg-black/40 p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-300">{product.brand}</p>
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

          <div className="flex flex-1 flex-col gap-4 p-5">
            <p className="text-sm text-gray-300">{product.description}</p>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
              <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
                <p className="text-gray-500">Quantity</p>
                <p className="mt-1 font-semibold text-white">
                  {product.quantity} {product.quantityUnit}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/15 p-3">
                <p className="text-gray-500">Use case</p>
                <p className="mt-1 line-clamp-2 font-semibold text-white">
                  {product.useCase || 'Workshop and retail use'}
                </p>
              </div>
            </div>

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

            <div className="mt-auto rounded-3xl border border-primary-accent/15 bg-primary-accent/10 p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-accent">Price</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{formatPrice(finalPrice)}</span>
                    {product.bulkPrice && (
                      <span className="text-xs line-through text-gray-500">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  {product.bulkPrice && (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-300">
                      <FiZap size={12} />
                      Save {bulkDiscount}% for bulk buyers
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-gray-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {product.stock} in stock
                </div>
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

      <div className="border-t border-white/10 p-4">
        {addedMessage ? (
          <p className="mb-3 text-sm text-emerald-300">{addedMessage}</p>
        ) : null}
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-black/15 px-3 py-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-gray-400 transition-colors hover:text-primary-accent"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full bg-transparent text-center text-sm font-semibold text-white focus:outline-none"
            />
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="text-gray-400 transition-colors hover:text-primary-accent"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn btn-primary flex-1 rounded-2xl text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
