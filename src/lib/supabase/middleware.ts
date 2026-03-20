import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import { getServerSupabaseUrl, hasSupabaseEnv } from '@/lib/env';

const AUTH_PATHS = ['/login', '/auth/callback'];

let cachedResolvedUrl: string | null = null;

async function resolveSupabaseServerUrl(): Promise<string> {
  if (cachedResolvedUrl) return cachedResolvedUrl;

  const primary = getServerSupabaseUrl();
  const fallback = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const candidates = Array.from(
    new Set([fallback, primary].filter((value): value is string => Boolean(value))),
  );

  for (const baseUrl of candidates) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 400);

      const res = await fetch(new URL('/auth/v1/health', baseUrl), {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        cachedResolvedUrl = baseUrl;
        return baseUrl;
      }
    } catch {
      // ignore
    }
  }

  return primary;
}

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseEnv()) {
    return NextResponse.next({
      request,
    });
  }

  let response = NextResponse.next({
    request,
  });
  const serverSupabaseUrl = await resolveSupabaseServerUrl();

  const supabase = createServerClient<Database>(
    serverSupabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  let user: { id: string } | null = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user ?? null;
  } catch {
    return response;
  }

  if (!user && !AUTH_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && AUTH_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))) {
    const url = request.nextUrl.clone();
    url.pathname = '/patients';
    url.searchParams.delete('next');
    return NextResponse.redirect(url);
  }

  return response;
}
