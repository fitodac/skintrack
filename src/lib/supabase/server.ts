import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';
import { getPublicEnv, getServerSupabaseUrl } from '@/lib/env';

export async function createServerClient() {
  const cookieStore = await cookies();
  const env = getPublicEnv();
  const serverSupabaseUrl = getServerSupabaseUrl();

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
