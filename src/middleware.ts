import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/admin/:path*',
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Exclude login page and API routes from protection to prevent loops
  if (path === '/admin/login' || path.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check for session cookie
  const adminSession = req.cookies.get('admin_session');

  if (!adminSession) {
    // Redirect to login if no session
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
} 