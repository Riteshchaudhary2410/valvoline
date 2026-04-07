'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/utils';
import { FiArrowLeft, FiChevronDown, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity?: string;
  customerState?: string;
  customerZip?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

type OrderStatus = Order['status'];

const STATUS_OPTIONS: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-500/10 border-red-500/30 text-red-400' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatOrderDate = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '-' : parsed.toLocaleDateString();
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      const safeOrders: Order[] = (Array.isArray(data.orders) ? data.orders : []).map((order: Partial<Order>) => ({
        id: String(order.id || ''),
        orderNumber: String(order.orderNumber || 'N/A'),
        customerName: String(order.customerName || 'Unknown'),
        customerPhone: String(order.customerPhone || 'N/A'),
        customerAddress: String(order.customerAddress || 'N/A'),
        customerCity: order.customerCity,
        customerState: order.customerState,
        customerZip: order.customerZip,
        items: Array.isArray(order.items)
          ? order.items.map((item) => ({
              productId: String(item.productId || ''),
              productName: String(item.productName || 'Product'),
              productImage: String(item.productImage || '/drum_Oil.webp'),
              quantity: Number(item.quantity || 0),
              price: Number(item.price || 0),
            }))
          : [],
        subtotal: Number(order.subtotal || 0),
        tax: Number(order.tax || 0),
        shipping: Number(order.shipping || 0),
        total: Number(order.total || 0),
        status: (order.status as OrderStatus) || 'PENDING',
        paymentMethod: String(order.paymentMethod || 'N/A'),
        paymentStatus: String(order.paymentStatus || 'PENDING'),
        createdAt: String(order.createdAt || ''),
        updatedAt: String(order.updatedAt || ''),
      }));

      setOrders(safeOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (updating) return;

    try {
      setUpdating(orderId);
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order');
      }

      // Update local state
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#120605] py-10 md:py-14">
        <div className="container-max">
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-primary-accent">
            <FiArrowLeft size={18} />
            Back to admin
          </Link>

          <div className="mb-8 mt-6 space-y-3">
            <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Admin dashboard</p>
            <h1 className="text-4xl font-bold text-white md:text-5xl">Orders</h1>
            <p className="text-gray-400">Manage and track all customer orders</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
              <div className="flex items-start gap-3">
                <FiAlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary-accent border-transparent border-t-primary-accent" />
                <p className="mt-4 text-gray-200">Loading orders...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/5 px-6 py-16 text-center">
              <p className="text-gray-400">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusOption = STATUS_OPTIONS.find((s) => s.value === order.status);
                const isExpanded = expandedOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className="rounded-lg border border-white/10 bg-white/5 backdrop-blur overflow-hidden"
                  >
                    {/* Summary row */}
                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/10 transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-white">{order.orderNumber}</p>
                          {statusOption && (
                            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusOption.color}`}>
                              {statusOption.label}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">
                          {order.customerName} • {order.customerPhone}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">
                            {order.items.length} item{order.items.length === 1 ? '' : 's'}
                          </span>
                          <span className="font-semibold text-primary-accent">
                            {formatPrice(order.total)}
                          </span>
                          <span className="text-gray-500">
                            {formatOrderDate(order.createdAt)}
                          </span>
                        </div>
                      </div>
                      <FiChevronDown
                        size={20}
                        className={`flex-shrink-0 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t border-white/10 px-6 py-4 space-y-6 bg-black/20">
                        {/* Customer info */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                            Customer information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Name</p>
                              <p className="text-white font-medium">{order.customerName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Phone</p>
                              <p className="text-white font-medium">{order.customerPhone}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-gray-500">Address</p>
                              <p className="text-white font-medium">
                                {order.customerAddress}
                                {order.customerCity && `, ${order.customerCity}`}
                                {order.customerState && `, ${order.customerState}`}
                                {order.customerZip && ` ${order.customerZip}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order items */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                            Items
                          </h3>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-4 rounded border border-white/5 bg-white/5 p-3">
                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                                  <Image
                                    src={item.productImage || '/drum_Oil.webp'}
                                    alt={item.productName}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-white">{item.productName}</p>
                                  <p className="text-sm text-gray-400">
                                    {item.quantity} x {formatPrice(item.price)}
                                  </p>
                                </div>
                                <span className="font-semibold text-primary-accent flex-shrink-0">
                                  {formatPrice(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="border-t border-white/10 pt-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Subtotal</span>
                              <span className="font-medium text-white">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Tax</span>
                              <span className="font-medium text-white">{formatPrice(order.tax)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Shipping</span>
                              <span className="font-medium text-white">{formatPrice(order.shipping)}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-white/10">
                              <span className="font-semibold text-white">Total</span>
                              <span className="font-semibold text-lg text-primary-accent">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status update */}
                        <div className="border-t border-white/10 pt-4">
                          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                            Update status
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {STATUS_OPTIONS.map((statusOpt) => (
                              <button
                                key={statusOpt.value}
                                onClick={() => updateOrderStatus(order.id, statusOpt.value)}
                                disabled={updating === order.id}
                                className={`rounded px-3 py-2 text-xs font-semibold transition-colors ${
                                  order.status === statusOpt.value
                                    ? `${statusOpt.color} border`
                                    : 'border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {order.status === statusOpt.value && <FiCheck className="inline mr-1" size={14} />}
                                {statusOpt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
