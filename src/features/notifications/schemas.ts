import { z } from 'zod';

// Mismos 8 valores que el enum `type` de CreateNotificationRequestDTO/NotificationResponseDTO en
// types.generated.ts.
export const NOTIFICATION_TYPE_OPTIONS = [
  'service_request',
  'service_accepted',
  'service_rejected',
  'service_completed',
  'payment_received',
  'rating_received',
  'promotion',
  'system',
] as const;

// El campo `channels` del DTO es `string[]` libre (no un enum tipado en el Swagger), pero el
// backend documenta estos 3 valores como los canales soportados (ver @example en
// CreateNotificationRequestDTO) — se restringe acá para el formulario sin inventar campos nuevos.
export const NOTIFICATION_CHANNEL_OPTIONS = [
  'in_app',
  'push',
  'fcm',
  'email',
] as const;

export const newNotificationSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  message: z.string().min(1, 'El mensaje es obligatorio'),
  type: z.enum(NOTIFICATION_TYPE_OPTIONS),
  channels: z
    .array(z.enum(NOTIFICATION_CHANNEL_OPTIONS))
    .min(1, 'Seleccioná al menos un canal'),
});

export type NewNotificationFormValues = z.infer<typeof newNotificationSchema>;
