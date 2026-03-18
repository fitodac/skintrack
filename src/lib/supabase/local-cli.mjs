import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(moduleDir, '../../..');

export function getProjectRoot() {
  return projectRoot;
}

export function parseEnvFileContent(content) {
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
      const value = trimmed.slice(separatorIndex + 1).trim();

      if (key) {
        env[key] = value;
      }

      return env;
    }, {});
}

export function loadProjectEnv() {
  const env = {};
  const files = ['.env', '.env.local'];

  files.forEach((fileName) => {
    const filePath = resolve(projectRoot, fileName);

    if (!existsSync(filePath)) {
      return;
    }

    Object.assign(env, parseEnvFileContent(readFileSync(filePath, 'utf8')));
  });

  return env;
}

export function buildCliEnv(extraEnv = {}) {
  return {
    ...process.env,
    ...loadProjectEnv(),
    ...extraEnv,
  };
}

export function runCommand(
  command,
  args,
  {
    cwd = projectRoot,
    stdio = 'inherit',
    allowFailure = false,
    env = buildCliEnv(),
  } = {},
) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio,
    encoding: 'utf8',
  });

  if (result.error) {
    throw result.error;
  }

  if (!allowFailure && result.status !== 0) {
    throw new Error(
      [
        `Command failed: ${command} ${args.join(' ')}`,
        result.stderr?.trim(),
      ]
        .filter(Boolean)
        .join('\n'),
    );
  }

  return result;
}

export function runSupabaseCommand(args, options) {
  return runCommand('npx', ['supabase', ...args], options);
}

export function writeFileWithTrailingNewline(filePath, content) {
  const normalized = content.endsWith('\n') ? content : `${content}\n`;
  writeFileSync(filePath, normalized, 'utf8');
}
