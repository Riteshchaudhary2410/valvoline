import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
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
      message:
        'Cart persistence is handled locally in this build. Connect Prisma when a generated client is available.',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = getProductBySlug(productId) || getProductBySlug(String(productId));

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          product,
          quantity,
          price: product.price,
          total: product.price * quantity,
        },
        message: 'Cart preview updated locally',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
