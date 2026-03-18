import { describe, expect, it } from 'vitest';
import {
  buildNextLocalEnv,
  mergeEnvFileContent,
  parseStatusEnv,
} from '@/lib/supabase/write-local-env.mjs';
import {
  AUTH_TABLES,
  buildDumpCommand,
  buildPublicTablesQuery,
  buildRestoreCommand,
  createDumpTableNames,
  parsePublicTables,
} from '@/lib/supabase/sync-prod-to-local.mjs';

describe('parseStatusEnv', () => {
  it('parses Supabase status env output', () => {
    const parsed = parseStatusEnv(`
API_URL=http://127.0.0.1:54321
ANON_KEY=local-anon
SERVICE_ROLE_KEY=local-service
DB_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
`);

    expect(parsed).toEqual({
      API_URL: 'http://127.0.0.1:54321',
      ANON_KEY: 'local-anon',
      SERVICE_ROLE_KEY: 'local-service',
      DB_URL: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
    });
  });
});

describe('buildNextLocalEnv', () => {
  it('maps local Supabase credentials to the app env keys', () => {
    expect(
      buildNextLocalEnv({
        API_URL: 'http://127.0.0.1:54321',
        ANON_KEY: 'local-anon',
        SERVICE_ROLE_KEY: 'local-service',
      }),
    ).toEqual({
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'local-anon',
      SUPABASE_SERVICE_ROLE_KEY: 'local-service',
    });
  });
});

describe('mergeEnvFileContent', () => {
  it('upserts the local Supabase keys and preserves unrelated variables', () => {
    const existing = [
      'NEXT_PUBLIC_APP_URL=http://localhost:9999',
      'CUSTOM_VAR=keep-me',
      'NEXT_PUBLIC_SUPABASE_URL=https://remote-project.supabase.co',
      '',
    ].join('\n');

    const merged = mergeEnvFileContent(existing, {
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:54321',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'local-anon',
      SUPABASE_SERVICE_ROLE_KEY: 'local-service',
    });

    expect(merged).toContain('NEXT_PUBLIC_APP_URL=http://localhost:3000');
    expect(merged).toContain('NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321');
    expect(merged).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY=local-anon');
    expect(merged).toContain('SUPABASE_SERVICE_ROLE_KEY=local-service');
    expect(merged).toContain('CUSTOM_VAR=keep-me');
    expect(merged.trim().endsWith('SUPABASE_SERVICE_ROLE_KEY=local-service')).toBe(true);
  });
});

describe('parsePublicTables', () => {
  it('returns fully qualified public tables from psql output', () => {
    const parsed = parsePublicTables(`
profiles
patients
clinical_sessions

`);

    expect(parsed).toEqual([
      'public.profiles',
      'public.patients',
      'public.clinical_sessions',
    ]);
  });
});

describe('createDumpTableNames', () => {
  it('includes auth tables and the discovered public tables', () => {
    expect(
      createDumpTableNames(['public.profiles', 'public.patients']),
    ).toEqual([
      ...AUTH_TABLES,
      'public.profiles',
      'public.patients',
    ]);
  });
});

describe('buildPublicTablesQuery', () => {
  it('queries only base tables from the public schema', () => {
    expect(buildPublicTablesQuery()).toContain("table_schema = 'public'");
    expect(buildPublicTablesQuery()).toContain("table_type = 'BASE TABLE'");
    expect(buildPublicTablesQuery()).toContain('order by table_name');
  });
});

describe('buildDumpCommand', () => {
  it('builds a data-only dump command for auth and public tables', () => {
    const command = buildDumpCommand({
      productionDbUrl: 'postgresql://remote',
      dumpFilePath: '/tmp/skintrack.sql',
      tables: ['auth.users', 'auth.identities', 'public.profiles'],
    });

    expect(command.command).toBe('pg_dump');
    expect(command.args).toContain('--data-only');
    expect(command.args).toContain('--no-owner');
    expect(command.args).toContain('--file=/tmp/skintrack.sql');
    expect(command.args).toContain('--dbname=postgresql://remote');
    expect(command.args).toContain('--table=auth.users');
    expect(command.args).toContain('--table=auth.identities');
    expect(command.args).toContain('--table=public.profiles');
  });
});

describe('buildRestoreCommand', () => {
  it('builds a transactional restore command against the local database', () => {
    const command = buildRestoreCommand({
      localDbUrl: 'postgresql://local',
      dumpFilePath: '/tmp/skintrack.sql',
    });

    expect(command.command).toBe('psql');
    expect(command.args).toContain('--single-transaction');
    expect(command.args).toContain('--set=ON_ERROR_STOP=1');
    expect(command.args).toContain('--file=/tmp/skintrack.sql');
    expect(command.args).toContain('--dbname=postgresql://local');
  });
});
