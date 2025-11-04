import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Supabase Middleware for Authentication
 * 
 * This middleware:
 * - Refreshes auth tokens automatically
 * - Protects routes that require authentication
 * - Handles session management across requests
 * 
 * Add this to your middleware.ts file in the root:
 * 
 * ```typescript
 * import { updateSession } from '@/lib/supabase/middleware';
 * 
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 * 
 * export const config = {
 *   matcher: [
 *     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
 *   ],
 * };
 * ```
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  // Do NOT return the supabase instance as it's not serializable
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect routes that require authentication
  // Add your protected routes here
  const protectedRoutes = ['/deck', '/collection'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    // Redirect to login if not authenticated
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

