import { z } from 'zod';

export const rateClientSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type RateClientFormValues = z.infer<typeof rateClientSchema>;
