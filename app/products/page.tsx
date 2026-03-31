'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { useFilters } from '@/hooks/store';
import { filterProducts, PRODUCT_CATALOG } from '@/lib/catalog';
import { useSearchParams } from 'next/navigation';
import { FiSliders, FiSearch } from 'react-icons/fi';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { filters, setFilter, resetFilters } = useFilters();
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  useEffect(() => {
    resetFilters();

    const oilType = searchParams.get('oilType');
    const vehicleType = searchParams.get('vehicleType');
    const brand = searchParams.get('brand');
    const viscosity = searchParams.get('viscosity');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    if (oilType) setFilter('oilType', oilType);
    if (vehicleType) setFilter('vehicleType', vehicleType);
    if (brand) setFilter('brand', brand);
    if (viscosity) setFilter('viscosity', viscosity);
    if (search) setFilter('search', search);
    if (minPrice) setFilter('minPrice', Number(minPrice));
    if (maxPrice) setFilter('maxPrice', Number(maxPrice));
  }, [searchParams, resetFilters, setFilter]);

  const sortedProducts = useMemo(() => {
    const products = filterProducts(filters);

    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => (a.bulkPrice || a.price) - (b.bulkPrice || b.price));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.bulkPrice || b.price) - (a.bulkPrice || a.price));
        break;
      case 'newest':
        sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }
    return sorted;
  }, [filters, sortBy]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-white/10 bg-[#120605]/80">
          <div className="container-max py-12">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Lubricant catalog</p>
              <h1 className="text-4xl font-bold md:text-5xl">Search by vehicle fitment, viscosity, and oil category.</h1>
              <p className="text-gray-300">
                The catalog is tuned for automotive lubricant sales, so retail and B2B buyers can narrow down the right product quickly.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container-max">
            <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <ProductFilters />
              </aside>

              <div className="space-y-6">
                <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <FiSearch className="text-primary-accent" />
                    <div>
                      <p className="text-sm text-gray-400">Results</p>
                      <p className="text-lg font-semibold">
                        Showing {sortedProducts.length} of {PRODUCT_CATALOG.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                      className="input w-full sm:w-56"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-primary-accent hover:text-primary-accent"
                    >
                      <FiSliders size={16} />
                      Clear filters
                    </button>
                  </div>
                </div>

                {sortedProducts.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product.slug} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-16 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-accent/10 text-3xl text-primary-accent">
                      0
                    </div>
                    <h2 className="mt-6 text-2xl font-bold">No products matched your filters</h2>
                    <p className="mt-3 text-gray-400">
                      Try clearing filters or changing the vehicle fitment to surface more lubricant options.
                    </p>
                    <button onClick={resetFilters} className="btn btn-primary mt-6 rounded-full px-5 py-3">
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
