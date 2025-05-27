// User-related types

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  ENTERPRISE = 'ENTERPRISE',
}

export interface Session {
  user: User
  expires: string
}

export interface AuthCredentials {
  email: string
  password: string
  name?: string
}