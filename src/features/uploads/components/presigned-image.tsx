'use client';

import { ImageOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { usePresignedFileQuery } from '../hooks';

interface PresignedImageProps {
  /** Key de S3 del archivo (nunca una URL). */
  fileKey: string;
  alt: string;
  className?: string;
}

// Imagen servida por URL presignada. Si el presigned responde 403/404 (sin permiso o sin registro)
// o el archivo no carga, muestra un placeholder accesible en lugar de un <img> roto (DEF-WEB-008).
export function PresignedImage({
  fileKey,
  alt,
  className,
}: PresignedImageProps) {
  const t = useTranslations('uploads');
  const { data, isPending, isError } = usePresignedFileQuery(fileKey);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (isPending) {
    return <Skeleton className={className} />;
  }

  if (isError || !data || failedUrl === data.url) {
    return (
      <div
        role="img"
        aria-label={t('imageUnavailable')}
        data-testid="image-placeholder"
        className={cn(
          'bg-muted text-muted-foreground flex flex-col items-center justify-center gap-1 text-xs',
          className,
        )}
      >
        <ImageOff className="size-5" aria-hidden="true" />
        <span aria-hidden="true">{t('imageUnavailable')}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={data.url}
      alt={alt}
      className={className}
      onError={() => setFailedUrl(data.url)}
    />
  );
}
