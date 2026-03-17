import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

// In-memory cache for site lock status (refreshed every request)
let cachedLockStatus: boolean | null = null;
let lastCheckTime = 0;
const CACHE_TTL = 5000; // 5 seconds

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

  // Check cached status first
  const now = Date.now();
  if (cachedLockStatus !== null && (now - lastCheckTime) < CACHE_TTL) {
    if (cachedLockStatus) {
      return NextResponse.redirect(new URL('/locked', request.url));
    }
    return NextResponse.next();
  }

  // Fetch fresh status from database
  try {
    const { getDatabase } = await import('@/lib/mongodb');
    const db = await getDatabase();
    const settingsCollection = db.collection('siteSettings');
    const settings = await settingsCollection.findOne({});
    
    if (settings) {
      // Check countdown
      if (settings.siteLocked && settings.enableCountdown && settings.countdownDateTime) {
        const countdownEnd = new Date(settings.countdownDateTime).getTime();
        if (now >= countdownEnd) {
          // Auto-unlock
          await settingsCollection.updateOne({}, { $set: { siteLocked: false } });
          cachedLockStatus = false;
        } else {
          cachedLockStatus = settings.siteLocked;
        }
      } else {
        cachedLockStatus = settings.siteLocked;
      }
    } else {
      cachedLockStatus = false;
    }
    
    lastCheckTime = now;
  } catch (error) {
    console.error('Middleware: Error checking lock status:', error);
    cachedLockStatus = false;
  }

  if (cachedLockStatus) {
    return NextResponse.redirect(new URL('/locked', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
