import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { getServerEnv, getServerSupabaseUrl } from '@/lib/env';

export function createAdminClient() {
  const env = getServerEnv();
  const serverSupabaseUrl = getServerSupabaseUrl();

  return createClient<Database>(
    serverSupabaseUrl,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
