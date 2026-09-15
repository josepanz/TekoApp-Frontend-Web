import { z } from 'zod';

export const requestServiceSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  categoryId: z.number({ message: 'Elegí una categoría' }),
  serviceTypeId: z.number({ message: 'Elegí un tipo de servicio' }),
  address: z.string().min(1, 'La dirección es obligatoria'),
  latitude: z
    .number({ message: 'La latitud es obligatoria' })
    .min(-90, 'La latitud debe estar entre -90 y 90')
    .max(90, 'La latitud debe estar entre -90 y 90'),
  longitude: z
    .number({ message: 'La longitud es obligatoria' })
    .min(-180, 'La longitud debe estar entre -180 y 180')
    .max(180, 'La longitud debe estar entre -180 y 180'),
  isUrgent: z.boolean(),
});

export type RequestServiceFormValues = z.infer<typeof requestServiceSchema>;
