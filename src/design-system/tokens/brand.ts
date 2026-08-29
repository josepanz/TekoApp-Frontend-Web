import tokens from './tokens.json';

/**
 * Branding centralizado (nombre + assets) — fuente: `tokens.json#content`. A diferencia de
 * color/tipografía, esto no pasa por `pnpm tokens:build` (es texto/rutas, no CSS): se importa
 * directo. Ver `BRANDING.md` para qué más hay que tocar al rebrandear de verdad.
 */
export const BRAND_NAME = tokens.content.appName.$value;
export const BRAND_LOGO_PATH = tokens.content.logoPath.$value;
export const BRAND_BANNER_PATH = tokens.content.bannerPath.$value;
