import {
  render as rtlRender,
  type RenderOptions,
} from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';
import messages from '../../messages/es.json';

// Wrapper central de i18n para tests. Todo componente que use `useTranslations()`/`useLocale()` de
// next-intl necesita este provider — igual que `createTestQueryClient` centraliza el
// QueryClientProvider, este helper centraliza el NextIntlClientProvider para NO repetirlo por
// archivo. Los tests siguen comprobando el comportamiento visible en español (idioma por defecto),
// así que se cargan los mensajes reales de `messages/es.json`.
//
// Uso: importar `render`, `screen`, etc. desde `@/test/render` en vez de `@testing-library/react`.
// El resto de la API de Testing Library se re-exporta tal cual.
function IntlWrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider
      locale="es"
      messages={messages}
      // `Etc/GMT+3` y NO `America/Asuncion`: Paraguay abolió el horario de verano (Ley 7127) y
      // quedó fijo en UTC-3, pero la zona IANA `America/Asuncion` sigue cargando reglas de DST
      // según el tzdata de cada host — la misma fecha se formatearía con ±1h de diferencia entre
      // CI y local. `Etc/GMT+3` es un offset fijo (signo invertido por convención POSIX:
      // GMT+3 = UTC-3). Debe coincidir con el `timeZone` de src/i18n/request.ts.
      timeZone="Etc/GMT+3"
    >
      {children}
    </NextIntlClientProvider>
  );
}

function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): ReturnType<typeof rtlRender> {
  return rtlRender(ui, { wrapper: IntlWrapper, ...options });
}

// Re-export de la API de Testing Library; `render` local sobreescribe al del star-export.
export * from '@testing-library/react';
export { render };
