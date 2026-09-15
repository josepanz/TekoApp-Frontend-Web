import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './msw/server';

// jsdom no implementa ResizeObserver ni Element.prototype.scrollIntoView/hasPointerCapture —
// los popups de Base UI (dropdown menu, tooltip, etc.) los usan para posicionarse vía Floating UI
// y no abren en absoluto en los tests sin este polyfill mínimo.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;
Element.prototype.scrollIntoView ??= () => {};
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};

// jsdom tampoco implementa window.matchMedia — lo usa `hooks/use-mobile.ts` (detecta mobile vs.
// desktop), del que depende cualquier componente que use `SidebarProvider`/`Sidebar`.
window.matchMedia ??= (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;

// Arranca el servidor MSW antes de todos los tests, resetea handlers entre tests
// (nunca dejar que un test contamine a otro con un handler custom), y lo cierra al final.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
