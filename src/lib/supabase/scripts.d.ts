declare module '@/lib/supabase/write-local-env.mjs' {
  export function parseStatusEnv(content: string): Record<string, string>;
  export function buildSupabaseServerUrl(apiUrl: string): string;
  export function buildNextLocalEnv(
    statusEnv: Record<string, string>,
    options?: { appUrl?: string },
  ): Record<string, string>;
  export function mergeEnvFileContent(
    existingContent: string,
    updates: Record<string, string>,
  ): string;
}

declare module '@/lib/supabase/sync-prod-to-local.mjs' {
  export const AUTH_TABLES: string[];
  export function buildPublicTablesQuery(): string;
  export function parsePublicTables(output: string): string[];
  export function createDumpTableNames(publicTables: string[]): string[];
  export function getProductionDbUrl(
    processEnv?: Record<string, string | undefined>,
    projectEnv?: Record<string, string | undefined>,
  ): string | undefined;
  export function getProductionDbUrlValidationError(
    productionDbUrl: string,
  ): string | undefined;
  export function buildDumpCommand(input: {
    productionDbUrl: string;
    dumpFilePath: string;
    tables: string[];
  }): { command: string; args: string[] };
  export function buildRestoreCommand(input: {
    localDbUrl: string;
    dumpFilePath: string;
  }): { command: string; args: string[] };
}
