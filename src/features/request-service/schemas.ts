import { z } from 'zod';

export const requestServiceSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  categoryId: z.number({ message: 'Elegí una categoría' }),
  serviceTypeId: z.number({ message: 'Elegí un tipo de servicio' }),
  address: z.string().min(1, 'La dirección es obligatoria'),
  latitude: z.number(),
  longitude: z.number(),
  isUrgent: z.boolean(),
});

export type RequestServiceFormValues = z.infer<typeof requestServiceSchema>;
