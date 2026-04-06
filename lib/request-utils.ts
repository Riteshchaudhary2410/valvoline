import type { NextRequest } from 'next/server';
import { PRODUCT_TYPES } from '@/models/Product';
import { ApiError } from '@/lib/http-error';
import type { ProductType } from '@/types';

export function parseBooleanQuery(value: string | null): boolean | undefined {
  if (value === null) {
    return undefined;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}

export function parseProductTypeQuery(value: string | null): ProductType | undefined {
  if (!value) {
    return undefined;
  }

  return PRODUCT_TYPES.includes(value as ProductType) ? (value as ProductType) : undefined;
}

export async function readJsonBody<T>(request: NextRequest): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError('Invalid JSON payload', 400);
  }
}

export async function readOptionalJsonBody<T>(request: NextRequest): Promise<T | null> {
  const bodyText = await request.text();

  if (!bodyText.trim()) {
    return null;
  }

  try {
    return JSON.parse(bodyText) as T;
  } catch {
    throw new ApiError('Invalid JSON payload', 400);
  }
}
