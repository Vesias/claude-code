// Subscription and billing types

export interface Subscription {
  id: string
  workspaceId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  STARTER = 'STARTER',      // €29/month
  PROFESSIONAL = 'PROFESSIONAL', // €99/month
  ENTERPRISE = 'ENTERPRISE',   // €299/month
  CUSTOM = 'CUSTOM',          // Custom pricing
}

export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  UNPAID = 'UNPAID',
}

export interface PlanFeatures {
  plan: SubscriptionPlan
  price: number // in cents
  currency: 'EUR' | 'USD'
  features: {
    aiCallsPerMonth: number
    mcpTools: string[]
    teamMembers: number
    storageGB: number
    supportLevel: 'community' | 'email' | 'priority' | 'dedicated'
    customIntegrations: boolean
    apiAccess: boolean
    analytics: boolean
    whiteLabel: boolean
  }
}

export interface Usage {
  workspaceId: string
  period: {
    start: Date
    end: Date
  }
  metrics: {
    aiCalls: number
    storageGB: number
    activeUsers: number
    mcpExecutions: Record<string, number>
  }
  cost: {
    total: number
    breakdown: {
      aiCalls: number
      storage: number
      mcpTools: number
    }
  }
}