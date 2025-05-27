import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { cors, applyCorsHeaders } from "./lib/api/cors"

export async function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  const corsResponse = cors(request);
  if (corsResponse) return corsResponse;
  
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
      const response = NextResponse.redirect(new URL("/dashboard", request.url))
      return applyCorsHeaders(response, request)
    }
    // Allow access to auth pages when not authenticated
    const response = NextResponse.next()
    return applyCorsHeaders(response, request)
  }

  if (!isAuth) {
    let from = request.nextUrl.pathname
    if (request.nextUrl.search) {
      from += request.nextUrl.search
    }

    const response = NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url)
    )
    return applyCorsHeaders(response, request)
  }

  // Allow access to protected routes when authenticated
  const response = NextResponse.next()
  return applyCorsHeaders(response, request)
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/agents/:path*",
    "/workflows/:path*",
    "/settings/:path*",
    "/login",
    "/register",
    "/api/:path*", // Also handle API routes for CORS
  ],
}