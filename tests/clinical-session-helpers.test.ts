import { describe, expect, it } from 'vitest';
import { hasClinicalSessionContent } from '@/modules/clinical-sessions/helpers';

describe('hasClinicalSessionContent', () => {
  it('returns false for an untouched draft', () => {
    expect(
      hasClinicalSessionContent({
        patient_id: crypto.randomUUID(),
        date: '2026-03-12',
        status: 'draft',
        consultation_reason: '',
        closed_comedones: false,
        open_comedones: false,
        papules: false,
        pustules: false,
        nodules: false,
        tubercles: false,
        scars: false,
        excoriations: false,
        milium_cysts: false,
        sebaceous_cysts: false,
        macules: false,
        diagnosis: '',
        goals: '',
        cleaning: '',
        return_to_eudermia: '',
        exfoliation: '',
        asepsis: '',
        extractions: '',
        pa: '',
        massages: '',
        mask: '',
        final_product: '',
        sunscreen: '',
        applied_apparatus: '',
        home_care_day: '',
        home_care_night: '',
      }),
    ).toBe(false);
  });

  it('returns true when a relevant field has content', () => {
    expect(
      hasClinicalSessionContent({
        patient_id: crypto.randomUUID(),
        date: '2026-03-12',
        status: 'draft',
        consultation_reason: 'Acné inflamatorio',
        closed_comedones: false,
        open_comedones: false,
        papules: false,
        pustules: false,
        nodules: false,
        tubercles: false,
        scars: false,
        excoriations: false,
        milium_cysts: false,
        sebaceous_cysts: false,
        macules: false,
        diagnosis: '',
        goals: '',
        cleaning: '',
        return_to_eudermia: '',
        exfoliation: '',
        asepsis: '',
        extractions: '',
        pa: '',
        massages: '',
        mask: '',
        final_product: '',
        sunscreen: '',
        applied_apparatus: '',
        home_care_day: '',
        home_care_night: '',
      }),
    ).toBe(true);
  });
});
