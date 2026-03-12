export function normalizeSearchQuery(query: string | undefined) {
  return query?.trim().toLowerCase() ?? '';
}
