import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  buildNextLocalEnv,
  buildSupabaseServerUrl,
  mergeEnvFileContent,
  parseStatusEnv,
} from '@/lib/supabase/write-local-env.mjs';
import {
  AUTH_TABLES,
  buildDumpCommand,
  buildPublicTablesQuery,
  buildRestoreCommand,
  createDumpTableNames,
  getProductionDbUrl,
  getProductionDbUrlValidationError,
  parsePublicTables,
} from '@/lib/supabase/sync-prod-to-local.mjs';

describe('package scripts', () => {
  it('exposes a single local setup command for the recommended local flow', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'),
    ) as { scripts: Record<string, string> };

    expect(packageJson.scripts['local:setup']).toBe(
      'npm run db:start && npm run db:env:local && npm run db:types',
    );
    expect(packageJson.scripts['local:up']).toBe(
      'npm run local:setup && docker compose -f compose.local.yml up -d --build app',
    );
    expect(packageJson.scripts['local:down']).toBe(
      'docker compose -f compose.local.yml down && npm run db:stop',
    );
  });
});

describe('local Supabase auth config', () => {
  it('keeps project-wide signup disabled while allowing email/password auth for invited users', () => {
    const configToml = readFileSync(
      resolve(process.cwd(), 'supabase/config.toml'),
      'utf8',
    );

    expect(configToml).toContain('enable_signup = false');
    expect(configToml).toContain('[auth.email]');
    expect(configToml).toContain('enable_signup = true');
  });
});

describe('RLS helper functions', () => {
  it('use security definer to avoid recursive policy evaluation', () => {
    const migration = readFileSync(
      resolve(process.cwd(), 'supabase/migrations/20260312180000_init_skintrack.sql'),
      'utf8',
    );

    expect(migration).toContain('create or replace function public.is_superadmin()');
    expect(migration).toContain('create or replace function public.can_manage_profile(profile_uuid uuid)');
    expect(migration).toContain('create or replace function public.can_access_patient(patient_uuid uuid)');
    expect(migration).toContain('create or replace function public.can_access_session(session_uuid uuid)');
    expect(migration.match(/security definer/g)?.length ?? 0).toBeGreaterThanOrEqual(5);
  });
});

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

  it('strips wrapping quotes from Supabase status env output', () => {
    const parsed = parseStatusEnv(`
API_URL="http://127.0.0.1:54321"
ANON_KEY="local-anon"
SERVICE_ROLE_KEY="local-service"
DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
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
      SUPABASE_SERVER_URL: 'http://host.docker.internal:54321',
    });
  });
});

describe('buildSupabaseServerUrl', () => {
  it('rewrites localhost APIs so the app container can reach Supabase on the host', () => {
    expect(buildSupabaseServerUrl('http://127.0.0.1:54321')).toBe(
      'http://host.docker.internal:54321',
    );
    expect(buildSupabaseServerUrl('http://localhost:54321')).toBe(
      'http://host.docker.internal:54321',
    );
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
      SUPABASE_SERVER_URL: 'http://host.docker.internal:54321',
    });

    expect(merged).toContain('NEXT_PUBLIC_APP_URL=http://localhost:3000');
    expect(merged).toContain('NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321');
    expect(merged).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY=local-anon');
    expect(merged).toContain('SUPABASE_SERVICE_ROLE_KEY=local-service');
    expect(merged).toContain('SUPABASE_SERVER_URL=http://host.docker.internal:54321');
    expect(merged).toContain('CUSTOM_VAR=keep-me');
    expect(merged.trim().endsWith('SUPABASE_SERVER_URL=http://host.docker.internal:54321')).toBe(
      true,
    );
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

describe('getProductionDbUrl', () => {
  it('prefers process.env and falls back to project env files', () => {
    expect(
      getProductionDbUrl(
        { SUPABASE_PRODUCTION_DB_URL: 'postgresql://from-process-env' },
        { SUPABASE_PRODUCTION_DB_URL: 'postgresql://from-project-env' },
      ),
    ).toBe('postgresql://from-process-env');

    expect(
      getProductionDbUrl(
        {},
        { SUPABASE_PRODUCTION_DB_URL: 'postgresql://from-project-env' },
      ),
    ).toBe('postgresql://from-project-env');
  });
});

describe('getProductionDbUrlValidationError', () => {
  it('rejects direct Supabase hosts when they use a pooler-style username', () => {
    expect(
      getProductionDbUrlValidationError(
        'postgresql://postgres.project-ref:secret@db.project-ref.supabase.co:5432/postgres',
      ),
    ).toContain('direct connection');
  });

  it('accepts a valid direct Supabase connection string', () => {
    expect(
      getProductionDbUrlValidationError(
        'postgresql://postgres:secret@db.project-ref.supabase.co:5432/postgres',
      ),
    ).toBeUndefined();
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
