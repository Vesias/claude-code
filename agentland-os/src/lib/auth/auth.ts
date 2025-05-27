import NextAuth from "next-auth"
import { authConfig } from "./config"

export const { auth, signIn, signOut } = NextAuth(authConfig)

// Type augmentation for TypeScript
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }
}