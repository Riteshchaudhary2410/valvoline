import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from '@/lib/http-error';
import { getRouteErrorResponse } from '@/lib/route-errors';
import { ADMIN_SESSION_COOKIE, createAdminSessionToken } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: unknown };
    const password = typeof body.password === 'string' ? body.password.trim() : '';
    const adminKey = process.env.ADMIN_API_KEY;

    if (!adminKey) {
      throw new ApiError('ADMIN_API_KEY is not configured', 500);
    }

    if (!password) {
      throw new ApiError('Password is required', 400);
    }

    if (password !== adminKey) {
      throw new ApiError('Invalid password', 401);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    const response = getRouteErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
