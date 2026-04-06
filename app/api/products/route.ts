import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/http-error';
import { getRouteErrorResponse } from '@/lib/route-errors';
import { requireAdmin } from '@/lib/admin-auth';
import { parseBooleanQuery, parseProductTypeQuery, readJsonBody, readOptionalJsonBody } from '@/lib/request-utils';
import { createProduct, deleteProduct, listProducts, updateProduct } from '@/lib/product-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const products = await listProducts({
      search: params.get('search') || undefined,
      slug: params.get('slug')?.trim().toLowerCase() || undefined,
      packageGroup: params.get('packageGroup') || undefined,
      type: parseProductTypeQuery(params.get('type') || params.get('oilType')),
      vehicleType: params.get('vehicleType') || undefined,
      brand: params.get('brand') || undefined,
      viscosity: params.get('viscosity') || undefined,
      minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      active: parseBooleanQuery(params.get('active')),
    });

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    const response = getRouteErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}


export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    const body = await readJsonBody<unknown>(request);
    const product = await createProduct(body);

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    const response = getRouteErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = (await readOptionalJsonBody<Record<string, unknown>>(request)) ?? {};
    const identifier = String(body.id ?? body.slug ?? body.identifier ?? '').trim();

    if (!identifier) {
      throw new ApiError('Product identifier is required', 400);
    }

    const { id, slug, identifier: _identifier, ...updates } = body;
    const product = await updateProduct(identifier, updates);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    const response = getRouteErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    requireAdmin(request);

    const params = request.nextUrl.searchParams;
    const body = (await readOptionalJsonBody<Record<string, unknown>>(request)) ?? {};
    const identifier = String(
      params.get('id') ??
        params.get('slug') ??
        body.id ??
        body.slug ??
        body.identifier ??
        ''
    ).trim();

    if (!identifier) {
      throw new ApiError('Product identifier is required', 400);
    }

    const result = await deleteProduct(identifier);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const response = getRouteErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
