import { describe, expect, it } from 'vitest';
import { patientFormSchema } from '@/modules/patients/schemas';

describe('patientFormSchema', () => {
  it('accepts a valid patient payload', () => {
    const result = patientFormSchema.safeParse({
      name: 'Ana Pérez',
      email: 'ana@example.com',
      thyroid: false,
      weight_loss: false,
      hypertrichosis: false,
      hirsutism: false,
      obesity: false,
      pregnancy: false,
      alcohol: false,
      drugs: false,
      smoke: false,
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid emails', () => {
    const result = patientFormSchema.safeParse({
      name: 'Ana Pérez',
      email: 'no-es-email',
      thyroid: false,
      weight_loss: false,
      hypertrichosis: false,
      hirsutism: false,
      obesity: false,
      pregnancy: false,
      alcohol: false,
      drugs: false,
      smoke: false,
    });

    expect(result.success).toBe(false);
  });
});
