import { z } from 'zod';

// Contrato del backend: `notes` es opcional al verificar y OBLIGATORIA (con trim) al rechazar.
export const verifyProfessionalSchema = z
  .object({
    isVerified: z.boolean(),
    notes: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (!values.isVerified && !values.notes?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['notes'],
        message: 'La nota es obligatoria al rechazar',
      });
    }
  });

export type VerifyProfessionalFormValues = z.infer<
  typeof verifyProfessionalSchema
>;

export const suspendProfessionalSchema = z.object({
  reason: z.string().trim().min(1, 'El motivo es obligatorio'),
});

export type SuspendProfessionalFormValues = z.infer<
  typeof suspendProfessionalSchema
>;

export const reactivateProfessionalSchema = z.object({
  reason: z.string().trim().min(1, 'El motivo es obligatorio'),
});

export type ReactivateProfessionalFormValues = z.infer<
  typeof reactivateProfessionalSchema
>;
