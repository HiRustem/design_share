import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/profile', '/edit', '/settings'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(path));

  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url), 307);
  }

  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/profile', request.url), 307);
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url), 307);
  }

  if (pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/profile', request.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/profile',
    '/profile/:path*',
    '/edit',
    '/edit/:path*',
    '/settings',
    '/settings/:path*',
    '/auth/:path*',
  ],
};
