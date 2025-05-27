import { NextRequest, NextResponse } from 'next/server';

// CORS configuration with environment-based domain lists
export const corsConfig = {
  // Allowed origins - can be configured via environment variables
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001', // API Gateway
    'https://agentland.saarland',
    'https://www.agentland.saarland',
    'https://app.agentland.saarland',
    // Additional domains from environment
    ...(process.env.CORS_ALLOWED_ORIGINS?.split(',') || []),
  ].filter(Boolean),

  // Allowed methods
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-Workspace-Id',
    'X-Agent-Id',
  ],

  // Exposed headers (available to client)
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'X-Request-Id',
  ],

  // Credentials support
  credentials: true,

  // Max age for preflight cache
  maxAge: 86400, // 24 hours
};

// CORS middleware
export function cors(req: NextRequest): NextResponse | null {
  const origin = req.headers.get('origin');
  const method = req.method;

  // Handle preflight requests
  if (method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    
    // Check if origin is allowed
    if (origin && isOriginAllowed(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', corsConfig.allowedMethods.join(', '));
      response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '));
      response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString());
    }
    
    return response;
  }

  return null;
}

// Check if origin is allowed
function isOriginAllowed(origin: string): boolean {
  // In development, allow all localhost origins
  if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
    return true;
  }

  // Check against allowed origins list
  return corsConfig.allowedOrigins.includes(origin);
}

// Apply CORS headers to response
export function applyCorsHeaders(response: NextResponse, req: NextRequest): NextResponse {
  const origin = req.headers.get('origin');
  
  if (origin && isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Expose-Headers', corsConfig.exposedHeaders.join(', '));
  }
  
  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-Id', requestId);
  
  return response;
}

// Middleware wrapper for CORS
export function withCors(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    // Handle preflight
    const corsResponse = cors(req);
    if (corsResponse) return corsResponse;
    
    // Process request
    const response = await handler(req);
    
    // Apply CORS headers
    return applyCorsHeaders(response, req);
  };
}