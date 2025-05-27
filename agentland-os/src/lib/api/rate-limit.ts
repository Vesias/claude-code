import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest, NextResponse } from 'next/server';

// In-memory store for development/small deployments
class InMemoryStore {
  private store: Map<string, { count: number; resetAt: number }> = new Map();
  
  async get(key: string): Promise<number | null> {
    const data = this.store.get(key);
    if (!data) return null;
    
    // Check if rate limit window has expired
    if (Date.now() > data.resetAt) {
      this.store.delete(key);
      return null;
    }
    
    return data.count;
  }
  
  async set(key: string, value: number, ttl: number): Promise<void> {
    this.store.set(key, {
      count: value,
      resetAt: Date.now() + ttl * 1000
    });
  }
  
  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const newValue = (current || 0) + 1;
    
    // Default TTL of 60 seconds if not set
    const data = this.store.get(key);
    const resetAt = data?.resetAt || Date.now() + 60000;
    
    this.store.set(key, {
      count: newValue,
      resetAt
    });
    
    return newValue;
  }
  
  async decr(key: string): Promise<number> {
    const current = await this.get(key);
    const newValue = Math.max(0, (current || 0) - 1);
    
    const data = this.store.get(key);
    const resetAt = data?.resetAt || Date.now() + 60000;
    
    this.store.set(key, {
      count: newValue,
      resetAt
    });
    
    return newValue;
  }
}

// Create rate limiters for different endpoints
const store = new InMemoryStore();

export const rateLimiters = {
  // Strict limit for auth endpoints
  auth: new Ratelimit({
    redis: store as any, // Type assertion for compatibility
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
    analytics: false,
  }),
  
  // Standard API limit
  api: new Ratelimit({
    redis: store as any,
    limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
    analytics: false,
  }),
  
  // AI endpoints (more expensive)
  ai: new Ratelimit({
    redis: store as any,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
    analytics: false,
  }),
  
  // Public endpoints
  public: new Ratelimit({
    redis: store as any,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: false,
  }),
};

// Rate limit middleware
export async function rateLimit(
  req: NextRequest,
  type: keyof typeof rateLimiters = 'api'
): Promise<NextResponse | null> {
  // Get identifier (IP address or user ID)
  const identifier = req.ip ?? req.headers.get('x-forwarded-for') ?? 'anonymous';
  
  const { success, limit, reset, remaining } = await rateLimiters[type].limit(
    identifier
  );
  
  if (!success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        limit,
        remaining,
        reset: new Date(reset).toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(reset).toISOString(),
        },
      }
    );
  }
  
  return null;
}

// Helper to apply rate limiting to API routes
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  type: keyof typeof rateLimiters = 'api'
) {
  return async (req: NextRequest) => {
    const rateLimitResponse = await rateLimit(req, type);
    if (rateLimitResponse) return rateLimitResponse;
    
    return handler(req);
  };
}