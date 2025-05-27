import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code || 'API_ERROR',
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    // Database errors
    if (error.message.includes('P2002')) {
      return NextResponse.json(
        {
          error: {
            message: 'Duplicate entry found',
            code: 'DUPLICATE_ENTRY',
          },
        },
        { status: 409 }
      );
    }

    // Authentication errors
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json(
        {
          error: {
            message: 'Authentication required',
            code: 'UNAUTHORIZED',
          },
        },
        { status: 401 }
      );
    }
  }

  // Default error response
  return NextResponse.json(
    {
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    },
    { status: 500 }
  );
}

// Wrap API route handlers
export function withErrorHandler<T extends (...args: any[]) => any>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  }) as T;
}