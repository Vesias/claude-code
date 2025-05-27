import { NextResponse, NextRequest } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { withErrorHandler, ApiError } from "@/lib/api/error-handler"
import { validateRequest, schemas, apiResponse, apiError } from "@/lib/api/validation"
import { withRateLimit } from "@/lib/api/rate-limit"

// Use centralized schema
const registerSchema = schemas.register

export const POST = withRateLimit(
  withErrorHandler(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Ein Benutzer mit dieser E-Mail-Adresse existiert bereits." },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      { message: "Benutzer erfolgreich erstellt", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    throw error; // Let error handler middleware handle it
  }
  }),
  'auth' // Use strict auth rate limit
)