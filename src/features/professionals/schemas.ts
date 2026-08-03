import { z } from 'zod';

export const verifyProfessionalSchema = z.object({
  isVerified: z.boolean(),
  notes: z.string().optional(),
});

export type VerifyProfessionalFormValues = z.infer<
  typeof verifyProfessionalSchema
>;

export const suspendProfessionalSchema = z.object({
  reason: z.string().min(1, 'El motivo es obligatorio'),
});

export type SuspendProfessionalFormValues = z.infer<
  typeof suspendProfessionalSchema
>;
