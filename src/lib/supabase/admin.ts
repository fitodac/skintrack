import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { getServerEnv } from '@/lib/env';

export function createAdminClient() {
  const env = getServerEnv();

  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
