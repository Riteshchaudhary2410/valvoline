import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getRouteErrorResponse } from '@/lib/route-errors';
import { ApiError } from '@/lib/http-error';
import sharp from 'sharp';
import { slugify } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const formData = await request.formData();
    const file = formData.get('file');
    const slugValue = formData.get('slug');

    if (!(file instanceof File)) {
      throw new ApiError('Image file is required', 400);
    }

    if (typeof slugValue !== 'string' || !slugValue.trim()) {
      throw new ApiError('Product slug is required', 400);
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw new ApiError('Unsupported file type. Please upload jpg, png, webp, or gif.', 400);
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new ApiError('File is too large. Max size is 5MB.', 400);
    }

    const normalizedSlug = slugify(slugValue) || 'product-image';
    const fileName = `${normalizedSlug}.webp`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadsDir, fileName);
    const imageUrl = `/uploads/${fileName}`;

    await mkdir(uploadsDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    const webpBuffer = await sharp(Buffer.from(bytes)).webp({ quality: 90 }).toBuffer();
    await writeFile(filePath, webpBuffer);

    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
      },
    });
  } catch (error) {
    const response = getRouteErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
