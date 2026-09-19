import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set('Cache-Control', 'private, no-store');

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === '/login';
  const isLandingPage = pathname === '/';

  // Check custom session cookie first (for resilience & offline/local demo mode)
  const localSession = request.cookies.get('sigma_session')?.value;

  // Check Supabase Auth if credentials exist
  let hasSupabaseUser = false;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    try {
      const client = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (values) => {
              values.forEach(({ name, value }) => request.cookies.set(name, value));
              response = NextResponse.next({ request });
              values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
              response.headers.set('Cache-Control', 'private, no-store');
            }
          }
        }
      );
      const { data: { user } } = await client.auth.getUser();
      if (user) hasSupabaseUser = true;
    } catch {
      hasSupabaseUser = false;
    }
  }

  const isAuthenticated = Boolean(hasSupabaseUser || localSession);

  // If user is authenticated and visits /login, redirect to /dashboard
  if (isAuthenticated && isLoginPage) {
    const redirect = NextResponse.redirect(new URL('/dashboard', request.url));
    return redirect;
  }

  // Public pages: Landing page (/) and Login (/login)
  const isPublicRoute = isLandingPage || isLoginPage;

  // If user is not authenticated and attempts to access protected internal routes, redirect to /login
  if (!isAuthenticated && !isPublicRoute) {
    const redirect = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    redirect.headers.set('Cache-Control', 'private, no-store');
    return redirect;
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)']
};
