import { getTranslations } from 'next-intl/server';
import { BrandGradientBackground } from '@/components/layout/brand-gradient-background';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { RegisterForm } from '@/features/auth/components/register-form';
import { BRAND_NAME } from '@/design-system/tokens/brand';

export default async function RegisterPage() {
  const t = await getTranslations('auth.register');

  return (
    <BrandGradientBackground className="relative flex min-h-svh flex-col items-center justify-center gap-8 p-6 text-white">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {t('pageTitle', { brand: BRAND_NAME })}
        </h1>
        <p className="text-white/80">{t('pageSubtitle')}</p>
      </div>
      <div className="bg-card text-card-foreground w-full max-w-sm rounded-xl p-6 shadow-lg">
        <RegisterForm />
      </div>
    </BrandGradientBackground>
  );
}
