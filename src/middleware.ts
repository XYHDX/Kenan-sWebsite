import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/admin/:path*',
}

export function middleware(req: NextRequest) {
  console.log('--- Middleware triggered for:', req.nextUrl.pathname); // DEBUG

  const basicAuth = req.headers.get('authorization')
  const url = req.nextUrl

  console.log('Authorization header:', basicAuth); // DEBUG

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    // Decode base64 credentials
    // Added Buffer check for environments where it might not be globally available
    const [user, pwd] = typeof Buffer !== 'undefined' 
      ? Buffer.from(authValue, 'base64').toString().split(':')
      : atob(authValue).split(':') // Fallback for environments like Cloudflare Workers Edge

    console.log('Decoded credentials:', { user, pwd }); // DEBUG

    const expectedUser = process.env.BASIC_AUTH_USER
    const expectedPassword = process.env.BASIC_AUTH_PASSWORD

    console.log('Expected credentials from env:', { expectedUser, expectedPassword }); // DEBUG

    // Check for environment variables first
    if (!expectedUser || !expectedPassword) {
       console.error('Basic Auth environment variables not set.')
       // Return a generic error or allow access if you prefer during development
       // For production, you should definitely return an error or deny access.
       // Returning 500 Internal Server Error for security reasons.
       return new NextResponse('Internal Server Error: Auth configuration missing', { status: 500 })
    }

    // Validate credentials
    if (user === expectedUser && pwd === expectedPassword) {
      console.log('--- Authentication successful ---'); // DEBUG
      return NextResponse.next()
    } else {
      console.log('--- Authentication failed: Credentials mismatch ---'); // DEBUG
    }
  } else {
    console.log('--- No basic auth header found, requesting auth ---'); // DEBUG
  }

  // Request Basic Authentication
  url.pathname = '/api/auth_error' // Redirect to an error route or return directly
  // Returning a 401 response directly to prompt for credentials
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
} 