import { NextRequest, NextResponse } from 'next/server';
import { filterProducts } from '@/lib/catalog';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filtered = filterProducts({
      oilType: searchParams.get('oilType') || searchParams.get('type') || undefined,
      viscosity: searchParams.get('viscosity') || undefined,
      vehicleType: searchParams.get('vehicleType') || undefined,
      brand: searchParams.get('brand') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json(
      {
        success: true,
        data: {
          ...body,
          id: body.slug || `product-${Date.now()}`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
