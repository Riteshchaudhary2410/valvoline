'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/store';
import { registerAccount } from '@/lib/auth-client';
import { FiEye, FiEyeOff, FiShield, FiCheck } from 'react-icons/fi';
import { UserRole } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const initialFormData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'CUSTOMER' as UserRole,
    companyName: '',
    gstNumber: '',
  };
  const [formData, setFormData] = useState({
    ...initialFormData,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(initialFormData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'userType' ? (value as UserRole) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await new Promise((resolve) => setTimeout(resolve, 650));

      const account = registerAccount({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.userType,
        phone: formData.phone,
        company: formData.companyName,
        gstNumber: formData.gstNumber,
      });

      setUser({
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        phone: account.phone,
        company: account.company,
        gstNumber: account.gstNumber,
      });

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="container-max grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-accent/20 bg-primary-accent/10 px-4 py-2 text-sm text-primary-accent">
              <FiShield size={16} />
              Create customer, mechanic, or garage access
            </div>
            <h1 className="text-4xl font-bold md:text-5xl">Create your account for retail or B2B lubricant ordering</h1>
            <p className="max-w-xl text-gray-300">
              Garages can add business details to prepare for bulk pricing, order history, and repeat procurement workflows.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold">Join the dealer platform</h2>
              <p className="mt-2 text-gray-400">A compact registration flow for retail and workshop buyers.</p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-700 bg-red-950/30 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { value: 'CUSTOMER', label: 'Retail' },
                  { value: 'MECHANIC', label: 'Mechanic' },
                  { value: 'GARAGE', label: 'Garage' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-3xl border px-4 py-4 transition-colors ${
                      formData.userType === option.value
                        ? 'border-primary-accent bg-primary-accent/10'
                        : 'border-white/10 bg-black/20 hover:border-primary-accent/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={option.value}
                      checked={formData.userType === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <p className="font-semibold">{option.label}</p>
                  </label>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">Full name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="off"
                    className="input"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="off"
                    className="input"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">Phone number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  autoComplete="off"
                  className="input"
                  disabled={isLoading}
                />
              </div>

              {(formData.userType === 'MECHANIC' || formData.userType === 'GARAGE') && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">Company name</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Workshop or company name"
                      className="input"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">GST number</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="27ABCDE9999X1Z0"
                      className="input"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
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
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">Confirm password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="input"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-sm text-gray-300">
                <p className="font-semibold text-primary-accent">Password requirements</p>
                <div className="mt-3 space-y-2">
                  <div className={`flex items-center gap-2 ${formData.password.length >= 6 ? 'text-emerald-300' : ''}`}>
                    <FiCheck size={14} />
                    At least 6 characters
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-emerald-300' : ''
                    }`}
                  >
                    <FiCheck size={14} />
                    Passwords match
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn btn-primary w-full rounded-full py-3 font-bold disabled:opacity-50">
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary-accent transition-colors hover:text-orange-300">
                Sign in
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
