import { z } from 'zod';

// Mismo patrón que categories/schemas.ts para los campos numéricos opcionales: el input vacío da
// NaN (nunca undefined, particularidad de `input.valueAsNumber`), así que se acepta `z.nan()` en
// la unión para poder normalizarlo a `undefined` después vía `.transform()`.
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

export const professionalDocumentTypeFormSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  category: z.enum(['BACKGROUND_CHECK', 'QUALIFICATION', 'PORTFOLIO']),
  professionalCategoryId: optionalPositiveInt,
  isRequired: z.boolean(),
  validityDays: optionalPositiveInt,
  requiresStaffReview: z.boolean(),
  isVisibleToClient: z.boolean(),
  sortOrder: z.number().int().min(0),
});

export type ProfessionalDocumentTypeFormValues = z.infer<
  typeof professionalDocumentTypeFormSchema
>;
