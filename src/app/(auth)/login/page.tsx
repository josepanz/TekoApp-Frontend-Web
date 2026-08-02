import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { LoginForm } from '@/features/auth/components/login-form';

export default async function LoginPage() {
  const t = await getTranslations('auth.login');

  return (
    <div className="bg-background text-foreground relative flex min-h-svh flex-col items-center justify-center gap-8 p-6">
      {/* El Topbar (que normalmente contiene el selector) solo existe en las áreas autenticadas —
          acá se expone suelto para poder elegir idioma antes de iniciar sesión. */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {t('pageTitle')}
        </h1>
        <p className="text-muted-foreground">{t('pageSubtitle')}</p>
      </div>
      {/* useSearchParams() en LoginForm exige un límite de Suspense (Next.js 16) */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
