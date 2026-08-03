import { defaultLocale, type AppLocale } from '@/i18n/config';

// Mapeo del locale de UI (es/en) al locale de Intl con región. `es` usa la convención paraguaya
// (es-PY: separador de miles con punto, fecha d/m/aaaa); `en` usa en-US.
const INTL_LOCALE: Record<AppLocale, string> = {
  es: 'es-PY',
  en: 'en-US',
};

function resolveIntlLocale(locale: AppLocale): string {
  return INTL_LOCALE[locale] ?? INTL_LOCALE[defaultLocale];
}

// Cacheo de formatters por locale (construir un Intl.* por llamada es caro en tablas con muchas
// filas). Se mantiene el espíritu de los formatters cacheados del módulo original.
const numberFormatters = new Map<string, Intl.NumberFormat>();
const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function getNumberFormatter(intlLocale: string): Intl.NumberFormat {
  let formatter = numberFormatters.get(intlLocale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(intlLocale);
    numberFormatters.set(intlLocale, formatter);
  }
  return formatter;
}

function getDateFormatter(intlLocale: string): Intl.DateTimeFormat {
  let formatter = dateFormatters.get(intlLocale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(intlLocale);
    dateFormatters.set(intlLocale, formatter);
  }
  return formatter;
}

export function formatNumber(
  value: number,
  locale: AppLocale = defaultLocale,
): string {
  return getNumberFormatter(resolveIntlLocale(locale)).format(value);
}

// El formato de moneda NO sigue el idioma de la interfaz: los montos son datos del backend, no
// chrome de UI. Se usa siempre la convención paraguaya (es-PY) para que "Gs. 1.234.567" se vea
// igual en español y en inglés. Cambiar el idioma de la UI no convierte ni reescribe montos —
// convertir moneda real sería un alcance completamente distinto (tipos de cambio, etc.).
//
// `currency` es opcional y por defecto PYG (el negocio es Paraguay-only hoy). Se acepta un código
// explícito para no perder el `currencyCode` que el backend manda por pago: forzar PYG sobre un
// monto que vino en otra moneda mostraría un importe incorrecto, no solo un símbolo distinto.
const DEFAULT_CURRENCY = 'PYG';

const currencyFormatters = new Map<string, Intl.NumberFormat>();

export function formatCurrency(
  value: number,
  currency: string = DEFAULT_CURRENCY,
): string {
  let formatter = currencyFormatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency,
      // Guaraníes no usa decimales; para otras monedas se deja el default del locale/moneda.
      ...(currency === DEFAULT_CURRENCY ? { maximumFractionDigits: 0 } : {}),
    });
    currencyFormatters.set(currency, formatter);
  }
  return formatter.format(value);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

// Fecha corta localizada (d/m/aaaa en es, m/d/aaaa en en). Sin argumento de timezone a propósito:
// se deja que el entorno resuelva la TZ local (comportamiento original de los sitios inline).
export function formatDate(
  value: string | number | Date,
  locale: AppLocale = defaultLocale,
): string {
  return getDateFormatter(resolveIntlLocale(locale)).format(new Date(value));
}
