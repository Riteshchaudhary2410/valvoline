'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/store';
import { authenticateAccount } from '@/lib/auth-client';
import { FiEye, FiEyeOff, FiShield } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      await new Promise((resolve) => setTimeout(resolve, 650));

      const account = authenticateAccount(email, password);

      setUser({
        id: account.id,
        name: account.name,
        email: account.email,
        phone: account.phone,
        role: account.role,
        company: account.company,
        gstNumber: account.gstNumber,
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
              <p className="mt-2 text-gray-400">Sign in with the account you created on the signup page.</p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-700 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
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
                    autoComplete="current-password"
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
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
