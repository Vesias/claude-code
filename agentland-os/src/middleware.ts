import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get token with proper secret configuration
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  const isAuth = !!token
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
                     request.nextUrl.pathname.startsWith("/register")

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    // Allow access to auth pages when not authenticated
    return NextResponse.next()
  }

  if (!isAuth) {
    let from = request.nextUrl.pathname
    if (request.nextUrl.search) {
      from += request.nextUrl.search
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    )
  }

  // Allow access to protected routes when authenticated
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/agents/:path*",
    "/workflows/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
}