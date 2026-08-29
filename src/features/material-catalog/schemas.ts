import { z } from 'zod';

export const materialCatalogItemFormSchema = z.object({
  categoryId: z.number().int().positive('Elegí una categoría'),
  countryId: z
    .union([z.number(), z.nan()])
    .optional()
    .transform((value) =>
      value === undefined || Number.isNaN(value) ? undefined : value,
    )
    .refine(
      (value) => value === undefined || (Number.isInteger(value) && value > 0),
      { message: 'Debe ser un número entero positivo' },
    ),
  name: z.string().min(1, 'El nombre es obligatorio'),
  unit: z.string().min(1, 'La unidad es obligatoria'),
  qualityTier: z.enum(['BASIC', 'STANDARD', 'PREMIUM']),
  defaultPrice: z.number().min(0, 'El precio no puede ser negativo'),
  isActive: z.boolean(),
});

export type MaterialCatalogItemFormValues = z.infer<
  typeof materialCatalogItemFormSchema
>;
