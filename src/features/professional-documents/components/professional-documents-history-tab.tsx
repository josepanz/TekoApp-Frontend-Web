'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppLocale } from '@/i18n/use-app-locale';
import { formatDate } from '@/lib/formatters';
import type { DocumentReviewStatus, ProfessionalDocument } from '../api';
import { useProfessionalDocumentsHistoryQuery } from '../hooks';

const STATUS_VARIANT: Record<
  DocumentReviewStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  PENDING: 'secondary',
  APPROVED: 'default',
  REJECTED: 'destructive',
  EXPIRED: 'outline',
};

// Historial COMPLETO (todos los estados, no solo lo aprobado) — a diferencia del endpoint público
// que consume mobile, esto es para que staff resuelva disputas viendo también lo rechazado/vencido.
export function ProfessionalDocumentsHistoryTab({
  professionalReferenceId,
}: {
  professionalReferenceId: string;
}) {
  const t = useTranslations('professionalDocuments.history');
  const tCategory = useTranslations('professionalDocuments');
  const locale = useAppLocale();
  const { data, isPending, isError } = useProfessionalDocumentsHistoryQuery(
    professionalReferenceId,
  );

  if (isPending) {
    return <Skeleton className="h-48" />;
  }

  if (isError) {
    return <p className="text-muted-foreground">{t('loadError')}</p>;
  }

  if (data.data.length === 0) {
    return <p className="text-muted-foreground">{t('empty')}</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {data.data.map((document: ProfessionalDocument) => (
        <li
          key={document.referenceId}
          className="border-border flex items-center justify-between gap-4 rounded-lg border p-3"
        >
          <div className="flex flex-col">
            <span className="font-medium">
              {document.professionalDocumentType.name}
            </span>
            <span className="text-muted-foreground text-xs">
              {tCategory(
                `categoryOptions.${document.professionalDocumentType.category}`,
              )}
              {' · '}
              {formatDate(document.createdAt, locale)}
            </span>
            {document.status === 'REJECTED' && document.rejectionReason && (
              <span className="text-destructive text-xs">
                {t('rejectionReason', { reason: document.rejectionReason })}
              </span>
            )}
          </div>
          <Badge variant={STATUS_VARIANT[document.status]}>
            {tCategory(`statusOptions.${document.status}`)}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
