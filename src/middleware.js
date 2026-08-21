import { NextResponse } from 'next/server';

export function middleware(request) {
  const hasAuth = request.cookies.has('tot_auth');

  if (hasAuth && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
