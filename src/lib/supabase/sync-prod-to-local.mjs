import { existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  runCommand,
  runSupabaseCommand,
} from './local-cli.mjs';
import { parseStatusEnv } from './write-local-env.mjs';

export const AUTH_TABLES = ['auth.users', 'auth.identities'];

export function buildPublicTablesQuery() {
  return [
    'select table_name',
    'from information_schema.tables',
    "where table_schema = 'public'",
    "and table_type = 'BASE TABLE'",
    'order by table_name;',
  ].join(' ');
}

export function parsePublicTables(output) {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((tableName) => `public.${tableName}`);
}

export function createDumpTableNames(publicTables) {
  return [...new Set([...AUTH_TABLES, ...publicTables])];
}

export function buildDumpCommand({ productionDbUrl, dumpFilePath, tables }) {
  return {
    command: 'pg_dump',
    args: [
      '--data-only',
      '--no-owner',
      '--no-privileges',
      `--file=${dumpFilePath}`,
      ...tables.map((table) => `--table=${table}`),
      `--dbname=${productionDbUrl}`,
    ],
  };
}

export function buildRestoreCommand({ localDbUrl, dumpFilePath }) {
  return {
    command: 'psql',
    args: [
      '--single-transaction',
      '--set=ON_ERROR_STOP=1',
      `--file=${dumpFilePath}`,
      `--dbname=${localDbUrl}`,
    ],
  };
}

function ensureExecutable(command) {
  const result = runCommand('which', [command], {
    stdio: 'pipe',
    allowFailure: true,
  });

  if (result.status !== 0) {
    throw new Error(`Missing required executable: ${command}`);
  }
}

function ensureLocalSupabaseStatusEnv() {
  let statusResult = runSupabaseCommand(['status', '-o', 'env'], {
    stdio: 'pipe',
    allowFailure: true,
  });

  if (statusResult.status !== 0) {
    process.stdout.write('Starting local Supabase stack...\n');
    runSupabaseCommand(['start']);
    statusResult = runSupabaseCommand(['status', '-o', 'env'], {
      stdio: 'pipe',
    });
  }

  return parseStatusEnv(statusResult.stdout ?? '');
}

function listRemotePublicTables(productionDbUrl) {
  const result = runCommand(
    'psql',
    ['-X', '-A', '-t', '-d', productionDbUrl, '-c', buildPublicTablesQuery()],
    { stdio: 'pipe' },
  );

  const publicTables = parsePublicTables(result.stdout ?? '');

  if (publicTables.length === 0) {
    throw new Error('No public tables were found in the production database.');
  }

  return publicTables;
}

function run() {
  const productionDbUrl = process.env.SUPABASE_PRODUCTION_DB_URL;

  if (!productionDbUrl) {
    throw new Error('SUPABASE_PRODUCTION_DB_URL is required.');
  }

  ensureExecutable('pg_dump');
  ensureExecutable('psql');

  const localStatusEnv = ensureLocalSupabaseStatusEnv();
  const localDbUrl = localStatusEnv.DB_URL;

  if (!localDbUrl) {
    throw new Error('Supabase local status did not return DB_URL.');
  }

  process.stdout.write('Resetting local database from migrations...\n');
  runSupabaseCommand(['db', 'reset', '--yes']);

  const dumpFilePath = join(tmpdir(), `skintrack-prod-sync-${Date.now()}.sql`);

  try {
    const tables = createDumpTableNames(listRemotePublicTables(productionDbUrl));
    const dumpCommand = buildDumpCommand({
      productionDbUrl,
      dumpFilePath,
      tables,
    });

    process.stdout.write('Dumping production data...\n');
    runCommand(dumpCommand.command, dumpCommand.args);

    const restoreCommand = buildRestoreCommand({
      localDbUrl,
      dumpFilePath,
    });

    process.stdout.write('Restoring data into local Supabase...\n');
    runCommand(restoreCommand.command, restoreCommand.args);
  } finally {
    if (existsSync(dumpFilePath)) {
      rmSync(dumpFilePath);
    }
  }

  process.stdout.write('Finished syncing production data into local Supabase.\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
