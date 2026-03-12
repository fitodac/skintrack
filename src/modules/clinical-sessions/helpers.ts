import type { ClinicalSessionFormInput } from '@/modules/clinical-sessions/schemas';

export function hasClinicalSessionContent(input: ClinicalSessionFormInput) {
  return Object.entries(input).some(([key, value]) => {
    if (key === 'patient_id' || key === 'date' || key === 'status' || key === 'id') {
      return false;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    return Boolean(value);
  });
}
