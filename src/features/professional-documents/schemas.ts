import { z } from 'zod';

export const rejectDocumentSchema = z.object({
  rejectionReason: z.string().min(1, 'El motivo de rechazo es obligatorio'),
});

export type RejectDocumentFormValues = z.infer<typeof rejectDocumentSchema>;
