import { z } from 'zod';

const nullableString = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .nullable()
  .optional();

export const sessionRouteParamsSchema = z.object({
  patientId: z.string().uuid(),
  sessionId: z.string().uuid(),
});

export const clinicalSessionFormSchema = z.object({
  id: z.string().uuid().optional(),
  patient_id: z.string().uuid(),
  date: z.string().min(1),
  consultation_reason: nullableString,
  closed_comedones: z.boolean().default(false),
  open_comedones: z.boolean().default(false),
  papules: z.boolean().default(false),
  pustules: z.boolean().default(false),
  nodules: z.boolean().default(false),
  tubercles: z.boolean().default(false),
  scars: z.boolean().default(false),
  excoriations: z.boolean().default(false),
  milium_cysts: z.boolean().default(false),
  sebaceous_cysts: z.boolean().default(false),
  macules: z.boolean().default(false),
  diagnosis: nullableString,
  goals: nullableString,
  cleaning: nullableString,
  return_to_eudermia: nullableString,
  exfoliation: nullableString,
  asepsis: nullableString,
  extractions: nullableString,
  pa: nullableString,
  massages: nullableString,
  mask: nullableString,
  final_product: nullableString,
  sunscreen: nullableString,
  applied_apparatus: nullableString,
  home_care_day: nullableString,
  home_care_night: nullableString,
  status: z.enum(['draft', 'completed']).default('draft'),
});

export type ClinicalSessionFormInput = z.infer<typeof clinicalSessionFormSchema>;
