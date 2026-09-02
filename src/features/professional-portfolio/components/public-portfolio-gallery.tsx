'use client';

import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import type { PortfolioItem } from '../api';
import { usePresignedUrlQuery, usePublicPortfolioQuery } from '../hooks';

// Galería visible para un cliente navegando el perfil público de un profesional — solo lo
// aprobado + visible ya llega filtrado por el backend (`GET .../portfolio/public`), acá no hay
// ningún filtro adicional que aplicar.
export function PublicPortfolioGallery({
  professionalReferenceId,
}: {
  professionalReferenceId: string;
}) {
  const t = useTranslations('professionalPortfolio.public');
  const { data, isPending, isError } = usePublicPortfolioQuery(
    professionalReferenceId,
  );

  if (isPending) {
    return <Skeleton className="h-32" />;
  }
  if (isError || data.data.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{t('title')}</h3>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {data.data.map((item) => (
          <PublicPortfolioPhoto key={item.referenceId} item={item} />
        ))}
      </div>
    </div>
  );
}

function PublicPortfolioPhoto({ item }: { item: PortfolioItem }) {
  const { data: presignedUrl, isPending } = usePresignedUrlQuery(item.fileKey);

  if (isPending || !presignedUrl) {
    return <Skeleton className="aspect-square rounded-md" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={presignedUrl.url}
      alt={item.caption ?? ''}
      className="aspect-square rounded-md object-cover"
    />
  );
}
