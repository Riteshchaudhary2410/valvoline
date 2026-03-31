'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/store';
import { FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<UserRole>('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      await new Promise((resolve) => setTimeout(resolve, 650));

      const inferredRole: UserRole =
        accountType === 'CUSTOMER' ? 'CUSTOMER' : accountType === 'GARAGE' ? 'GARAGE' : 'MECHANIC';

      setUser({
        id: `user-${Date.now()}`,
        name: accountType === 'GARAGE' ? 'Garage Manager' : 'Workshop User',
        email,
        role: inferredRole,
      });

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="container-max grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-accent/20 bg-primary-accent/10 px-4 py-2 text-sm text-primary-accent">
              <FiShield size={16} />
              Dealer, mechanic, and garage access
            </div>
            <h1 className="text-4xl font-bold md:text-5xl">Sign in to your lubricant workspace</h1>
            <p className="max-w-xl text-gray-300">
              Use the dashboard to repeat orders, view garage-ready bulk pricing, and keep vehicle fitment references in one place.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                'Retail orders',
                'Garage reorders',
                'Vehicle recommendations',
              ].map((item) => (
                <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold">Welcome back</h2>
              <p className="mt-2 text-gray-400">Choose the account mode that matches your buying workflow.</p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-700 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { value: 'CUSTOMER', label: 'Retail', note: 'Bike or car owner' },
                  { value: 'MECHANIC', label: 'Mechanic', note: 'Service counter user' },
                  { value: 'GARAGE', label: 'Garage', note: 'Bulk buyer' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-3xl border px-4 py-4 transition-colors ${
                      accountType === option.value
                        ? 'border-primary-accent bg-primary-accent/10'
                        : 'border-white/10 bg-black/20 hover:border-primary-accent/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accountType"
                      value={option.value}
                      checked={accountType === option.value}
                      onChange={() => setAccountType(option.value as UserRole)}
                      className="sr-only"
                    />
                    <p className="font-semibold">{option.label}</p>
                    <p className="mt-1 text-xs text-gray-400">{option.note}</p>
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-200"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-600 bg-transparent" />
                  Remember me
                </label>
                <Link href="/signup" className="text-primary-accent transition-colors hover:text-orange-300">
                  Create an account
                </Link>
              </div>

              <button type="submit" disabled={isLoading} className="btn btn-primary w-full rounded-full py-3 font-bold disabled:opacity-50">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-gray-300">
              <p className="font-semibold text-primary-accent">Demo access</p>
              <p className="mt-1">Email: demo@valvoline.com</p>
              <p>Password: demo123</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
