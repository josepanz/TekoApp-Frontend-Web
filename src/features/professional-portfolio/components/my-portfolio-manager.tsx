'use client';

import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import type { PortfolioItem, PortfolioReviewStatus } from '../api';
import {
  useDeletePortfolioItemMutation,
  useMyPortfolioQuery,
  usePresignedUrlQuery,
  useUpdatePortfolioItemMutation,
  useUploadPortfolioItemMutation,
} from '../hooks';

const STATUS_VARIANT: Record<
  PortfolioReviewStatus,
  'default' | 'secondary' | 'destructive'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
};

// Galería propia del profesional — subir/listar/editar caption/visibilidad/borrar. Espejo del
// patrón de `professional-documents` (hidden input `sr-only` + botón visible, ver `avatar-upload.tsx`)
// pero para el modelo de portafolio nuevo (TekoApp-Backend Fase 4, `professional-portfolio`).
export function MyPortfolioManager() {
  const t = useTranslations('professionalPortfolio');
  const { data, isPending, isError } = useMyPortfolioQuery();
  const uploadMutation = useUploadPortfolioItemMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    uploadMutation.mutate({ file });
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-4" aria-hidden="true" />
          )}
          {t('uploadButton')}
        </Button>
        <input
          ref={inputRef}
          type="file"
          aria-label={t('uploadButton')}
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      {isPending && <Skeleton className="h-48" />}
      {isError && <p className="text-muted-foreground">{t('loadError')}</p>}
      {!isPending && !isError && data.data.length === 0 && (
        <p className="text-muted-foreground text-sm">{t('empty')}</p>
      )}
      {!isPending && !isError && data.data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((item) => (
            <PortfolioItemCard key={item.referenceId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function PortfolioItemCard({ item }: { item: PortfolioItem }) {
  const t = useTranslations('professionalPortfolio');
  const { data: presignedUrl } = usePresignedUrlQuery(item.fileKey);
  const updateMutation = useUpdatePortfolioItemMutation();
  const deleteMutation = useDeletePortfolioItemMutation();
  const [caption, setCaption] = useState(item.caption ?? '');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  function saveCaption() {
    if (caption === (item.caption ?? '')) return;
    updateMutation.mutate({
      referenceId: item.referenceId,
      dto: { caption },
    });
  }

  return (
    <div className="border-border flex flex-col gap-3 rounded-lg border p-3">
      <div className="bg-muted aspect-square overflow-hidden rounded-md">
        {presignedUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={presignedUrl.url}
            alt={item.caption ?? ''}
            className="h-full w-full object-cover"
          />
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </div>

      <Badge variant={STATUS_VARIANT[item.status]} className="w-fit">
        {t(`statusOptions.${item.status}`)}
      </Badge>

      {item.status === 'REJECTED' && item.rejectionReason && (
        <p className="text-destructive text-sm">
          {t('rejectionReason', { reason: item.rejectionReason })}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <Label htmlFor={`caption-${item.referenceId}`} className="sr-only">
          {t('captionLabel')}
        </Label>
        <Input
          id={`caption-${item.referenceId}`}
          value={caption}
          placeholder={t('captionPlaceholder')}
          onChange={(event) => setCaption(event.target.value)}
          onBlur={saveCaption}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            id={`visible-${item.referenceId}`}
            checked={item.isVisible}
            onCheckedChange={(checked) =>
              updateMutation.mutate({
                referenceId: item.referenceId,
                dto: { isVisible: checked },
              })
            }
          />
          <Label htmlFor={`visible-${item.referenceId}`} className="text-sm">
            {t('visibleLabel')}
          </Label>
        </div>

        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={t('deleteButton')}
          onClick={() => setConfirmingDelete(true)}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <AlertDialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('deleteCancelButton')}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleteMutation.mutate(item.referenceId, {
                  onSuccess: () => setConfirmingDelete(false),
                })
              }
            >
              {t('deleteConfirmButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
