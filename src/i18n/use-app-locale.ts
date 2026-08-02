'use client';

import { useLocale } from 'next-intl';
import { defaultLocale, isAppLocale, type AppLocale } from './config';

// `useLocale()` de next-intl devuelve un `string` genérico; los formatters de `@/lib/formatters`
// esperan un `AppLocale`. Este hook centraliza el estrechamiento para no repetir un cast por
// componente (y cae al idioma por defecto si llegara un valor inesperado).
export function useAppLocale(): AppLocale {
  const locale = useLocale();
  return isAppLocale(locale) ? locale : defaultLocale;
}
