import { z } from 'zod';

export const updateOwnProfileSchema = z.object({
  username: z.string().min(3).max(32),
  name: z.string().min(2).max(80),
  lastname: z.string().min(2).max(80),
  professional_title: z.string().max(120).nullable().optional(),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});
