import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { schemas, validateRequest, apiResponse, apiError } from '../validation'

describe('Validation', () => {
  describe('schemas', () => {
    describe('register schema', () => {
      it('should validate valid registration data', () => {
        const data = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'SecurePassword123!',
        }

        const result = schemas.register.safeParse(data)
        expect(result.success).toBe(true)
        expect(result.data).toEqual(data)
      })

      it('should reject invalid email', () => {
        const data = {
          name: 'Test User',
          email: 'invalid-email',
          password: 'SecurePassword123!',
        }

        const result = schemas.register.safeParse(data)
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Invalid email')
      })

      it('should reject short password', () => {
        const data = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'short',
        }

        const result = schemas.register.safeParse(data)
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('String must contain at least 8 character(s)')
      })
    })

    describe('workspace schema', () => {
      it('should validate German tax ID', () => {
        const data = {
          name: 'Test Company',
          taxId: 'DE123456789',
          industry: 'Technology',
          size: 'medium' as const,
        }

        const result = schemas.workspace.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should reject invalid German tax ID', () => {
        const data = {
          name: 'Test Company',
          taxId: 'US123456789', // Not German
          industry: 'Technology',
          size: 'medium' as const,
        }

        const result = schemas.workspace.safeParse(data)
        expect(result.success).toBe(false)
        expect(result.error?.issues[0].message).toBe('Invalid German tax ID')
      })
    })

    describe('ai tool schemas', () => {
      it('should validate service idea request', () => {
        const data = {
          prompt: 'I need ideas for a bakery business',
          industry: 'Food & Beverage',
          targetMarket: 'Local community',
          budget: 50000,
        }

        const result = schemas.aiTools.serviceIdea.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should validate email request', () => {
        const data = {
          type: 'business' as const,
          subject: 'Partnership Proposal',
          tone: 'professional' as const,
          recipient: 'partner@company.com',
          context: 'We would like to discuss a partnership',
        }

        const result = schemas.aiTools.email.safeParse(data)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('validateRequest', () => {
    it('should validate request body against schema', async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().min(0),
      })

      const mockRequest = {
        json: async () => ({ name: 'Test', age: 25 }),
      } as Request

      const result = await validateRequest(mockRequest, schema)
      expect(result).toEqual({ name: 'Test', age: 25 })
    })

    it('should throw error for invalid data', async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number().min(0),
      })

      const mockRequest = {
        json: async () => ({ name: 'Test', age: -5 }),
      } as Request

      await expect(validateRequest(mockRequest, schema)).rejects.toThrow()
    })
  })

  describe('response helpers', () => {
    it('should create success response', () => {
      const response = apiResponse({ data: 'test' }, 201)
      expect(response.status).toBe(201)
    })

    it('should create error response', () => {
      const response = apiError('Something went wrong', 500)
      expect(response.status).toBe(500)
    })
  })
})