import { ZodError } from 'zod';
import { ApiError } from '@/lib/http-error';

export interface RouteErrorResponse {
  status: number;
  body: {
    success: false;
    error: string;
    details?: unknown;
  };
}

export function getRouteErrorResponse(error: unknown): RouteErrorResponse {
  if (error instanceof ZodError) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Validation failed',
        details: error.flatten(),
      },
    };
  }

  if (error instanceof ApiError) {
    return {
      status: error.statusCode,
      body: {
        success: false,
        error: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    };
  }

  const message = error instanceof Error ? error.message : 'Internal server error';

  return {
    status: 500,
    body: {
      success: false,
      error: message,
    },
  };
}
