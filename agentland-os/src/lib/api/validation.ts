import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

// Common validation schemas
export const schemas = {
  // User registration
  register: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    company: z.string().optional(),
  }),

  // Login
  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),

  // Business workspace
  workspace: z.object({
    name: z.string().min(2).max(100),
    businessProfile: z.object({
      companyName: z.string().min(2).max(200),
      taxId: z.string().regex(/^DE\d{9}$/, 'Invalid German tax ID'),
      industry: z.string(),
      size: z.enum(['micro', 'small', 'medium']),
    }).optional(),
  }),

  // Agent execution
  agentExecution: z.object({
    agentId: z.string().uuid(),
    input: z.record(z.any()),
    workspaceId: z.string().uuid(),
  }),

  // Invoice creation
  invoice: z.object({
    customerData: z.object({
      name: z.string(),
      address: z.string(),
      taxId: z.string().optional(),
    }),
    items: z.array(z.object({
      description: z.string(),
      quantity: z.number().positive(),
      unitPrice: z.number().positive(),
      vatRate: z.number().min(0).max(100),
    })),
    dueDate: z.string().datetime(),
  }),

  // Pagination
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
};

// Validation middleware factory
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return async (req: NextRequest): Promise<{ 
    data: T | null; 
    error: NextResponse | null;
  }> => {
    try {
      const body = await req.json();
      const data = schema.parse(body);
      return { data, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          data: null,
          error: NextResponse.json(
            {
              error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: error.errors.map(err => ({
                  field: err.path.join('.'),
                  message: err.message,
                })),
              },
            },
            { status: 400 }
          ),
        };
      }

      return {
        data: null,
        error: NextResponse.json(
          {
            error: {
              message: 'Invalid request format',
              code: 'PARSE_ERROR',
            },
          },
          { status: 400 }
        ),
      };
    }
  };
}

// Query validation helper
export function validateQuery<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): { data: T | null; error: string | null } {
  try {
    const params = Object.fromEntries(searchParams.entries());
    const data = schema.parse(params);
    return { data, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        error: error.errors.map(e => `${e.path}: ${e.message}`).join(', '),
      };
    }
    return { data: null, error: 'Invalid query parameters' };
  }
}

// Type-safe API response helper
export function apiResponse<T>(
  data: T,
  status = 200,
  headers?: HeadersInit
): NextResponse {
  return NextResponse.json(
    { data, error: null },
    { status, headers }
  );
}

export function apiError(
  message: string,
  status = 500,
  code?: string
): NextResponse {
  return NextResponse.json(
    {
      data: null,
      error: { message, code: code || 'ERROR' },
    },
    { status }
  );
}