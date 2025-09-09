import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/profile', '/edit', '/settings'];
const authPaths = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = protectedPaths.some((path) => 
    pathname === path || pathname.startsWith(path)
  );
  const isAuthPath = authPaths.some((path) => 
    pathname === path || pathname.startsWith(path)
  );

  // Если пользователь на главной странице и не авторизован - оставляем на главной
  if (pathname === '/' && !token) {
    return NextResponse.next();
  }

  // Если пользователь на главной странице и авторизован - редирект в профиль
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Если пытается попасть на защищенную страницу без авторизации
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Если авторизованный пользователь пытается попасть на страницы авторизации
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/edit/:path*',
    '/settings/:path*',
    '/auth/:path*',
  ],
};