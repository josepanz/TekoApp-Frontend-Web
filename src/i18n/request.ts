import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import {
  isAppLocale,
  LOCALE_COOKIE,
  negotiateLocale,
  type AppLocale,
} from './config';

// DECISIÓN DE ROUTING: patrón "sin prefijo de URL" de next-intl (locale resuelto por cookie +
// negociación de Accept-Language), NO el patrón con segmento `[locale]/`.
//
// Motivo: este es un panel de administración con auth obligatoria — no hay URLs públicas que
// necesiten localizarse para SEO. Meter un segmento `[locale]` obligaría a reescribir TODAS las
// rutas existentes ((auth), (client), admin, pro, api) bajo ese segmento y a reconfigurar el
// routing/protección de `src/proxy.ts`, un cambio enorme e innecesario para este caso. Con este
// patrón, `proxy.ts` queda intacto y el locale viaja por cookie httpOnly=false + header.
//
// Precedencia: cookie de preferencia (la que setea el selector de idioma) > Accept-Language del
// browser > español por defecto.
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;

  let locale: AppLocale;
  if (isAppLocale(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const headerStore = await headers();
    locale = negotiateLocale(headerStore.get('accept-language'));
  }

  return {
    locale,
    // TZ del negocio (Paraguay-only). Solo afecta a los formatters propios de next-intl; el
    // formateo de fechas de la app usa `@/lib/formatters`, que deja la TZ al entorno a propósito.
    //
    // `Etc/GMT+3` y NO `America/Asuncion`: Paraguay abolió el horario de verano (Ley 7127) y quedó
    // fijo en UTC-3, pero la zona IANA `America/Asuncion` sigue cargando reglas de DST según el
    // tzdata instalado en cada host — dos hosts con tzdata distinto formatean la misma fecha con
    // ±1h de diferencia sin que cambie una línea de código. `Etc/GMT+3` es un offset fijo sin
    // reglas de DST (el signo va invertido por convención POSIX: GMT+3 = UTC-3). Mismo criterio
    // ya aplicado en TekoApp-Backend (ver su `.claude/rules/datetime.md`).
    timeZone: 'Etc/GMT+3',
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
