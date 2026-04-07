import { NextRequest } from 'next/server';
import { ApiError } from '@/lib/http-error';

export const ADMIN_SESSION_COOKIE = 'admin-session';

const textEncoder = new TextEncoder();
const ADMIN_SESSION_PURPOSE = 'valvoline-admin-session';

function getAdminKey(): string {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    throw new ApiError('ADMIN_API_KEY is not configured', 500);
  }

  return adminKey;
}

async function createSessionSignature(secret: string): Promise<string> {
  const cryptoKey = await globalThis.crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await globalThis.crypto.subtle.sign('HMAC', cryptoKey, textEncoder.encode(ADMIN_SESSION_PURPOSE));

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export async function createAdminSessionToken(): Promise<string> {
  return createSessionSignature(getAdminKey());
}

export async function isAdminSessionValid(sessionToken: string | undefined): Promise<boolean> {
  if (!sessionToken) {
    return false;
  }

  const expectedToken = await createAdminSessionToken();

  if (sessionToken.length !== expectedToken.length) {
    return false;
  }

  return sessionToken === expectedToken;
}

export async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  if (!process.env.ADMIN_API_KEY) {
    return false;
  }

  return isAdminSessionValid(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function requireAdmin(request: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    throw new ApiError('ADMIN_API_KEY is not configured', 500);
  }

  const authorizationHeader = request.headers.get('authorization');
  const xAdminKey = request.headers.get('x-admin-key');
  const providedKey =
    authorizationHeader?.startsWith('Bearer ') ? authorizationHeader.slice(7).trim() : authorizationHeader || xAdminKey;

  if (providedKey !== adminKey) {
    throw new ApiError('Unauthorized', 401);
  }
}
