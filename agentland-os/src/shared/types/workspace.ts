// Workspace-related types

export interface Workspace {
  id: string
  name: string
  ownerId: string
  businessProfile?: BusinessProfile
  settings: WorkspaceSettings
  createdAt: Date
  updatedAt: Date
}

export interface BusinessProfile {
  companyName: string
  taxId: string // German tax ID format: DE + 9 digits
  industry: string
  size: CompanySize
  address?: {
    street: string
    city: string
    zipCode: string
    country: string
  }
  contactPerson?: {
    name: string
    email: string
    phone: string
  }
}

export enum CompanySize {
  MICRO = 'micro', // < 10 employees
  SMALL = 'small', // 10-49 employees
  MEDIUM = 'medium', // 50-249 employees
}

export interface WorkspaceSettings {
  language: 'de' | 'en'
  timezone: string
  currency: 'EUR' | 'USD'
  features: {
    aiTools: boolean
    mcpTools: boolean
    analytics: boolean
    collaboration: boolean
  }
  limits: {
    monthlyAiCalls: number
    storageGB: number
    teamMembers: number
  }
}