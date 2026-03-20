import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  getProjectRoot,
  normalizeEnvValue,
  runSupabaseCommand,
  writeFileWithTrailingNewline,
} from './local-cli.mjs';

const DEFAULT_APP_URL = 'http://localhost:3000';

export function buildSupabaseServerUrl(apiUrl) {
  return apiUrl
    .replace('://127.0.0.1', '://host.docker.internal')
    .replace('://localhost', '://host.docker.internal');
}

export function parseStatusEnv(content) {
  return content
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        return env;
      }

      const separatorIndex = trimmed.indexOf('=');

      if (separatorIndex === -1) {
        return env;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = normalizeEnvValue(trimmed.slice(separatorIndex + 1).trim());

      if (key) {
        env[key] = value;
      }

      return env;
    }, {});
}

export function buildNextLocalEnv(statusEnv, { appUrl = DEFAULT_APP_URL } = {}) {
  const apiUrl = statusEnv.API_URL;
  const anonKey = statusEnv.ANON_KEY;
  const serviceRoleKey = statusEnv.SERVICE_ROLE_KEY;

  if (!apiUrl || !anonKey || !serviceRoleKey) {
    throw new Error('Supabase status did not return API_URL, ANON_KEY, and SERVICE_ROLE_KEY.');
  }

  return {
    NEXT_PUBLIC_APP_URL: appUrl,
    NEXT_PUBLIC_SUPABASE_URL: apiUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
    SUPABASE_SERVER_URL: buildSupabaseServerUrl(apiUrl),
  };
}

export function mergeEnvFileContent(existingContent, updates) {
  const lines = existingContent ? existingContent.split(/\r?\n/) : [];
  const remaining = new Map(Object.entries(updates));
  const merged = lines.map((line) => {
    const separatorIndex = line.indexOf('=');

    if (separatorIndex === -1) {
      return line;
    }

    const key = line.slice(0, separatorIndex).trim();

    if (!remaining.has(key)) {
      return line;
    }

    const nextLine = `${key}=${remaining.get(key)}`;
    remaining.delete(key);
    return nextLine;
  });

  if (merged.length > 0 && merged[merged.length - 1] !== '') {
    merged.push('');
  }

  remaining.forEach((value, key) => {
    merged.push(`${key}=${value}`);
  });

  return `${merged.join('\n').replace(/\n+$/, '')}\n`;
}

function run() {
  const projectRoot = getProjectRoot();
  const envFilePath = resolve(projectRoot, '.env.local');
  const existingContent = existsSync(envFilePath) ? readFileSync(envFilePath, 'utf8') : '';
  const currentAppUrlMatch = existingContent.match(/^NEXT_PUBLIC_APP_URL=(.+)$/m);
  const appUrl = currentAppUrlMatch?.[1]?.trim() || DEFAULT_APP_URL;

  const statusResult = runSupabaseCommand(['status', '-o', 'env'], {
    stdio: 'pipe',
  });
  const statusEnv = parseStatusEnv(statusResult.stdout ?? '');
  const updates = buildNextLocalEnv(statusEnv, { appUrl });
  const mergedContent = mergeEnvFileContent(existingContent, updates);

  writeFileWithTrailingNewline(envFilePath, mergedContent);
  process.stdout.write(`Updated ${envFilePath} with local Supabase credentials.\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
