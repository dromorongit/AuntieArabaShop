import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that should remain accessible even when site is locked
const publicRoutes = [
  '/admin',
  '/api/admin/auth',
  '/api/admin/site-settings',
  '/locked',
];

// Check if a path matches any of the public routes
function isPublicRoute(pathname: string): boolean {
  // Check exact matches and prefixes
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return true;
  }
  if (pathname === '/locked') {
    return true;
  }
  if (pathname.startsWith('/api/admin/auth')) {
    return true;
  }
  if (pathname.startsWith('/api/admin/site-settings')) {
    return true;
  }
  return false;
}

// Check site lock status by calling the API
async function getSiteLockStatus(baseUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/api/admin/site-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-middleware-bypass': 'true', // Mark as internal request
      },
      cache: 'no-store',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.settings?.siteLocked === true;
    }
  } catch (error) {
    console.error('Error checking site lock status:', error);
  }
  
  // Default to unlocked if there's an error
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Allow public routes (admin, locked page, etc.)
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get the base URL
  const baseUrl = request.nextUrl.origin;

  // Check if site is locked
  const isLocked = await getSiteLockStatus(baseUrl);

  if (isLocked) {
    // Redirect to locked page
    const lockedUrl = new URL('/locked', baseUrl);
    return NextResponse.redirect(lockedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
