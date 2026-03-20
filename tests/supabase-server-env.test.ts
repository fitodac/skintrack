import { afterEach, describe, expect, it } from 'vitest';
import { getServerSupabaseUrl } from '@/lib/env';

const originalEnv = { ...process.env };

describe('getServerSupabaseUrl', () => {
  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('prefers SUPABASE_SERVER_URL when it exists', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54321';
    process.env.SUPABASE_SERVER_URL = 'http://host.docker.internal:54321';

    expect(getServerSupabaseUrl()).toBe('http://host.docker.internal:54321');
  });

  it('falls back to NEXT_PUBLIC_SUPABASE_URL when the server-only url is missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54321';
    delete process.env.SUPABASE_SERVER_URL;

    expect(getServerSupabaseUrl()).toBe('http://127.0.0.1:54321');
  });
});
