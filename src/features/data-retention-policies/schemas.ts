import { z } from 'zod';

const optionalPositiveInt = z
  .union([z.number(), z.nan()])
  .optional()
  .transform((value) =>
    value === undefined || Number.isNaN(value) ? undefined : value,
  )
  .refine(
    (value) => value === undefined || (Number.isInteger(value) && value > 0),
    { message: 'Debe ser un número entero positivo' },
  );

export const retentionPolicyFormSchema = z.object({
  countryId: optionalPositiveInt,
  contentType: z.enum([
    'SERVICE_DESCRIPTION',
    'BUDGET_OPTION',
    'PROGRESS_NOTE',
    'PROFESSIONAL_DESCRIPTION',
    'IMAGE',
    'OTHER',
  ]),
  retentionDays: optionalPositiveInt,
  allowsUserDeletion: z.boolean(),
  requiresLegalHold: z.boolean(),
});

export type RetentionPolicyFormValues = z.infer<
  typeof retentionPolicyFormSchema
>;
