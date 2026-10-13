import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Pantalla de "sin acceso" (403): se muestra en lugar de redirigir o romper cuando el usuario
 * esta autenticado pero no tiene permisos para la seccion. `embedded` la dibuja dentro de un shell
 * que ya tiene `<main>` (secciones del backoffice) para no duplicar el landmark.
 */
export function AccessDenied({ embedded = false }: { embedded?: boolean }) {
  const t = useTranslations('pages.accessDenied');
  const Container = embedded ? 'div' : 'main';
  return (
    <Container
      data-testid="access-denied"
      className="flex min-h-[60vh] flex-1 flex-col items-center justify-center gap-4 p-6 text-center"
    >
      <ShieldAlert className="text-muted-foreground size-10" aria-hidden />
      <h1 className="font-heading text-2xl font-semibold">{t('title')}</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        {t('description')}
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
      >
        {t('backHome')}
      </Link>
    </Container>
  );
}
