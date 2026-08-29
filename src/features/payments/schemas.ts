import { z } from 'zod';

// Espeja los campos obligatorios de RefundPaymentDto (types.generated.ts): amount y reason son
// requeridos por el backend, description es opcional.
export const refundPaymentSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a cero'),
  reason: z.enum([
    'customer_request',
    'duplicate_payment',
    'fraud',
    'service_not_provided',
    'poor_service_quality',
    'technical_issue',
    'other',
  ]),
  description: z.string().optional(),
});

export type RefundPaymentFormValues = z.infer<typeof refundPaymentSchema>;

// Espeja CreateTipRequestDTO (TekoApp-Backend): mode=PERCENTAGE exige percentage (1-100),
// mode=FREE exige amount (>=0.01) — mismo ValidateIf condicional del backend, replicado acá para
// dar feedback antes de pegarle a la API. `FIXED` no tiene UI todavía (sin config de montos
// preestablecidos, ver decisions.md de Mobile), no se ofrece como opción en el dialog.
export const createTipSchema = z
  .object({
    mode: z.enum(['PERCENTAGE', 'FREE']),
    percentage: z.number().min(1).max(100).optional(),
    amount: z.number().min(0.01).optional(),
  })
  .refine(
    (value) =>
      value.mode === 'PERCENTAGE'
        ? value.percentage !== undefined
        : value.amount !== undefined,
    { message: 'Elegí un porcentaje o ingresá un monto', path: ['amount'] },
  );

export type CreateTipFormValues = z.infer<typeof createTipSchema>;
