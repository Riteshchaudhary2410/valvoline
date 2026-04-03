'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/store';
import { formatPrice, calculateTax, calculateShipping } from '@/lib/utils';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCart();

  const subtotal = getCartTotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-b from-primary to-secondary-dark flex items-center justify-center">
          <div className="container-max text-center space-y-8 py-20">
            <div className="text-8xl mb-4">🛒</div>
            <h1 className="text-3xl md:text-4xl font-bold">Your Cart is Empty</h1>
            <p className="text-gray-400 text-lg">
              Start by selecting the perfect lubricant for your vehicle
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vehicle-selector" className="btn btn-primary text-lg">
                Find Your Oil
              </Link>
              <Link href="/products" className="btn btn-secondary text-lg">
                Browse Products
              </Link>
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
      <main className="min-h-screen bg-gradient-to-b from-primary to-secondary-dark">
        <div className="container-max py-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/products" className="text-gray-400 hover:text-primary-accent transition-colors">
              <FiArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">
              Shopping <span className="text-gradient">Cart</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 border-b border-gray-800 hover:bg-gray-800/50 transition-all flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-bold hover:text-primary-accent transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-400">
                            {item.product.quantity} {item.product.quantityUnit}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-gray-700 rounded"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Control */}
                        <div className="flex h-11 items-center gap-1 rounded-lg bg-gray-800 px-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-lg font-bold text-gray-300 transition-colors hover:bg-gray-700/60 hover:text-primary-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="min-w-10 text-center font-semibold tabular-nums">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-lg font-bold text-gray-300 transition-colors hover:bg-gray-700/60 hover:text-primary-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {formatPrice(item.price)} each
                          </p>
                          <p className="font-bold text-lg text-primary-accent">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link href="/products" className="inline-flex items-center gap-2 text-primary-accent hover:text-orange-400 mt-6 text-sm font-semibold">
                <FiArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6 sticky top-24">
                <h2 className="text-xl font-bold">Order Summary</h2>

                {/* Summary Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax (18% GST)</span>
                    <span className="font-semibold">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-green-400' : ''}`}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="border-t border-gray-700 pt-3 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary-accent text-lg">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Benefits */}
                {subtotal < 2000 && (
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3 text-xs text-blue-300">
                    Add {formatPrice(2000 - subtotal)} more for free shipping!
                  </div>
                )}

                {/* Bulk Discount Info */}
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 text-xs text-green-300">
                  💡 Tip: Orders above ₹5000 qualify for bulk discounts on select items
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" className="w-full btn btn-primary py-4 text-lg font-bold">
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping */}
                <button
                  onClick={() => window.history.back()}
                  className="w-full btn btn-outline"
                >
                  Continue Shopping
                </button>

                {/* Clear Cart */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="w-full text-sm text-gray-400 hover:text-red-500 transition-colors py-2"
                >
                  Clear Cart
                </button>

                {/* Accepted Payments */}
                <div className="space-y-2 text-xs">
                  <p className="text-gray-500 font-semibold">We Accept</p>
                  <div className="flex gap-2 flex-wrap">
                    {['💳 Cards', '🏦 Bank Transfer', '📱 UPI', '💰 COD'].map((method) => (
                      <span key={method} className="badge badge-secondary text-xs">
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
