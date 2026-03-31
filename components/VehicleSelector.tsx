'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { FiChevronRight, FiRefreshCw, FiTruck } from 'react-icons/fi';
import { getVehicleBrands, getVehicleModels } from '@/lib/vehicleData';
import { getVehicleRecommendations } from '@/lib/catalog';
import { useVehicleSelector } from '@/hooks/store';
import { formatNumber, formatPrice } from '@/lib/utils';

const VEHICLE_TYPES = ['Bike', 'Car', 'Truck'];

export default function VehicleSelector() {
  const vehicleSelector = useVehicleSelector();
  const [currentStep, setCurrentStep] = useState(0);

  const selected = vehicleSelector.selectedVehicle;

  type StepConfig = {
    label: string;
    options: string[];
    value?: string;
    setter: (value: string) => void;
    disabled?: boolean;
  };

  const steps: StepConfig[] = [
    {
      label: 'Vehicle Type',
      options: VEHICLE_TYPES,
      value: selected.type,
      setter: vehicleSelector.setVehicleType,
    },
    {
      label: 'Brand',
      options: selected.type ? getVehicleBrands(selected.type) : [],
      value: selected.brand,
      setter: vehicleSelector.setVehicleBrand,
      disabled: !selected.type,
    },
    {
      label: 'Model',
      options: selected.type && selected.brand ? getVehicleModels(selected.type, selected.brand) : [],
      value: selected.model,
      setter: vehicleSelector.setVehicleModel,
      disabled: !selected.brand,
    },
  ];

  const currentStepData = steps[currentStep];
  const recommendations = useMemo(() => getVehicleRecommendations(selected), [selected]);
  const topRecommendation = recommendations[0];

  const handleSelectOption = (option: string) => {
    currentStepData.setter(option);
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handleReset = () => {
    vehicleSelector.resetVehicle();
    setCurrentStep(0);
  };

  const canShowRecommendations = Boolean(selected.type && selected.brand && selected.model);

  return (
    <div className="space-y-8">
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Smart selector</p>
            <h3 className="text-2xl font-bold">Choose a vehicle, then tune the oil fitment</h3>
          </div>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-gray-300 transition-colors hover:text-primary-accent"
          >
            <FiRefreshCw size={16} />
            Reset
          </button>
        </div>

        <div className="mt-6 h-2 rounded-full bg-black/20">
          <div
            className="h-2 rounded-full bg-primary-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.22em] text-gray-500">
          {steps.map((step, index) => (
            <span key={step.label} className={index === currentStep ? 'text-primary-accent' : ''}>
              {step.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <button
            key={step.label}
            onClick={() => setCurrentStep(index)}
            className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
              index === currentStep
                ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                : 'border-white/10 bg-white/5 text-gray-300 hover:border-primary-accent/30'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-gray-500">{step.label}</p>
            <p className="mt-1 font-semibold">{step.value || 'Select'}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {currentStepData.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelectOption(option)}
            disabled={currentStepData.disabled}
            className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition-all ${
              currentStepData.value === option
                ? 'border-primary-accent bg-primary-accent/10 text-primary-accent'
                : 'border-white/10 bg-white/5 text-gray-200 hover:-translate-y-0.5 hover:border-primary-accent/40'
            } ${currentStepData.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="grid gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 md:grid-cols-[1fr_0.85fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Kilometres driven</p>
              <h4 className="text-lg font-bold">Use the odometer to tune the recommendation</h4>
            </div>
            <FiTruck className="text-primary-accent" size={22} />
          </div>

          <input
            type="range"
            min="0"
            max="200000"
            step="1000"
            value={selected.kmDriven || 0}
            onChange={(e) => vehicleSelector.setKmDriven(Number(e.target.value))}
            className="w-full accent-primary-accent"
          />

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300">
            <span>KM driven</span>
            <span className="font-semibold text-white">{formatNumber(selected.kmDriven || 0)} km</span>
          </div>

          <p className="text-sm text-gray-400">
            Higher kilometre readings push the recommendation toward thicker or high-mileage oils.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-primary-accent/20 bg-primary-accent/10 p-4">
          <p className="text-sm uppercase tracking-[0.24em] text-primary-accent">Recommendation</p>
          {topRecommendation ? (
            <div className="mt-3 space-y-3">
              <h4 className="text-xl font-bold">{topRecommendation.product.name}</h4>
              <p className="text-sm text-gray-200">{topRecommendation.reason}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-gray-500">Viscosity</p>
                  <p className="mt-1 font-semibold text-white">{topRecommendation.product.viscosity || 'N/A'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <p className="text-gray-500">Pack size</p>
                  <p className="mt-1 font-semibold text-white">
                    {topRecommendation.product.quantity} {topRecommendation.product.quantityUnit}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {topRecommendation.product.vehicleTypes?.map((type) => (
                  <span key={type} className="badge badge-secondary">
                    {type}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <span className="text-sm text-gray-300">Starting price</span>
                <span className="text-lg font-bold text-primary-accent">
                  {formatPrice(topRecommendation.product.bulkPrice || topRecommendation.product.price)}
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-300">
              Pick a vehicle type, brand, and model to unlock a lubricant match.
            </p>
          )}
        </div>
      </div>

      {selected.type && selected.brand && selected.model && canShowRecommendations && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Recommended lubricants</p>
              <h4 className="text-2xl font-bold">Best matches for your selection</h4>
            </div>
            <Link
              href={`/products?vehicleType=${selected.type}&brand=${encodeURIComponent(selected.brand || '')}&search=${encodeURIComponent(selected.model || '')}`}
              className="btn btn-outline rounded-full px-4 py-2 text-sm"
            >
              View all
              <FiChevronRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {recommendations.map((item) => (
              <Link
                href={`/products/${item.product.slug}`}
                key={item.product.slug}
                className="group rounded-[1.5rem] border border-white/10 bg-white/5 p-4 transition-all hover:-translate-y-1 hover:border-primary-accent/40 hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-gray-500">{item.product.brand}</p>
                    <h5 className="mt-1 text-lg font-bold group-hover:text-primary-accent">{item.product.name}</h5>
                  </div>
                  <span className="rounded-full bg-primary-accent px-2.5 py-1 text-[11px] font-bold text-[#1b0c04]">
                    {item.score}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-300">{item.note}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-gray-500">Viscosity</p>
                    <p className="mt-1 font-semibold text-white">{item.product.viscosity || 'N/A'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-gray-500">Quantity</p>
                    <p className="mt-1 font-semibold text-white">
                      {item.product.quantity} {item.product.quantityUnit}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-primary-accent">
                  {item.product.useCase}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
