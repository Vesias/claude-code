import { UserRole } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role?: UserRole
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role?: UserRole
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name?: string | null
    picture?: string | null
    role?: UserRole
  }
}