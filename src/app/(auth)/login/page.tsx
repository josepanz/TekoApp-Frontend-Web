import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { BrandGradientBackground } from '@/components/layout/brand-gradient-background';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { LoginForm } from '@/features/auth/components/login-form';
import { BRAND_NAME } from '@/design-system/tokens/brand';

export default async function LoginPage() {
  const t = await getTranslations('auth.login');

  return (
    <BrandGradientBackground className="relative flex min-h-svh flex-col items-center justify-center gap-8 p-6 text-white">
      {/* El Topbar (que normalmente contiene el selector) solo existe en las áreas autenticadas —
          acá se expone suelto para poder elegir idioma antes de iniciar sesión. */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {t('pageTitle', { brand: BRAND_NAME })}
        </h1>
        <p className="text-white/80">{t('pageSubtitle')}</p>
      </div>
      {/* Card clara sobre el gradiente — los inputs/labels del form asumen un fondo claro
          (--foreground es texto oscuro), así que necesitan su propia superficie, no heredar el
          gradiente oscuro de la página. */}
      <div className="bg-card w-full max-w-sm rounded-xl p-6 shadow-lg">
        {/* useSearchParams() en LoginForm exige un límite de Suspense (Next.js 16) */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </BrandGradientBackground>
  );
}
