import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname

  // If it's an API request, add CORS headers
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next()

    // Add the CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
