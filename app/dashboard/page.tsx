'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth, useCart } from '@/hooks/store';
import { formatPrice } from '@/lib/utils';
import { FiBarChart2, FiClock, FiLogOut, FiRefreshCw, FiTruck, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface CustomerOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  items: CustomerOrderItem[];
}

export default function DashboardPage() {
  const { user, logout, isLoggedIn } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!isLoggedIn) return;
    if (!user?.id && !user?.email) return;

    try {
      setOrdersLoading(true);
      const params = new URLSearchParams();
      if (user?.id) params.append('customerUserId', user.id);
      if (user?.email) params.append('customerEmail', user.email);
      if (user?.phone) params.append('customerPhone', user.phone);

      const response = await fetch(`/api/orders?${params.toString()}`, {
        cache: 'no-store',
      });
      const payload = (await response.json()) as { orders?: CustomerOrder[] };
      if (!response.ok) {
        setOrders([]);
        return;
      }

      setOrders(Array.isArray(payload.orders) ? payload.orders : []);
    } finally {
      setOrdersLoading(false);
    }
  }, [isLoggedIn, user?.id, user?.email, user?.phone]);

  useEffect(() => {
    void loadOrders();

    const timer = setInterval(() => {
      void loadOrders();
    }, 15000);

    return () => clearInterval(timer);
  }, [loadOrders]);

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen py-16">
          <div className="container-max">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 px-6 py-16 text-center">
              <h1 className="text-3xl font-bold">Access your garage workspace</h1>
              <p className="mt-3 text-gray-400">Please sign in to view your orders, saved vehicles, and bulk pricing tools.</p>
              <Link href="/login" className="btn btn-primary mt-8 rounded-full px-5 py-3">
                Go to login
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const totalOrders = orders.length;
  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
  const roleLabel = user?.role === 'GARAGE' || user?.role === 'MECHANIC' ? 'B2B buyer' : 'Retail customer';

  const handleOrderAgain = (order: CustomerOrder) => {
    order.items.forEach((item) => {
      addItem(
        {
          id: item.productId,
          slug: item.productId,
          name: item.productName,
          brand: item.productName,
          description: item.productName,
          image: '/drum_Oil.webp',
          type: 'ENGINE_OIL',
          quantity: 1,
          quantityUnit: 'unit',
          price: item.price,
          stock: 99,
          sku: item.productId,
          featured: false,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        item.quantity
      );
    });

    router.push('/cart');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-10 md:py-14">
        <div className="container-max space-y-8">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Garage dashboard</p>
                <h1 className="text-4xl font-bold md:text-5xl">
                  Welcome back, <span className="text-gradient">{user?.name || 'User'}</span>
                </h1>
                <p className="text-gray-400">
                  You are signed in as a {roleLabel}. Use this space to review orders, reorder common lubricants, and manage vehicle fitment.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/vehicle-selector" className="btn btn-primary rounded-full px-5 py-3">
                  Find the right oil
                </Link>
                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="btn btn-outline rounded-full px-5 py-3"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                { label: 'Recent orders', value: totalOrders.toString(), icon: FiClock },
                { label: 'Order value', value: formatPrice(totalValue), icon: FiBarChart2 },
                { label: 'Role', value: user?.role || 'CUSTOMER', icon: FiUser },
                { label: 'Garage fitment', value: 'Saved', icon: FiTruck },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{card.label}</p>
                        <p className="mt-2 text-2xl font-bold">{card.value}</p>
                      </div>
                      <Icon className="text-primary-accent" size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Recent orders</p>
                    <h2 className="mt-2 text-2xl font-bold">Order history and repeat purchase actions</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void loadOrders()}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-200 transition-colors hover:border-primary-accent hover:text-primary-accent"
                      disabled={ordersLoading}
                    >
                      <FiRefreshCw size={14} className={ordersLoading ? 'animate-spin' : ''} />
                      Refresh Orders
                    </button>
                    <Link href="/products" className="text-sm font-semibold text-primary-accent">
                      Browse products
                    </Link>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {ordersLoading ? (
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-gray-400">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-gray-400">No orders yet.</div>
                  ) : orders.map((order) => (
                    <div key={order.id} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.24em] text-gray-500">{order.orderNumber || 'ORDER'}</p>
                          <h3 className="mt-2 text-xl font-bold">{order.status}</h3>
                          <p className="mt-1 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary-accent">{formatPrice(order.total)}</p>
                          <p className="text-sm text-gray-400">{order.items.length} line items</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {order.items.map((item) => (
                          <span key={`${order.id}-${item.productId}`} className="badge badge-secondary">
                            {item.productName} x {item.quantity}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <button
                          onClick={() => handleOrderAgain(order)}
                          className="btn btn-primary rounded-full px-5 py-3 text-sm"
                        >
                          <FiRefreshCw size={16} />
                          Order again
                        </button>
                        <Link href="/cart" className="btn btn-outline rounded-full px-5 py-3 text-sm">
                          Review cart
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Saved vehicles</p>
                <h2 className="mt-2 text-2xl font-bold">Build a repeatable fitment list</h2>
                <p className="mt-3 text-gray-400">
                  Save a few vehicles and use the smart selector to keep the oil recommendations consistent for every revisit.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    { title: 'Honda City', subtitle: '5W-30, daily commute' },
                    { title: 'Tata 407', subtitle: '10W-40, fleet duty' },
                  ].map((vehicle) => (
                    <div key={vehicle.title} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                      <p className="font-semibold">{vehicle.title}</p>
                      <p className="mt-1 text-sm text-gray-400">{vehicle.subtitle}</p>
                    </div>
                  ))}
                </div>
                <Link href="/vehicle-selector" className="btn btn-outline mt-6 rounded-full px-5 py-3 text-sm">
                  Add or update vehicles
                </Link>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-primary-accent/20 bg-primary-accent/10 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-primary-accent">B2B spotlight</p>
                <h2 className="mt-2 text-2xl font-bold">Garage-ready bulk ordering</h2>
                <p className="mt-3 text-sm text-gray-200">
                  Mechanics and garages can use this dashboard to repeat common baskets, compare bulk pricing, and shorten counter sales.
                </p>
                <div className="mt-5 space-y-3">
                  <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-gray-500">Benefits</p>
                    <ul className="mt-2 space-y-2 text-sm text-gray-200">
                      <li>Bulk pricing visibility</li>
                      <li>Order again workflow</li>
                      <li>Vehicle compatibility guidance</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Account</p>
                <div className="mt-4 space-y-3 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-500">Email:</span> {user?.email}
                  </p>
                  <p>
                    <span className="text-gray-500">Company:</span> {user?.company || 'Individual account'}
                  </p>
                  <p>
                    <span className="text-gray-500">GST:</span> {user?.gstNumber || 'Not added'}
                  </p>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
