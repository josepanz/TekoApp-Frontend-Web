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
import type { AdminPortfolioItem } from '../api';
import { usePresignedUrlQuery, useReviewPortfolioItemMutation } from '../hooks';
import {
  rejectPortfolioItemSchema,
  type RejectPortfolioItemFormValues,
} from '../schemas';

interface PortfolioReviewDialogProps {
  item: AdminPortfolioItem | null;
  onOpenChange: (open: boolean) => void;
}

export function PortfolioReviewDialog({
  item,
  onOpenChange,
}: PortfolioReviewDialogProps) {
  const t = useTranslations('professionalPortfolio.review');
  const tCommon = useTranslations('common');
  const [rejecting, setRejecting] = useState(false);
  const reviewMutation = useReviewPortfolioItemMutation();
  const { data: presignedUrl } = usePresignedUrlQuery(item?.fileKey ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectPortfolioItemFormValues>({
    resolver: standardSchemaResolver(rejectPortfolioItemSchema),
    defaultValues: { rejectionReason: '' },
  });

  function close() {
    setRejecting(false);
    reset();
    onOpenChange(false);
  }

  function approve() {
    if (!item) return;
    reviewMutation.mutate(
      { referenceId: item.referenceId, dto: { status: 'APPROVED' } },
      { onSuccess: close },
    );
  }

  function reject(values: RejectPortfolioItemFormValues) {
    if (!item) return;
    reviewMutation.mutate(
      {
        referenceId: item.referenceId,
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
    <Dialog open={!!item} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('professionalLabel', {
              name: item
                ? `${item.professional.firstName} ${item.professional.lastName}`
                : '',
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {presignedUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={presignedUrl.url}
              alt=""
              className="max-h-72 w-full rounded-md object-contain"
            />
          )}

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

          {item?.caption && <p className="text-sm">{item.caption}</p>}

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
