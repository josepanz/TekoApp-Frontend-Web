'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales, type AppLocale } from '@/i18n/config';
import { setLocale } from '@/i18n/set-locale-action';

// Selector de idioma. Persiste la elección en la cookie NEXT_LOCALE vía Server Action y refresca
// la ruta para que los Server Components se re-rendericen con el nuevo locale (no hay segmento
// [locale] en la URL — ver la decisión de routing documentada en src/i18n/request.ts).
export function LanguageSwitcher() {
  const t = useTranslations('common.language');
  const currentLocale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(locale: AppLocale) {
    if (locale === currentLocale) return;
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('label')}
            disabled={isPending}
          >
            <Languages aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleSelect(locale)}
            data-current={locale === currentLocale ? '' : undefined}
          >
            {t(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
