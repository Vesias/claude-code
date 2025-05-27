import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authConfig: NextAuthConfig = {
  // adapter: PrismaAdapter(prisma), // Not compatible with JWT strategy
  secret: process.env["NEXTAUTH_SECRET"]!,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials)

        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.password) {
          return null
        }

        const passwordsMatch = await compare(password, user.password)

        if (!passwordsMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token["id"] = user.id
        token["email"] = user.email
        token["name"] = user.name
        token["picture"] = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token["id"] as string
        session.user.email = token["email"] as string
        session.user.name = (token["name"] as string | null) ?? null
        session.user.image = (token["picture"] as string | null) ?? null
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}