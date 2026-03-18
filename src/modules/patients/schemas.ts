import { z } from 'zod';

const nullableString = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .nullable()
  .optional();

const nullableDateString = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .nullable()
  .optional();

const nullableNumber = z
  .union([z.number(), z.nan(), z.null(), z.undefined()])
  .transform((value) => (typeof value === 'number' && Number.isFinite(value) ? value : null));

const nullableBoolean = z.boolean().nullable().optional();

export const patientIdSchema = z.object({
  patientId: z.string().uuid(),
});

export const patientFormSchema = z.object({
  id: z.string().uuid().optional(),
  admin_user_id: z.string().uuid().nullable().optional(),
  name: z.string().min(2, 'El nombre del paciente es obligatorio.'),
  email: z.string().email('Ingresá un email válido.'),
  born_date: nullableDateString,
  nationality: nullableString,
  marital_status: nullableString,
  number_of_children: nullableNumber,
  street: nullableString,
  street_number: nullableString,
  location: nullableString,
  phone: nullableString,
  instagram_account: nullableString,
  healthcare_plan: nullableString,
  healthcare_plan_number: nullableString,
  person_for_contact: nullableString,
  occupation: nullableString,
  working_hours: nullableString,
  first_consultation_date: nullableDateString,
  hereditary_history: nullableString,
  allergic_history: nullableString,
  organic_history: nullableString,
  thyroid: z.boolean().default(false),
  weight_loss: z.boolean().default(false),
  hypertrichosis: z.boolean().default(false),
  hirsutism: z.boolean().default(false),
  obesity: z.boolean().default(false),
  gastrointestinal_history: nullableBoolean,
  pregnancy: z.boolean().default(false),
  medication: nullableString,
  alcohol: z.boolean().default(false),
  drugs: z.boolean().default(false),
  smoke: z.boolean().default(false),
  other_medical_history: nullableString,
  cosmetics_used: nullableString,
  previous_and_current_treatments: nullableString,
  current_home_treatment: nullableString,
  diet: nullableString,
  modifications_or_suggestions: nullableString,
});

export type PatientFormInput = z.infer<typeof patientFormSchema>;
