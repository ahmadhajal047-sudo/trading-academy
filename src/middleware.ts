import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // تمبيسط الـ Middleware مؤقتاً لتسهيل حركة الدخول والتنقل بين الصفحات
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};