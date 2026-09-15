'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyDocumentsQuery, useUploadMyDocumentMutation } from '../hooks';
import type { DocumentReviewStatus } from '../api';

const STATUS_VARIANT: Record<
  DocumentReviewStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
  EXPIRED: 'outline',
};

// Subida de documentos de compliance por el propio profesional — hasta ahora este repo solo tenía
// la cola de revisión de staff (`review-queue-table.tsx`). Reusa `GET /professionals/me/documents`,
// que ya devuelve cada tipo de documento aplicable a la categoría del profesional junto con su
// documento más reciente (si existe) — no hace falta pedir el catálogo completo por separado.
export function MyDocumentsUpload() {
  const t = useTranslations('professionalDocuments');
  const { data: documents, isPending, isError } = useMyDocumentsQuery();
  const uploadMutation = useUploadMyDocumentMutation();
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  if (isPending) {
    return <Skeleton className="h-64 max-w-xl" />;
  }

  if (isError || !documents) {
    return (
      <p className="text-muted-foreground">{t('myDocuments.loadError')}</p>
    );
  }

  function handleFileChange(typeReferenceId: string, file: File | undefined) {
    if (!file) return;
    setUploadingType(typeReferenceId);
    uploadMutation.mutate(
      { file, professionalDocumentTypeReferenceId: typeReferenceId },
      { onSettled: () => setUploadingType(null) },
    );
  }

  return (
    <div className="flex max-w-xl flex-col gap-4">
      {documents.map(({ documentType, document }) => (
        <div
          key={documentType.referenceId}
          className="border-border flex flex-col gap-2 rounded-lg border p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{documentType.name}</span>
            <Badge variant={documentType.isRequired ? 'default' : 'secondary'}>
              {documentType.isRequired
                ? t('myDocuments.required')
                : t('myDocuments.optional')}
            </Badge>
            {document && (
              <Badge variant={STATUS_VARIANT[document.status]}>
                {t(`statusOptions.${document.status}`)}
              </Badge>
            )}
          </div>

          {documentType.description && (
            <p className="text-muted-foreground text-sm">
              {documentType.description}
            </p>
          )}

          {document?.status === 'REJECTED' && document.rejectionReason && (
            <p className="text-destructive text-sm">
              {t('myDocuments.rejectionReason', {
                reason: document.rejectionReason,
              })}
            </p>
          )}

          <div>
            <input
              ref={(el) => {
                inputRefs.current[documentType.referenceId] = el;
              }}
              type="file"
              className="sr-only"
              aria-label={t('myDocuments.fileInputLabel', {
                name: documentType.name,
              })}
              onChange={(event) => {
                handleFileChange(
                  documentType.referenceId,
                  event.target.files?.[0],
                );
                event.target.value = '';
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingType === documentType.referenceId}
              onClick={() =>
                inputRefs.current[documentType.referenceId]?.click()
              }
            >
              {uploadingType === documentType.referenceId
                ? t('myDocuments.uploading')
                : document
                  ? t('myDocuments.replace')
                  : t('myDocuments.upload')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
