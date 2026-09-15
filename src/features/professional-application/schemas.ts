import { z } from 'zod';

export const professionalApplicationSchema = z.object({
  categoryId: z.number({ message: 'Elegí una categoría' }),
  description: z.string().min(1, 'La descripción es obligatoria'),
  hourlyRate: z.number().positive('La tarifa por hora debe ser mayor a 0'),
  fixedRate: z.number().positive().optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  skills: z.string().optional(),
});

export type ProfessionalApplicationFormValues = z.infer<
  typeof professionalApplicationSchema
>;
