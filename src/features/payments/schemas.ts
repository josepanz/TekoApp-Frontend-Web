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
