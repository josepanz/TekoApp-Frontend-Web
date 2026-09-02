'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useMyProfessionalProfileQuery } from '@/features/professional-profile/hooks';

// Se muestra solo si GET /professionals/me da 404 (todavía no es profesional) — mismo gate
// invertido que ProModeLink. Mismo patrón visual que "¿No tenés cuenta? Registrate" en el login:
// una oración de texto + link, no un banner que compita por atención con el resto del home.
export function RecruitProfessionalCta() {
  const t = useTranslations('professionalApplication.recruitCta');
  const { isPending, isError } = useMyProfessionalProfileQuery();

  if (isPending || !isError) return null;

  return (
    <p className="text-muted-foreground text-sm">
      {t('question')}{' '}
      <Link
        href="/postularme-como-profesional"
        className="text-primary underline"
      >
        {t('link')}
      </Link>
    </p>
  );
}
