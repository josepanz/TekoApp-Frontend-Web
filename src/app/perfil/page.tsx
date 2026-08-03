import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getSession } from '@/core/auth/session';
import { ProfileForm } from '@/features/my-profile/components/profile-form';

export const metadata: Metadata = {
  title: 'Mi perfil — TekoApp',
};

// Página standalone, fuera de los 3 shells de sidebar (admin/client/pro) — se accede desde el
// mismo item del menú de usuario sin importar el modo activo, así que no tiene sentido anclarla a
// uno solo. `proxy.ts` ya la protege igual que cualquier otra ruta fuera de PUBLIC_PATHS.
export default async function PerfilPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const t = await getTranslations('myProfile');

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col gap-6 p-6">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('back')}
      </Link>
      <div>
        <h1 className="font-heading text-2xl font-semibold">{t('title')}</h1>
        <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
      </div>
      <ProfileForm session={session} />
    </div>
  );
}
