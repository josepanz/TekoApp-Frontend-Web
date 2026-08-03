import { z } from 'zod';

export const professionalProfileFormSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  hourlyRate: z.number().positive('La tarifa por hora debe ser mayor a 0'),
  fixedRate: z.number().positive().optional(),
  yearsOfExperience: z.number().int().min(0),
  skills: z.string(),
});

export type ProfessionalProfileFormValues = z.infer<
  typeof professionalProfileFormSchema
>;
