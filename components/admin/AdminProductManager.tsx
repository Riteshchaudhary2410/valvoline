'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createAdminHeaders, uploadAdminExcel } from '@/lib/admin-api';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface AdminProductManagerProps {
  adminKey: string;
}

export default function AdminProductManager({ adminKey }: AdminProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isExcelUploading, setIsExcelUploading] = useState(false);
  const [excelMessage, setExcelMessage] = useState<string | null>(null);

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((product) => product.active).length,
    }),
    [products]
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/products', {
          headers: createAdminHeaders(adminKey),
          signal: controller.signal,
        });

        const payload = (await response.json()) as { success: boolean; data?: Product[]; error?: string };

        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error || 'Failed to load products');
        }

        setProducts(payload.data);
      } catch (fetchError) {
        if ((fetchError as Error).name === 'AbortError') return;
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load products');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => controller.abort();
  }, [adminKey]);

  const handleDelete = async (productSlug: string) => {
    const confirmed = window.confirm('Delete this product?');
    if (!confirmed) return;

    setDeletingId(productSlug);

    try {
      const response = await fetch(`/api/products/${productSlug}`, {
        method: 'DELETE',
        headers: createAdminHeaders(adminKey),
      });

      const payload = (await response.json()) as { success: boolean; error?: string };

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to delete product');
      }

      setProducts((currentProducts) => currentProducts.filter((product) => product.slug !== productSlug));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) {
      setExcelMessage('Please choose an .xlsx file first.');
      return;
    }

    setIsExcelUploading(true);
    setExcelMessage(null);

    try {
      const result = await uploadAdminExcel(excelFile, adminKey);
      setExcelMessage(`Imported ${result.processed} rows. ${result.inserted} inserted, ${result.updated} updated.`);
      setExcelFile(null);

      // Refresh the list so the new rows appear immediately.
      const response = await fetch('/api/products', {
        headers: createAdminHeaders(adminKey),
      });

      const payload = (await response.json()) as { success: boolean; data?: Product[]; error?: string };

      if (response.ok && payload.success && payload.data) {
        setProducts(payload.data);
      }
    } catch (uploadError) {
      setExcelMessage(uploadError instanceof Error ? uploadError.message : 'Failed to upload Excel file');
    } finally {
      setIsExcelUploading(false);
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Manage Products</p>
          <h1 className="mt-3 text-3xl font-bold">Product list</h1>
          <p className="mt-2 text-gray-300">Review products, check status, and remove records when needed.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link href="/admin/add" className="btn btn-primary rounded-full px-5 py-3 font-semibold">
            Add Product
          </Link>
          <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-primary-accent hover:text-primary-accent">
            <input
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(event) => setExcelFile(event.target.files?.[0] ?? null)}
              className="hidden"
            />
            {excelFile ? excelFile.name : 'Choose Excel file'}
          </label>
          <button
            type="button"
            onClick={handleExcelUpload}
            disabled={isExcelUploading || !adminKey}
            className="rounded-full border border-primary-accent/40 bg-primary-accent/10 px-5 py-3 font-semibold text-primary-accent transition-colors hover:bg-primary-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExcelUploading ? 'Uploading...' : 'Upload Excel'}
          </button>
        </div>
      </div>

      {excelMessage ? (
        <div className="mb-6 rounded-2xl border border-primary-accent/30 bg-primary-accent/10 px-4 py-3 text-sm text-primary-accent">
          {excelMessage}
        </div>
      ) : null}

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
          <p className="text-sm text-gray-400">Total products</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
          <p className="text-sm text-gray-400">Active products</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.active}</p>
        </div>
      </div>

      {!adminKey ? (
        <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          ADMIN_API_KEY is not configured in the environment.
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-10 text-center text-gray-400">
          No products found.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-gray-500">
                    <span>{product.type.replace(/_/g, ' ')}</span>
                    <span>•</span>
                    <span>{product.active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">{product.name}</h2>
                  <p className="text-sm text-gray-400">{product.slug}</p>
                  <p className="text-sm text-gray-300">{formatPrice(product.price)} • Stock: {product.stock}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/admin/products/${product.id || product.slug}`}
                    className="rounded-full border border-primary-accent/40 bg-primary-accent/10 px-4 py-2 text-sm font-semibold text-primary-accent transition-colors hover:bg-primary-accent/20"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.slug)}
                    disabled={deletingId === product.slug}
                    className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === product.slug ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
