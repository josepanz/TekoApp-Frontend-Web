import { z } from 'zod';

const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

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

export const legalDocumentVersionFormSchema = z.object({
  documentType: z.enum([
    'TERMS_OF_SERVICE',
    'PRIVACY_POLICY',
    'DATA_PROCESSING_CONSENT',
    'IMAGE_USAGE_CONSENT',
    'SERVICE_CONTRACT_TERMS',
    'USER_CONTENT_LIABILITY_DISCLAIMER',
  ]),
  countryId: optionalPositiveInt,
  version: z
    .string()
    .min(1, 'La versión es obligatoria')
    .refine((value) => SEMVER_REGEX.test(value), {
      message: 'Formato esperado: 1.0.0',
    }),
  contentUrl: z
    .string()
    .min(1, 'La URL es obligatoria')
    .url('Debe ser una URL válida'),
  publishedAt: z.string().min(1, 'La fecha de publicación es obligatoria'),
  isActive: z.boolean(),
});

export type LegalDocumentVersionFormValues = z.infer<
  typeof legalDocumentVersionFormSchema
>;
