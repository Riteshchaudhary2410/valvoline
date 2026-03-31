'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth, useCart } from '@/hooks/store';
import { calculateShipping, calculateTax, formatPrice, generateOrderNumber } from '@/lib/utils';
import { FiShield, FiCreditCard, FiTruck, FiCheckCircle } from 'react-icons/fi';

export default function CheckoutPage() {
  const { items, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod' | 'upi'>('stripe');
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  const subtotal = getCartTotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  useEffect(() => {
    setOrderNumber(generateOrderNumber());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart();
  };

  if (items.length === 0 && !submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-16">
          <div className="container-max text-center">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-16">
              <h1 className="text-3xl font-bold">Checkout is waiting for products</h1>
              <p className="mt-3 text-gray-400">
                Add a lubricant to the cart before entering the placeholder payment flow.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/products" className="btn btn-primary rounded-full px-5 py-3">
                  Browse Products
                </Link>
                <Link href="/vehicle-selector" className="btn btn-outline rounded-full px-5 py-3">
                  Find the Right Oil
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-16">
          <div className="container-max">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                <FiCheckCircle size={32} />
              </div>
              <h1 className="mt-6 text-3xl font-bold">Order placed successfully</h1>
              <p className="mt-3 text-gray-400">
                Order {orderNumber || 'ORD-PENDING'} is being prepared for dispatch.
              </p>
              <div className="mt-8 grid gap-3 text-left md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Payment method</p>
                  <p className="mt-2 font-semibold">{paymentMethod.toUpperCase()}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Delivery mode</p>
                  <p className="mt-2 font-semibold">Standard shipping</p>
                </div>
              </div>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/dashboard" className="btn btn-primary rounded-full px-5 py-3">
                  View dashboard
                </Link>
                <Link href="/products" className="btn btn-outline rounded-full px-5 py-3">
                  Continue shopping
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
      <main className="min-h-screen py-10 md:py-14">
        <div className="container-max">
          <div className="mb-8 max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Secure checkout</p>
            <h1 className="text-4xl font-bold md:text-5xl">Complete your lubricant order</h1>
            <p className="text-gray-400">
              This is a placeholder payment system that keeps the flow realistic while Stripe is being connected.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <FiTruck className="text-primary-accent" size={22} />
                  <h2 className="text-2xl font-bold">Shipping details</h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input defaultValue={user?.name || ''} className="input" placeholder="Full name" />
                  <input defaultValue={user?.email || ''} className="input" placeholder="Email address" />
                  <input defaultValue={user?.phone || ''} className="input" placeholder="Phone number" />
                  <input defaultValue={user?.company || ''} className="input" placeholder="Company or garage name" />
                  <input className="input md:col-span-2" placeholder="Street address" />
                  <input className="input" placeholder="City" />
                  <input className="input" placeholder="State" />
                  <input className="input" placeholder="Postal code" />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <FiCreditCard className="text-primary-accent" size={22} />
                  <h2 className="text-2xl font-bold">Payment method</h2>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    { value: 'stripe', label: 'Stripe', note: 'Card placeholder' },
                    { value: 'upi', label: 'UPI', note: 'Fast business payments' },
                    { value: 'cod', label: 'COD', note: 'Cash on delivery' },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`cursor-pointer rounded-3xl border px-4 py-4 transition-colors ${
                        paymentMethod === method.value
                          ? 'border-primary-accent bg-primary-accent/10'
                          : 'border-white/10 bg-black/20 hover:border-primary-accent/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value as typeof paymentMethod)}
                        className="sr-only"
                      />
                      <p className="font-semibold">{method.label}</p>
                      <p className="mt-1 text-xs text-gray-400">{method.note}</p>
                    </label>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl border border-primary-accent/20 bg-primary-accent/10 p-4 text-sm text-gray-200">
                  <p className="font-semibold text-primary-accent">Stripe placeholder</p>
                  <p className="mt-1">
                    Use test card details later when you plug in real Stripe credentials.
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="mb-5 flex items-center gap-3">
                  <FiShield className="text-primary-accent" size={22} />
                  <h2 className="text-2xl font-bold">Order notes</h2>
                </div>
                <textarea className="input min-h-36" placeholder="Add reference notes, garage instructions, or oil change reminders..." />
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="text-2xl font-bold">Order summary</h2>

                <div className="mt-5 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="font-semibold text-primary-accent">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>GST</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary-accent">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button type="submit" className="btn btn-primary w-full rounded-full py-4 font-bold">
                    Place order
                  </button>
                  <Link href="/cart" className="btn btn-outline w-full rounded-full py-4 font-bold">
                    Back to cart
                  </Link>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Orders above {formatPrice(2000)} qualify for free shipping. Bulk buyers can later connect live Stripe pricing rules here.
                </p>
              </div>
            </aside>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
