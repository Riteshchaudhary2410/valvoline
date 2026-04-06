import { NextRequest, NextResponse } from 'next/server';
import { getRouteErrorResponse } from '@/lib/route-errors';
import { requireAdmin } from '@/lib/admin-auth';
import { createProduct } from '@/lib/product-service';
import { readJsonBody } from '@/lib/request-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

