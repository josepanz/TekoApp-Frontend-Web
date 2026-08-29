'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { BrandGradientBackground } from '@/components/layout/brand-gradient-background';
import { Button } from '@/components/ui/button';

/**
 * Boundary de error de la raíz — captura, entre otros casos, `SessionUnavailableError` lanzado
 * por `getSession()` (ver core/auth/session.ts) cuando el backend no responde o responde con un
 * error que no es 401. Sin este boundary, Next.js muestra su página de error genérica sin estilo.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('pages.error');
  const tCommon = useTranslations('common');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <BrandGradientBackground className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center text-white">
      <h1 className="font-heading text-2xl font-semibold">{t('title')}</h1>
      <p className="max-w-md text-sm text-white/80">{t('description')}</p>
      <Button onClick={() => reset()}>{tCommon('actions.retry')}</Button>
    </BrandGradientBackground>
  );
}
