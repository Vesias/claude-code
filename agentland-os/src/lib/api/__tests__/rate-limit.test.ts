import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimiters, rateLimit, withRateLimit } from '../rate-limit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    vi.clearAllMocks()
  })

  describe('rateLimit middleware', () => {
    it('should allow requests within rate limit', async () => {
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      })

      const response = await rateLimit(req, 'api')
      expect(response).toBeNull()
    })

    it('should block requests exceeding rate limit', async () => {
      const req = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'x-forwarded-for': '192.168.1.2',
        },
      })

      // Make requests up to the limit (5 for auth)
      for (let i = 0; i < 5; i++) {
        const response = await rateLimit(req, 'auth')
        expect(response).toBeNull()
      }

      // The 6th request should be blocked
      const response = await rateLimit(req, 'auth')
      expect(response).not.toBeNull()
      expect(response?.status).toBe(429)
      
      const body = await response?.json()
      expect(body.error).toBe('Too many requests')
    })

    it('should include rate limit headers', async () => {
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.3',
        },
      })

      // Make some requests
      for (let i = 0; i < 3; i++) {
        await rateLimit(req, 'auth')
      }

      // Get blocked response
      for (let i = 0; i < 3; i++) {
        await rateLimit(req, 'auth')
      }
      
      const response = await rateLimit(req, 'auth')
      expect(response).not.toBeNull()
      
      expect(response?.headers.get('X-RateLimit-Limit')).toBe('5')
      expect(response?.headers.get('X-RateLimit-Remaining')).toBe('0')
      expect(response?.headers.get('X-RateLimit-Reset')).toBeTruthy()
    })
  })

  describe('withRateLimit wrapper', () => {
    it('should wrap handler with rate limiting', async () => {
      const handler = vi.fn(async (req: NextRequest) => {
        return NextResponse.json({ success: true })
      })

      const wrappedHandler = withRateLimit(handler, 'auth')
      
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.4',
        },
      })

      // Should allow first request
      const response = await wrappedHandler(req)
      expect(handler).toHaveBeenCalledTimes(1)
      expect(response.status).toBe(200)
    })

    it('should block handler when rate limited', async () => {
      const handler = vi.fn(async (req: NextRequest) => {
        return NextResponse.json({ success: true })
      })

      const wrappedHandler = withRateLimit(handler, 'auth')
      
      const req = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.5',
        },
      })

      // Make requests up to limit
      for (let i = 0; i < 5; i++) {
        await wrappedHandler(req)
      }

      // Next request should be blocked
      const response = await wrappedHandler(req)
      expect(handler).toHaveBeenCalledTimes(5) // Handler not called on 6th request
      expect(response.status).toBe(429)
    })
  })
})