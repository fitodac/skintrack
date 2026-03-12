import { z } from 'zod';

export const signInWithPasswordSchema = z.object({
  email: z.string().email('Ingresá un email válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  next: z.string().optional(),
});

export const inviteUserSchema = z.object({
  email: z.string().email('Ingresá un email válido.'),
  invited_name: z.string().min(2, 'El nombre es obligatorio.'),
  invited_lastname: z.string().min(2, 'El apellido es obligatorio.'),
  professional_title: z.string().max(100).nullable().optional(),
  role: z.enum(['superadmin', 'admin']),
});
