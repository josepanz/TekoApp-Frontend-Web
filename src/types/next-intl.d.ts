import type { AppLocale } from '@/i18n/config';
import type messages from '../../messages/es.json';

// Augmentación de tipos de next-intl: hace que `t('...')` valide la clave contra el catálogo real
// en tiempo de compilación (`pnpm check:types` falla si una clave no existe o si un componente
// quedó apuntando a una clave que se renombró). El español es la fuente de verdad de la forma del
// catálogo; `messages/en.json` debe tener las MISMAS claves.
declare module 'next-intl' {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof messages;
  }
}
