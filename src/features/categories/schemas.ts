import { z } from 'zod';

const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

// Cubre solo los campos de CreateCategoryDto/UpdateCategoryDto (ver types.generated.ts) que
// realmente se exponen como input en el diálogo. `sortOrder`/`status`/`requiresVerification` no
// están acá a propósito: no tienen un control en el form (fuera del alcance pedido), y si se
// agregan al schema sin un `register`/`Controller` que los toque, react-hook-form no los rastrea
// de forma confiable como "campo" — el resolver los ve como `undefined` al validar y el submit
// falla en silencio. Esos tres viajan directo desde la categoría original en
// `category-form-dialog.tsx` (buildPayload), fuera de react-hook-form/zod.
export const categoryFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z
    .string()
    .optional()
    .refine((value) => !value || HEX_COLOR_REGEX.test(value), {
      message: 'El color debe ser un hexadecimal válido (ej. #2ecc71)',
    }),
  isVisible: z.boolean(),
  // Se registra en el form con `valueAsNumber: true` — cuando el input queda vacío, el DOM
  // devuelve `NaN` (nunca `undefined`, eso es una particularidad de `input.valueAsNumber`), y
  // `z.number()` normal RECHAZA NaN con su propio mensaje de error ("expected number, received
  // NaN") antes de que `.optional()`/`.transform()` lleguen a ejecutarse — por eso hay que
  // aceptar explícitamente `z.nan()` en la unión para que el pipeline pueda normalizarlo a
  // `undefined` después. No usa z.coerce/z.preprocess (que forzarían el tipo de entrada del
  // resolver a `unknown` y romperían la inferencia de tipos de `standardSchemaResolver`).
  parentCategoryId: z
    .union([z.number(), z.nan()])
    .optional()
    .transform((value) =>
      value === undefined || Number.isNaN(value) ? undefined : value,
    )
    .refine(
      (value) => value === undefined || (Number.isInteger(value) && value > 0),
      { message: 'Debe ser un número entero positivo' },
    ),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
