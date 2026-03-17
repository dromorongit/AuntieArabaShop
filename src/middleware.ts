import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force Node.js runtime
export const runtime = 'nodejs';

// Routes that should remain accessible even when site is locked
const publicPaths = [
  '/admin',
  '/api/admin/auth',
  '/api/admin/site-settings',
  '/locked',
];

// Check if path is public
function isPublicPath(pathname: string): boolean {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return true;
  if (pathname === '/locked') return true;
  if (pathname.startsWith('/api/admin/auth')) return true;
  if (pathname.startsWith('/api/admin/site-settings')) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Fetch status from API
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/site-settings`, {
      method: 'GET',
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.settings?.siteLocked) {
        return NextResponse.redirect(new URL('/locked', request.url));
      }
    }
  } catch (error) {
    console.error('Middleware: Error checking lock status:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
