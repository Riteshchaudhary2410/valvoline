'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAdminHeaders, uploadAdminImage } from '@/lib/admin-api';
import { slugify } from '@/lib/utils';
import { ProductType } from '@/types';
import { productTypeOptions } from '@/components/admin/productTypeOptions';

interface AdminProductFormProps {
  adminKey: string;
}

export default function AdminProductForm({ adminKey }: AdminProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<ProductType>('ENGINE_OIL');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const generatedSlug = useMemo(() => slugify(name), [name]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      let imagePath: string | undefined;

      if (imageFile) {
        imagePath = await uploadAdminImage(imageFile, generatedSlug, adminKey);
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: createAdminHeaders(adminKey, true),
        body: JSON.stringify({
          name,
          price: Number(price),
          type,
          slug: generatedSlug,
          image: imagePath,
        }),
      });

      const payload = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to create product');
      }

      setMessage(`Product created successfully: ${generatedSlug}`);
      setName('');
      setPrice('');
      setType('ENGINE_OIL');
      setImageFile(null);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Add Product</p>
        <h1 className="mt-3 text-3xl font-bold">Create a new product</h1>
        <p className="mt-2 text-gray-300">The slug is generated automatically from the product name.</p>
      </div>

      {message ? (
        <div className="mb-6 rounded-2xl border border-primary-accent/30 bg-primary-accent/10 px-4 py-3 text-sm text-primary-accent">
          {message}
        </div>
      ) : null}

      {!adminKey ? (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          ADMIN_API_KEY is not configured in the environment.
        </div>
      ) : null}

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-gray-300">Name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input"
            placeholder="Valvoline Example Product"
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
            placeholder="499"
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
        </label>

        <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-gray-400">
          Slug preview: <span className="font-semibold text-white">{generatedSlug || 'product-slug'}</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !adminKey}
          className="btn btn-primary rounded-full px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Save product'}
        </button>
      </form>
    </div>
  );
}
