// Configuración base de i18n (next-intl). Ver `src/i18n/request.ts` para la resolución por request
// y el comentario de decisión de routing.

export const locales = ['es', 'en'] as const;
export type AppLocale = (typeof locales)[number];

// Español es el idioma por defecto (idioma original de todo el producto).
export const defaultLocale: AppLocale = 'es';

// Nombre de la cookie de preferencia de idioma. `NEXT_LOCALE` es la convención de next-intl; la
// gestionamos nosotros (no usamos el middleware de routing de next-intl, ver `request.ts`).
export const LOCALE_COOKIE = 'NEXT_LOCALE';

// Un año — la preferencia de idioma no caduca en cada sesión.
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isAppLocale(
  value: string | null | undefined,
): value is AppLocale {
  return value != null && (locales as readonly string[]).includes(value);
}

// Negociación mínima de `Accept-Language` sin dependencias externas: se toma el primer idioma
// soportado por orden de preferencia (q-value). Fallback a español.
export function negotiateLocale(
  acceptLanguage: string | null | undefined,
): AppLocale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, quality] = part.trim().split(';q=');
      return {
        tag: tag.trim().toLowerCase(),
        q: quality ? Number(quality) : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split('-')[0];
    if (isAppLocale(base)) return base;
  }

  return defaultLocale;
}
