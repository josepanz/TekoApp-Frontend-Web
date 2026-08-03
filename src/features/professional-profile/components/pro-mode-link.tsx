'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useMyProfessionalProfileQuery } from '../hooks';

// Se muestra solo si GET /professionals/me resuelve con datos (el usuario tiene perfil
// profesional) — no hay claim en el JWT para esto, ver decisión de IA del plan.
export function ProModeLink() {
  const t = useTranslations('professionalProfile');
  const { data, isSuccess } = useMyProfessionalProfileQuery();

  if (!isSuccess || !data) return null;

  return (
    <Link
      href="/pro"
      className="border-input hover:bg-accent rounded-md border px-4 py-2 text-sm font-medium transition-colors"
    >
      {t('proModeLink')}
    </Link>
  );
}
