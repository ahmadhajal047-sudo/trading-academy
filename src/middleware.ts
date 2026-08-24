import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // الصفحات التي لا تحتاج حماية
  const publicPaths = ['/', '/login'];
  const pathname = request.nextUrl.pathname;

  // اذا كانت الصفحة عامة، خليها تمر
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // للصفحات المحمية، تحقق من الـ cookie
  const token = request.cookies.get('sb-access-token');

  // اذا ما فيه token، وجه لـ login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/courses/:path*', '/journal/:path*', '/ai-analyzer/:path*'],
};