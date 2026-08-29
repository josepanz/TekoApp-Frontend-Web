import Link from 'next/link';
import { BrandGradientBackground } from '@/components/layout/brand-gradient-background';
import { getSession } from '@/core/auth/session';
import { isStaffUser } from '@/core/auth/permissions';
import { MyRatingStatsCard } from '@/features/my-ratings/components/my-rating-stats-card';
import { ProModeLink } from '@/features/professional-profile/components/pro-mode-link';
import { getTranslations } from 'next-intl/server';

// Home del modo Cliente — el layout ((client)/layout.tsx) ya valida la sesión.
export default async function ClientHomePage() {
  const t = await getTranslations('pages.client.home');
  const session = await getSession();
  const showAdminLink = session ? isStaffUser(session.permissions) : false;

  return (
    <div className="flex flex-col gap-6">
      <BrandGradientBackground className="rounded-xl p-6 text-white">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {t('greeting', { name: session?.firstName ?? '' })}
        </h1>
        <p className="text-white/80">{t('description')}</p>
      </BrandGradientBackground>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/solicitar"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          {t('requestCta')}
        </Link>
        <Link
          href="/profesionales"
          className="border-input hover:bg-accent rounded-md border px-4 py-2 text-sm font-medium transition-colors"
        >
          {t('browseCta')}
        </Link>
        <ProModeLink />
        {showAdminLink && (
          <Link
            href="/admin"
            className="border-input hover:bg-accent rounded-md border px-4 py-2 text-sm font-medium transition-colors"
          >
            {t('adminCta')}
          </Link>
        )}
      </div>

      <MyRatingStatsCard />
    </div>
  );
}
