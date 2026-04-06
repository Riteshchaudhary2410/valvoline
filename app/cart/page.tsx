'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/store';
import { formatPrice } from '@/lib/utils';
import { FiArrowLeft, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart, getItemCount } = useCart();

  const subtotal = getCartTotal();
  const totalItems = getItemCount();

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#120605]">
          <div className="container-max flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 py-16">
            <div className="max-w-xl rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-10 text-center backdrop-blur">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/20 text-4xl">
                🛒
              </div>
              <h1 className="text-3xl font-bold text-white md:text-4xl">Your cart is empty</h1>
              <p className="mt-4 text-gray-300">
                Add products from the catalog to build your order.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/products" className="btn btn-primary rounded-full px-5 py-3 font-semibold">
                  Browse Products
                </Link>
                <Link href="/vehicle-selector" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 font-semibold text-gray-200 transition-colors hover:border-primary-accent hover:text-primary-accent">
                  Find Your Oil
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#120605] text-white">
        <div className="container-max px-4 py-10">
          <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
            <Link href="/products" className="text-gray-400 hover:text-primary-accent transition-colors">
              <FiArrowLeft size={24} />
            </Link>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Cart</p>
                <h1 className="text-3xl font-bold md:text-4xl">Shopping cart</h1>
              </div>
            </div>
            <p className="text-sm text-gray-400">{totalItems} item{totalItems === 1 ? '' : 's'} in cart</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="line-clamp-2 font-semibold text-white transition-colors hover:text-primary-accent"
                          >
                            {item.product.name}
                          </Link>
                          <p className="mt-1 text-sm text-gray-400">
                            {item.product.quantity} {item.product.quantityUnit}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="rounded-full border border-white/10 bg-black/15 p-2 text-gray-400 transition-colors hover:border-red-500/30 hover:text-red-400"
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/15 p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-white/10 hover:text-primary-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/60"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="min-w-10 text-center text-sm font-semibold tabular-nums text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-white/10 hover:text-primary-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/60"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-400">{formatPrice(item.price)} each</p>
                          <p className="text-lg font-bold text-primary-accent">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/products" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-accent hover:text-orange-400">
                <FiArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>

            <div>
              <div className="sticky top-24 rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="text-xl font-bold text-white">Order summary</h2>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-lg text-primary-accent">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <p className="mt-4 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-xs text-gray-400">
                  Cart items are saved automatically in your browser.
                </p>

                <Link href="/checkout" className="mt-5 block w-full rounded-full bg-primary-accent px-5 py-4 text-center text-base font-bold text-[#1b0c04] transition-colors hover:bg-[#ff9a3d]">
                  Proceed to Checkout
                </Link>

                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="mt-3 w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-primary-accent hover:text-primary-accent"
                >
                  Continue Shopping
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="mt-3 w-full text-sm text-gray-400 transition-colors hover:text-red-400"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
