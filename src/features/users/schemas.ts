import { z } from 'zod';

export const userEditFormSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio').max(100),
  lastName: z.string().min(1, 'El apellido es obligatorio').max(100),
  phoneNumber: z.string().max(20).optional().or(z.literal('')),
});

export type UserEditFormValues = z.infer<typeof userEditFormSchema>;
