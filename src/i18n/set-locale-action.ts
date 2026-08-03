'use server';

import { cookies } from 'next/headers';
import {
  isAppLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type AppLocale,
} from './config';

// Server Action que persiste la preferencia de idioma en la cookie que lee `src/i18n/request.ts`.
// El selector de idioma la invoca y luego hace `router.refresh()` para re-renderizar con el nuevo
// locale. La cookie NO es httpOnly a propósito: es una preferencia de UI, no un secreto (a
// diferencia de accessToken/refreshToken).
export async function setLocale(locale: AppLocale): Promise<void> {
  if (!isAppLocale(locale)) return;

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
}
