import { resolve } from 'node:path';
import { runSupabaseCommand, writeFileWithTrailingNewline, getProjectRoot } from './local-cli.mjs';

function runStart() {
  runSupabaseCommand(['start']);
}

function runStop() {
  runSupabaseCommand(['stop']);
}

function runStatus() {
  runSupabaseCommand(['status']);
}

function runReset() {
  runSupabaseCommand(['db', 'reset', '--yes']);
}

function runTypes() {
  const result = runSupabaseCommand(
    ['gen', 'types', 'typescript', '--local', '--schema', 'public'],
    { stdio: 'pipe' },
  );

  const outputPath = resolve(getProjectRoot(), 'src/types/supabase.ts');
  writeFileWithTrailingNewline(outputPath, result.stdout ?? '');
  process.stdout.write(`Updated ${outputPath}\n`);
}

const command = process.argv[2];

switch (command) {
  case 'start':
    runStart();
    break;
  case 'stop':
    runStop();
    break;
  case 'status':
    runStatus();
    break;
  case 'reset':
    runReset();
    break;
  case 'types':
    runTypes();
    break;
  default:
    process.stderr.write(
      'Usage: node src/lib/supabase/run-local-cli.mjs <start|stop|status|reset|types>\n',
    );
    process.exit(1);
}
