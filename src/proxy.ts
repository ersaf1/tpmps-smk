import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const legacyRoutes = ['/evaluasi', '/rtl', '/mutu', '/laporan', '/dokumen'];

function applySecurityHeaders(response: NextResponse) {
  const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
    : '';
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self' ${supabaseOrigin}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '));
  return response;
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let authenticated = false;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && key) {
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    });
    const { data } = await supabase.auth.getUser();
    authenticated = Boolean(data.user);
  }

  const pathname = request.nextUrl.pathname;
  if (legacyRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return applySecurityHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
  }
  if (!authenticated && pathname !== '/login') {
    return applySecurityHeaders(NextResponse.redirect(new URL('/login', request.url)));
  }
  if (authenticated && pathname === '/login') {
    return applySecurityHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
  }
  return applySecurityHeaders(response);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)']
};
