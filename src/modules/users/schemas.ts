import { z } from 'zod';

export const updateUserBySuperadminSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(32),
  name: z.string().min(2).max(80),
  lastname: z.string().min(2).max(80),
  professional_title: z.string().max(120).nullable().optional(),
  role: z.enum(['superadmin', 'admin']),
  is_active: z.boolean(),
});
