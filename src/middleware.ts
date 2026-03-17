import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that should remain accessible even when site is locked
const publicRoutes = [
  '/admin',
  '/admin/login',
  '/admin/',
  '/api/admin/auth',
  '/api/admin/site-settings',
  '/locked',
];

// Check if a path matches any of the public routes
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('/')) {
      return pathname.startsWith(route);
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
}

// Check site lock status directly from database
async function getSiteLockStatus(): Promise<boolean> {
  try {
    // Dynamic import to avoid issues
    const { getDatabase } = await import('@/lib/mongodb');
    const db = await getDatabase();
    const settingsCollection = db.collection('siteSettings');
    const settings = await settingsCollection.findOne({});
    
    if (!settings) return false;
    
    // Check if countdown has expired and auto-unlock
    if (settings.siteLocked && settings.enableCountdown && settings.countdownDateTime) {
      const countdownEnd = new Date(settings.countdownDateTime).getTime();
      const now = Date.now();
      
      if (now >= countdownEnd) {
        // Auto-unlock when countdown reaches zero
        await settingsCollection.updateOne({}, { $set: { siteLocked: false } });
        return false;
      }
    }
    
    return settings.siteLocked === true;
  } catch (error) {
    console.error('Error checking site lock status:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API health checks and static files
  if (
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Allow public routes (admin, locked page, etc.)
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check if site is locked
  const isLocked = await getSiteLockStatus();

  if (isLocked) {
    // Redirect to locked page
    const lockedUrl = new URL('/locked', request.url);
    return NextResponse.redirect(lockedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
