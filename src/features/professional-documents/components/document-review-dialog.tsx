'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { ExternalLinkIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/core/api-client/errors';
import type { AdminProfessionalDocument } from '../api';
import {
  usePresignedUrlQuery,
  useReviewProfessionalDocumentMutation,
} from '../hooks';
import {
  rejectDocumentSchema,
  type RejectDocumentFormValues,
} from '../schemas';

interface DocumentReviewDialogProps {
  document: AdminProfessionalDocument | null;
  onOpenChange: (open: boolean) => void;
}

// Contenido sensible (antecedentes, títulos) — la URL presignada solo se resuelve MIENTRAS el
// diálogo está abierto (`enabled: !!document`) y nunca se persiste más allá de esta sesión de
// componente, mismo criterio que avatarUrl en mobile/backend.
export function DocumentReviewDialog({
  document,
  onOpenChange,
}: DocumentReviewDialogProps) {
  const t = useTranslations('professionalDocuments.review');
  const tCommon = useTranslations('common');
  const [rejecting, setRejecting] = useState(false);
  const reviewMutation = useReviewProfessionalDocumentMutation();
  const { data: presignedUrl } = usePresignedUrlQuery(
    document?.fileKey ?? '',
    !!document,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectDocumentFormValues>({
    resolver: standardSchemaResolver(rejectDocumentSchema),
    defaultValues: { rejectionReason: '' },
  });

  function close() {
    setRejecting(false);
    reset();
    onOpenChange(false);
  }

  function approve() {
    if (!document) return;
    reviewMutation.mutate(
      { referenceId: document.referenceId, dto: { status: 'APPROVED' } },
      { onSuccess: close },
    );
  }

  function reject(values: RejectDocumentFormValues) {
    if (!document) return;
    reviewMutation.mutate(
      {
        referenceId: document.referenceId,
        dto: { status: 'REJECTED', rejectionReason: values.rejectionReason },
      },
      { onSuccess: close },
    );
  }

  const errorMessage =
    reviewMutation.error instanceof ApiError
      ? reviewMutation.error.message
      : reviewMutation.error
        ? 'Ocurrió un error inesperado. Intentá de nuevo.'
        : null;

  return (
    <Dialog open={!!document} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{document?.professionalDocumentType.name}</DialogTitle>
          <DialogDescription>
            {t('professionalLabel', {
              name: document
                ? `${document.professional.firstName} ${document.professional.lastName}`
                : '',
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {presignedUrl && (
            <Button
              variant="outline"
              size="sm"
              className="w-fit"
              nativeButton={false}
              render={
                <a
                  href={presignedUrl.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLinkIcon className="size-4" />
                  {t('viewFileButton')}
                </a>
              }
            />
          )}

          {document?.issuedAt && (
            <p className="text-muted-foreground text-sm">
              {t('issuedAt', { date: document.issuedAt })}
            </p>
          )}

          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}

          {rejecting && (
            <form
              onSubmit={(event) => void handleSubmit(reject)(event)}
              className="flex flex-col gap-2"
              noValidate
            >
              <Label htmlFor="rejectionReason">
                {t('rejectionReasonLabel')}
              </Label>
              <Textarea
                id="rejectionReason"
                aria-invalid={!!errors.rejectionReason}
                {...register('rejectionReason')}
              />
              {errors.rejectionReason && (
                <p className="text-destructive text-sm">
                  {errors.rejectionReason.message}
                </p>
              )}
            </form>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={close}>
            {tCommon('actions.cancel')}
          </Button>
          {rejecting ? (
            <Button
              type="button"
              variant="destructive"
              disabled={reviewMutation.isPending}
              onClick={() => void handleSubmit(reject)()}
            >
              {reviewMutation.isPending
                ? tCommon('states.saving')
                : t('confirmRejectButton')}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setRejecting(true)}
              >
                {t('rejectButton')}
              </Button>
              <Button
                type="button"
                disabled={reviewMutation.isPending}
                onClick={approve}
              >
                {reviewMutation.isPending
                  ? tCommon('states.saving')
                  : t('approveButton')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
