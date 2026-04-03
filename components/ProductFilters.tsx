'use client';

import React, { useState } from 'react';
import { FiX, FiSliders } from 'react-icons/fi';
import { useFilters } from '@/hooks/store';
import { getBrandOptions, getViscosityOptions } from '@/lib/catalog';
import { ProductType } from '@/types';

const productTypes: { value: ProductType; label: string }[] = [
  { value: 'ENGINE_OIL', label: 'Engine Oil' },
  { value: 'GEAR_OIL', label: 'Gear Oil' },
  { value: 'HYDRAULIC_OIL', label: 'Hydraulic Oil' },
  { value: 'GREASE', label: 'Grease' },
  { value: 'INDUSTRIAL_OILS', label: 'Industrial Oils' },
];

interface ProductFiltersProps {
  onMobileClose?: () => void;
}

export default function ProductFilters({ onMobileClose }: ProductFiltersProps) {
  const { filters, setFilter, resetFilters } = useFilters();
  const [mobileOpen, setMobileOpen] = useState(false);
  const brandOptions = getBrandOptions();
  const viscosityOptions = getViscosityOptions();

  const handleClose = () => {
    setMobileOpen(false);
    onMobileClose?.();
  };

  const updateNumberFilter = (key: 'minPrice' | 'maxPrice', value: string) => {
    setFilter(key, value ? Number(value) : undefined);
  };

  const FilterPanel = (
    <div className="space-y-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Filter</p>
          <h3 className="text-lg font-bold">Refine your lubricant search</h3>
        </div>
        <button onClick={() => {
          resetFilters();
        }} className="text-sm text-primary-accent">
          Clear
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-300">Search</label>
        <input
          type="text"
          placeholder="Search products..."
          className="input"
          onChange={(e) => setFilter('search', e.target.value)}
          value={filters.search || ''}
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">Vehicle Type</label>
        <div className="grid grid-cols-1 gap-2">
          {['Bike', 'Car', 'Truck'].map((type) => (
            <label key={type} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
              <input
                type="radio"
                checked={filters.vehicleType === type}
                onChange={(e) => setFilter('vehicleType', e.target.checked ? type : undefined)}
                className="h-4 w-4 border-gray-600 text-primary-accent focus:ring-primary-accent"
              />
              <span className="text-sm text-gray-300">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">Oil Type</label>
        <div className="grid grid-cols-1 gap-2">
          {productTypes.map((type) => (
            <label key={type.value} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
              <input
                type="radio"
                checked={filters.oilType === type.value}
                onChange={(e) => setFilter('oilType', e.target.checked ? type.value : undefined)}
                className="h-4 w-4 border-gray-600 text-primary-accent focus:ring-primary-accent"
              />
              <span className="text-sm text-gray-300">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">Viscosity</label>
        <div className="flex flex-wrap gap-2">
          {viscosityOptions.map((visc) => (
            <button
              key={visc}
              onClick={() => setFilter('viscosity', filters.viscosity === visc ? undefined : visc)}
              className={`rounded-full border px-3 py-2 text-xs transition-colors ${
                filters.viscosity === visc
                  ? 'border-primary-accent bg-primary-accent/15 text-primary-accent'
                  : 'border-white/10 bg-black/15 text-gray-300 hover:border-primary-accent/40'
              }`}
            >
              {visc}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-300">Brand</label>
        <div className="flex flex-wrap gap-2">
          {brandOptions.map((brand) => (
            <button
              key={brand}
              onClick={() => setFilter('brand', filters.brand === brand ? undefined : brand)}
              className={`rounded-full border px-3 py-2 text-xs transition-colors ${
                filters.brand === brand
                  ? 'border-primary-accent bg-primary-accent/15 text-primary-accent'
                  : 'border-white/10 bg-black/15 text-gray-300 hover:border-primary-accent/40'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label htmlFor="filter-min-price" className="block text-sm font-semibold text-gray-300">
            Min Price
          </label>
          <input
            id="filter-min-price"
            type="number"
            placeholder="0"
            min="0"
            value={filters.minPrice || ''}
            onChange={(e) => updateNumberFilter('minPrice', e.target.value)}
            className="input"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="filter-max-price" className="block text-sm font-semibold text-gray-300">
            Max Price
          </label>
          <input
            id="filter-max-price"
            type="number"
            placeholder="10000"
            min="0"
            value={filters.maxPrice || ''}
            onChange={(e) => updateNumberFilter('maxPrice', e.target.value)}
            className="input"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-200 md:hidden"
      >
        <FiSliders size={18} />
        Filters
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed left-0 top-0 z-50 h-full w-[88vw] max-w-sm overflow-y-auto border-r border-white/10 bg-[#120605] transition-transform duration-300 md:static md:w-auto md:border-0 md:bg-transparent ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 md:p-0">
          <div className="mb-4 flex items-center justify-between md:hidden">
            <h3 className="text-lg font-bold">Filters</h3>
            <button onClick={handleClose} className="rounded-full border border-white/10 bg-white/5 p-2 text-gray-300">
              <FiX size={18} />
            </button>
          </div>
          {FilterPanel}
        </div>
      </div>
    </>
  );
}
