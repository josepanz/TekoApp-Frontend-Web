import { z } from 'zod';

export const rejectPortfolioItemSchema = z.object({
  rejectionReason: z.string().min(1, 'El motivo de rechazo es obligatorio'),
});

export type RejectPortfolioItemFormValues = z.infer<
  typeof rejectPortfolioItemSchema
>;
