import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedPaths = ['/browse', '/profiles', '/my-list', '/search'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isProtected) {
    // Check for auth token in localStorage isn't possible in middleware/proxy,
    // so we check for a cookie that the client sets alongside localStorage
    const token = request.cookies.get('netflix_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from login/signup
  const authPaths = ['/login', '/signup'];
  if (authPaths.includes(pathname)) {
    const token = request.cookies.get('netflix_token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/browse', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
};
