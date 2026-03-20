import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { getPublicEnv, getServerSupabaseUrl } from '@/lib/env';

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

export async function createServerClient() {
  const cookieStore = await cookies();
  const env = getPublicEnv();
  const serverSupabaseUrl = await resolveSupabaseServerUrl();

  return createClient<Database>(
    serverSupabaseUrl,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always write cookies.
          }
        },
      },
    },
  );
}
