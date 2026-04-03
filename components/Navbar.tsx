'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiShoppingCart,
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiChevronRight,
} from 'react-icons/fi';
import { useAuth, useCart } from '@/hooks/store';

const NAV_LINKS = [
  { label: 'Engine Oil', href: '/products?oilType=ENGINE_OIL' },
  { label: 'Gear Oil', href: '/products?oilType=GEAR_OIL' },
  { label: 'Grease', href: '/products?oilType=GREASE' },
  { label: 'Industrial Oils', href: '/products?oilType=INDUSTRIAL_OILS' },
  { label: 'Vehicle Selector', href: '/vehicle-selector' },
  { label: 'B2B', href: '/b2b' },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { getItemCount } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const cartCount = getItemCount();

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setIsScrolled(window.scrollY > 40);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;
    router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    setMobileMenuOpen(false);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/94 backdrop-blur-xl shadow-[0_14px_45px_rgba(2,12,27,0.08)]">
        <div className="container-max">
          <div className="py-3">
            <div
              className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
                isScrolled ? 'pointer-events-none max-h-0 -translate-y-2 opacity-0' : 'max-h-[420px] translate-y-0 opacity-100'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                <Link href="/" className="min-w-0 flex flex-1 items-center gap-3 lg:max-w-[23rem] lg:flex-none">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_12px_28px_rgba(15,33,64,0.08)] sm:h-16 sm:w-16">
                    <Image
                      src="/vlogo.png"
                      alt="Valvoline Logo"
                      width={54}
                      height={54}
                      className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                      priority
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9da3ac] sm:text-[11px]">
                      Valvoline partner store
                    </p>
                    <p className="mt-1 text-sm font-black leading-tight text-[#d9dcdf] sm:text-base xl:text-lg">
                      Shree Laxmi Narayan Traders
                    </p>
                  </div>
                </Link>

                <div className="hidden lg:flex flex-1 justify-center">
                  <form
                    onSubmit={handleSearch}
                    className="flex w-full max-w-[44rem] items-center gap-3 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f7faff)] p-2 shadow-[0_18px_40px_rgba(15,33,64,0.08)]"
                  >
                    <div className="relative flex-1">
                      <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="search"
                        placeholder="Search oils, viscosities, bike products, or vehicle fitment"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-[1.15rem] bg-transparent py-3.5 pl-11 pr-4 text-base text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex min-w-[8.5rem] items-center justify-center rounded-[1.15rem] bg-[#10294b] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#173d72]"
                    >
                      Search
                    </button>
                  </form>
                </div>

                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/cart"
                    className="relative inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-3 text-slate-600 transition-colors hover:border-[#1d5db8] hover:text-[#1d5db8]"
                    aria-label="Cart"
                  >
                    <FiShoppingCart size={18} />
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b42318] px-1 text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {isLoggedIn ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href="/dashboard"
                        className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-[#1d5db8] hover:text-[#1d5db8]"
                      >
                        <FiUser size={16} />
                        {user?.name || 'Account'}
                      </Link>
                      <button
                        onClick={logout}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-3 text-slate-600 transition-colors hover:border-[#df3b2f] hover:text-[#df3b2f]"
                        aria-label="Logout"
                      >
                        <FiLogOut size={18} />
                      </button>
                    </div>
                  ) : (
                  <Link
                    href="/login"
                    className="inline-flex rounded-full border border-[#b42318] bg-[#b42318] px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#c02626]"
                  >
                    Login
                  </Link>
                )}

                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-3 text-slate-600 transition-colors hover:border-[#1d5db8] hover:text-[#1d5db8] lg:hidden"
                    aria-label="Open menu"
                  >
                    <FiMenu size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-4 lg:hidden">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2 rounded-[1.4rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f7faff)] p-2 shadow-[0_14px_30px_rgba(15,33,64,0.06)]"
                >
                  <div className="relative flex-1">
                    <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="search"
                      placeholder="Search products or vehicle fitment"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-[1rem] bg-transparent py-3 pl-11 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-[1rem] bg-[#10294b] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>

            <div
              className={`flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:pb-0 transition-[margin,padding,border-color] duration-300 ${
                isScrolled ? 'mt-2 border-t-0 pt-0' : 'mt-3 border-t border-slate-200/80 pt-3'
              }`}
            >
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-full border border-transparent bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-slate-200 hover:bg-white hover:text-[#1d5db8] md:px-4 md:py-2.5 md:text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[60] bg-black/60 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
      />

      <aside
        className={`fixed right-0 top-0 z-[70] h-full w-[88vw] max-w-sm overflow-y-auto border-l border-slate-200 bg-white shadow-2xl shadow-black/20 transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#1d5db8]">Valvoline partner store</p>
            <p className="mt-2 text-lg font-black leading-tight text-[#10294b]">Shree Laxmi Narayan Traders</p>
          </div>
	          <button
	            onClick={closeMenu}
	            className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition-colors hover:text-[#1d5db8]"
	            aria-label="Close menu"
	          >
	            <FiX size={18} />
	          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-[1.4rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f7faff)] p-2 shadow-[0_14px_30px_rgba(15,33,64,0.06)]">
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-[1rem] bg-transparent py-3 pl-11 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            <button type="submit" className="inline-flex items-center justify-center rounded-[1rem] bg-[#10294b] px-4 py-3 text-sm font-semibold text-white">
              Search
            </button>
          </form>

          <div className="space-y-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 transition-colors hover:border-[#1d5db8] hover:text-[#1d5db8]"
              >
                <span>{item.label}</span>
                <FiChevronRight size={16} />
              </Link>
            ))}
          </div>

          <div className="space-y-3 border-t border-slate-200 pt-5">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 transition-colors hover:border-[#1d5db8] hover:text-[#1d5db8]"
                >
                  <div className="flex items-center gap-2">
                    <FiUser size={16} />
                    <span>{user?.name || 'Account'}</span>
                  </div>
                  <FiChevronRight size={16} />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700 transition-colors hover:border-[#df3b2f] hover:text-[#df3b2f]"
                >
                  <div className="flex items-center gap-2">
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </div>
                  <FiChevronRight size={16} />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex w-full items-center justify-center rounded-full border border-[#b42318] bg-[#b42318] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#c02626]"
              >
                Login
              </Link>
            )}
          </div>
          <div className="rounded-3xl border border-[rgba(29,93,184,0.15)] bg-[rgba(29,93,184,0.06)] p-4">
            <p className="text-sm font-semibold text-[#1d5db8]">Store support</p>
            <p className="mt-2 text-sm text-slate-600">
              Search faster, jump to bike and industrial categories, and keep fitment tools close without crowding the header.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
