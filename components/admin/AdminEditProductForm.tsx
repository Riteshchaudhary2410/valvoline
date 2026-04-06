'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createAdminHeaders, uploadAdminImage } from '@/lib/admin-api';
import type { ProductType } from '@/types';
import { productTypeOptions } from '@/components/admin/productTypeOptions';

interface EditableProductResponse {
  id: string;
  slug: string;
  name: string;
  price: number;
  type: ProductType;
  stock: number;
  image?: string;
}

interface AdminEditProductFormProps {
  adminKey: string;
  productId: string;
}

export default function AdminEditProductForm({ adminKey, productId }: AdminEditProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<ProductType>('ENGINE_OIL');
  const [stock, setStock] = useState('0');
  const [currentSlug, setCurrentSlug] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${productId}`, {
          headers: createAdminHeaders(adminKey),
          signal: controller.signal,
        });

        const payload = (await response.json()) as {
          success: boolean;
          data?: EditableProductResponse;
          error?: string;
        };

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error || 'Failed to load product');
        }

        setName(payload.data.name);
        setPrice(String(payload.data.price));
        setType(payload.data.type);
        setStock(String(payload.data.stock ?? 0));
        setCurrentSlug(payload.data.slug);
        setCurrentImage(payload.data.image || '');
        setImageFile(null);
      } catch (fetchError) {
        if ((fetchError as Error).name === 'AbortError') return;
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load product');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    if (adminKey) {
      void loadProduct();
    } else {
      setIsLoading(false);
      setError('ADMIN_API_KEY is not configured in the environment.');
    }

    return () => controller.abort();
  }, [adminKey, productId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let nextImagePath = currentImage;

      if (imageFile) {
        nextImagePath = await uploadAdminImage(imageFile, currentSlug || productId, adminKey);
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: createAdminHeaders(adminKey, true),
        body: JSON.stringify({
          name,
          price: Number(price),
          type,
          stock: Number(stock),
          image: nextImagePath || undefined,
        }),
      });

      const payload = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to update product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Edit Product</p>
        <h1 className="mt-3 text-3xl font-bold">Update product details</h1>
        <p className="mt-2 text-gray-300">Edit name, price, type, and stock for this product.</p>
      </div>

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-12 rounded-xl" />
          <div className="skeleton h-12 rounded-xl" />
        </div>
      ) : (
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-300">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="input"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-300">Price</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="input"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-300">Type</span>
            <select value={type} onChange={(event) => setType(event.target.value as ProductType)} className="input">
              {productTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-300">Stock</span>
            <input
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              className="input"
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-300">Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null;
                setImageFile(nextFile);
              }}
              className="input file:mr-4 file:rounded-full file:border-0 file:bg-primary-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#1b0c04]"
            />
            {currentImage ? (
              <span className="text-xs text-gray-400">Current image: {currentImage}</span>
            ) : null}
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !adminKey}
              className="btn btn-primary rounded-full px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Updating...' : 'Update product'}
            </button>
            <Link
              href="/admin/products"
              className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-white/40"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
