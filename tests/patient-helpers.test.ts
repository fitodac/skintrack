import { describe, expect, it } from 'vitest';
import { normalizeSearchQuery } from '@/modules/patients/helpers';

describe('normalizeSearchQuery', () => {
  it('trims and lowercases the input', () => {
    expect(normalizeSearchQuery('  ANA Pérez  ')).toBe('ana pérez');
  });

  it('returns an empty string when query is missing', () => {
    expect(normalizeSearchQuery(undefined)).toBe('');
  });
});
