import { NextRequest, NextResponse } from 'next/server';
import { getRouteErrorResponse } from '@/lib/route-errors';
import { requireAdmin } from '@/lib/admin-auth';
import { deleteProduct, updateProduct } from '@/lib/product-service';
import { readOptionalJsonBody } from '@/lib/request-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    const body = await readOptionalJsonBody<unknown>(request);
    const product = await updateProduct(params.id, body ?? {});

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    const response = getRouteErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);
    const result = await deleteProduct(params.id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const response = getRouteErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
