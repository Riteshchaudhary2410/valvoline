import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/catalog';
import { validateProductSlug, validateQuantity } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface CartItemRequest {
  productId?: unknown;
  quantity?: unknown;
}

/**
 * GET: Retrieve cart for user (locally persisted in this build)
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId?.trim()) {
    return NextResponse.json(
      { success: false, error: 'User ID is required' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      userId,
      items: [],
      total: 0,
      message: 'Cart persistence handled locally with Zustand store.',
    },
  });
}

/**
 * POST: Add or preview item for cart
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CartItemRequest;
    const { productId, quantity = 1 } = body;

    // Validate productId
    const validSlug = validateProductSlug(productId);

    // Validate quantity
    const validQuantity = validateQuantity(quantity);

    // Find product
    const product = getProductBySlug(validSlug);

    if (!product) {
      return NextResponse.json(
        { success: false, error: `Product not found: ${validSlug}` },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock === 0) {
      return NextResponse.json(
        { success: false, error: 'Product out of stock' },
        { status: 409 }
      );
    }

    if (validQuantity > product.stock) {
      return NextResponse.json(
        { success: false, error: `Only ${product.stock} units available` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          product,
          quantity: validQuantity,
          price: product.price,
          total: product.price * validQuantity,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid cart request';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
