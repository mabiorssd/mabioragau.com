import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const response = NextResponse.next();

  // Add security headers
  const headers = response.headers;
  
  // Prevent clickjacking attacks
  headers.set('X-Frame-Options', 'DENY');
  
  // Enable Cross-Site Scripting (XSS) protection
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Control browser features
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: blob: https:; " +
    "font-src 'self'; " +
    "connect-src 'self' https://*.supabase.co; " +
    "frame-ancestors 'none';"
  );

  // HSTS (Strict Transport Security)
  headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );

  return response;
}

export const config = {
  matcher: '/:path*',
};