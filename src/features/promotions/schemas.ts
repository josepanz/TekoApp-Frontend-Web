import { z } from 'zod';

export const PROMOTION_TYPES = [
  'PERCENTAGE',
  'FIXED_AMOUNT',
  'FREE_SERVICE',
] as const;

// Los campos numéricos opcionales vienen de un <input type="number"> — react-hook-form entrega
// '' cuando el campo está vacío, así que se normaliza a `undefined` antes de validar con zod
// (si no, z.coerce.number() convertiría '' en 0).
function optionalNonNegativeNumber(message: string) {
  return z.preprocess(
    (value) =>
      value === '' || value === undefined || value === null ? undefined : value,
    z.coerce.number().nonnegative(message).optional(),
  );
}

function optionalPositiveInt(message: string) {
  return z.preprocess(
    (value) =>
      value === '' || value === undefined || value === null ? undefined : value,
    z.coerce.number().int(message).positive(message).optional(),
  );
}

export const promotionFormSchema = z
  .object({
    code: z
      .string()
      .min(1, 'El código es obligatorio')
      .max(50, 'El código es demasiado largo'),
    name: z.string().min(1, 'El nombre es obligatorio'),
    description: z.string().optional(),
    type: z.enum(PROMOTION_TYPES, 'Seleccioná un tipo de descuento'),
    discountValue: z.coerce
      .number('El valor del descuento es obligatorio')
      .positive('El valor del descuento debe ser mayor a 0'),
    minimumAmount: optionalNonNegativeNumber(
      'El monto mínimo debe ser mayor o igual a 0',
    ),
    maximumDiscount: optionalNonNegativeNumber(
      'El descuento máximo debe ser mayor o igual a 0',
    ),
    maxUsage: optionalPositiveInt(
      'La cantidad máxima de usos debe ser un entero positivo',
    ),
    maxUsagePerUser: optionalPositiveInt(
      'La cantidad máxima de usos por usuario debe ser un entero positivo',
    ),
    // Fechas en formato de <input type="date"> (YYYY-MM-DD) — se convierten a ISO 8601 completo
    // recién al armar el DTO para el backend (ver `toCreatePromotionRequest` en el diálogo).
    validFrom: z.string().min(1, 'La fecha de inicio es obligatoria'),
    validUntil: z.string().min(1, 'La fecha de fin es obligatoria'),
    isFirstTimeOnly: z.boolean(),
    isProfessionalOnly: z.boolean(),
    isClientOnly: z.boolean(),
  })
  .refine((data) => new Date(data.validUntil) >= new Date(data.validFrom), {
    message: 'La fecha de fin debe ser posterior o igual a la fecha de inicio',
    path: ['validUntil'],
  });

// `discountValue`/`minimumAmount`/etc. usan z.coerce/z.preprocess (el valor "crudo" del input es
// un string, o '' si está vacío) — eso hace que el tipo de entrada del schema difiera del tipo de
// salida (ya coercionado a number). `useForm` soporta esta separación con un tercer type param
// (`TTransformedValues`, ver react-hook-form/dist/useForm.d.ts) — `PromotionFormInput` es lo que
// maneja `register`/`errors` (antes de validar), `PromotionFormValues` es lo que recibe el
// `onSubmit` (después de validar/coercionar). Sin esta separación, `standardSchemaResolver` no es
// asignable a `Resolver<PromotionFormValues>` en `useForm<PromotionFormValues>` (mismatch
// input/output detectado por tsc).
export type PromotionFormInput = z.input<typeof promotionFormSchema>;
export type PromotionFormValues = z.infer<typeof promotionFormSchema>;
