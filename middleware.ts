import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'elmougi-wholesale-super-secret-key')

// Define which routes require authentication
const protectedRoutes = ['/profile', '/invoice']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path starts with any of our protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      // No token found, redirect to login
      const url = new URL('/login', request.url)
      // Optional: append the attempted URL so we can redirect back after login
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    try {
      // Verify the JWT token signature and expiration
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      // Token is invalid or expired, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('auth_token')
      return response
    }
  }

  // Prevent logged-in users from accessing login/signup pages
  if (pathname === '/login' || pathname === '/signup') {
    const token = request.cookies.get('auth_token')?.value
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET)
        // If token is valid, redirect them away from auth pages to their profile
        return NextResponse.redirect(new URL('/profile', request.url))
      } catch (error) {
        // Invalid token, just let them access the auth pages normally
      }
    }
  }

  return NextResponse.next()
}

// Only run middleware on pages, skip static files and API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)'],
}
