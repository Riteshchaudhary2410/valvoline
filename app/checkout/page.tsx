'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth, useCart } from '@/hooks/store';
import { calculateShipping, calculateTax, formatPrice } from '@/lib/utils';
import { FiCreditCard, FiTruck, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  paymentMethod: string;
}

interface CheckoutState {
  status: 'form' | 'loading' | 'success' | 'error';
  orderNumber?: string;
  error?: string;
}

export default function CheckoutPage() {
  const { items, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({ status: 'form' });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'cod',
  });

  useEffect(() => {
    if (!user?.email || formData.email) return;
    setFormData((prev) => ({ ...prev, email: user.email }));
  }, [user?.email, formData.email]);

  const subtotal = getCartTotal();
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (checkoutState.status !== 'success') return;

    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2200);

    return () => clearTimeout(timer);
  }, [checkoutState.status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setCheckoutState({
        status: 'error',
        error: 'Please fill in all required fields (name, email, phone, address)',
      });
      return;
    }

    setCheckoutState({ status: 'loading' });

    try {
      const normalizedEmail = formData.email.toLowerCase().trim();
      const normalizedPhone = formData.phone.trim();

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerUserId: user?.id,
          customerName: formData.name,
          customerEmail: user?.email?.trim().toLowerCase() || normalizedEmail,
          customerPhone: normalizedPhone,
          customerAddress: formData.address,
          customerCity: formData.city,
          customerState: formData.state,
          customerZip: formData.zip,
          items: items.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.image,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal,
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      clearCart();
      setCheckoutState({
        status: 'success',
        orderNumber: data.order.orderNumber,
      });
    } catch (error) {
      setCheckoutState({
        status: 'error',
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    }
  };

  // Empty cart state
  if (items.length === 0 && checkoutState.status === 'form') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#120605] py-16">
          <div className="container-max flex flex-col items-center justify-center text-center">
            <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-16 backdrop-blur">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-black/20">
                <FiTruck size={28} className="text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-white md:text-4xl">Your cart is empty</h1>
              <p className="mt-4 text-gray-300">
                Add products to your cart before proceeding to checkout.
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

  // Success state
  if (checkoutState.status === 'success') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#120605] py-16">
          <div className="container-max">
            <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-16 backdrop-blur text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
                <FiCheckCircle size={32} className="text-emerald-400" />
              </div>
              <h1 className="mt-6 text-3xl font-bold text-white md:text-4xl">Order placed successfully!</h1>
              <p className="mt-3 text-gray-400">
                Order <span className="font-semibold text-primary-accent">{checkoutState.orderNumber}</span> has been created.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                We've confirmed your order and it's being prepared for shipment.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Redirecting to your dashboard...
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/products" className="btn btn-primary rounded-full px-5 py-3 font-semibold">
                  Continue Shopping
                </Link>
                <Link href="/cart" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 font-semibold text-gray-200 transition-colors hover:border-primary-accent hover:text-primary-accent">
                  View Cart
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (checkoutState.status === 'error') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#120605] py-16">
          <div className="container-max">
            <div className="mx-auto max-w-2xl rounded-[1.75rem] border border-red-500/20 bg-red-500/5 px-6 py-16 backdrop-blur text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15">
                <FiAlertCircle size={32} className="text-red-400" />
              </div>
              <h1 className="mt-6 text-3xl font-bold text-white md:text-4xl">Order failed</h1>
              <p className="mt-3 text-gray-400">{checkoutState.error}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => setCheckoutState({ status: 'form' })}
                  className="btn btn-primary rounded-full px-5 py-3 font-semibold"
                >
                  Try Again
                </button>
                <Link href="/cart" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 font-semibold text-gray-200 transition-colors hover:border-primary-accent hover:text-primary-accent">
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Loading state
  if (checkoutState.status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#120605] flex items-center justify-center py-16">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-accent border-transparent border-t-primary-accent" />
            <p className="mt-4 text-gray-200">Processing your order...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Form state (main checkout)
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#120605] py-10 md:py-14">
        <div className="container-max">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-primary-accent"
          >
            <FiArrowLeft size={18} />
            Back to cart
          </Link>

          <div className="mb-8 mt-6 max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Secure checkout</p>
            <h1 className="text-4xl font-bold text-white md:text-5xl">Complete your order</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Form fields */}
            <div className="space-y-6">
              {/* Shipping details */}
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-6 flex items-center gap-3">
                  <FiTruck className="text-primary-accent" size={22} />
                  <h2 className="text-2xl font-bold text-white">Shipping details</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Full name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Email address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Phone number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Street address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter street address"
                      className="input w-full"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="input w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Postal code
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      placeholder="Postal code"
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="mb-6 flex items-center gap-3">
                  <FiCreditCard className="text-primary-accent" size={22} />
                  <h2 className="text-2xl font-bold text-white">Payment method</h2>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    { value: 'cod', label: 'COD', note: 'Cash on delivery' },
                    { value: 'upi', label: 'UPI', note: 'UPI transfer' },
                    { value: 'bank', label: 'Bank', note: 'Bank transfer' },
                  ].map((method) => (
                    <label key={method.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`rounded-2xl border px-4 py-4 transition-colors ${
                          formData.paymentMethod === method.value
                            ? 'border-primary-accent bg-primary-accent/10'
                            : 'border-white/10 bg-black/20 hover:border-primary-accent/40'
                        }`}
                      >
                        <p className="font-semibold text-white">{method.label}</p>
                        <p className="mt-1 text-xs text-gray-400">{method.note}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur space-y-6">
                <h2 className="text-2xl font-bold text-white">Order summary</h2>

                {/* Cart items */}
                <div className="max-h-48 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/20">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="font-semibold text-primary-accent text-sm flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Pricing breakdown */}
                <div className="space-y-3 border-t border-white/10 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax</span>
                    <span className="font-semibold text-white">{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="font-semibold text-white">{formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="font-bold text-white">Total</span>
                    <span className="text-lg font-bold text-primary-accent">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full rounded-full bg-primary-accent px-5 py-4 text-center font-bold text-[#1b0c04] transition-colors hover:bg-[#ff9a3d] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={items.length === 0}
                >
                  Place Order
                </button>

                <p className="text-xs text-gray-500 text-center">
                  By placing an order, you agree to our terms and conditions.
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
