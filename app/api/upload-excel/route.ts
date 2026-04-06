import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getRouteErrorResponse } from '@/lib/route-errors';
import { requireAdmin } from '@/lib/admin-auth';
import { ApiError } from '@/lib/http-error';
import { parseExcelProducts } from '@/lib/excel-import';
import { ProductModel } from '@/models/Product';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      throw new ApiError('Excel file is required', 400);
    }

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      throw new ApiError('Only .xlsx files are supported', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const products = parseExcelProducts(buffer);

    if (products.length === 0) {
      throw new ApiError('No valid product rows were found in the Excel file', 400);
    }

    await connectToDatabase();

    const existingProducts = await ProductModel.find({ slug: { $in: products.map((product) => product.slug) } })
      .select('slug')
      .lean<Array<{ slug: string }>>();

    const existingSlugs = new Set(existingProducts.map((product) => product.slug));
    let inserted = 0;
    let updated = 0;

    for (const product of products) {
      await ProductModel.updateOne(
        { slug: product.slug },
        {
          $set: product,
        },
        { upsert: true }
      );

      if (existingSlugs.has(product.slug)) {
        updated += 1;
      } else {
        inserted += 1;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        processed: products.length,
        inserted,
        updated,
      },
    });
  } catch (error) {
    const response = getRouteErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
