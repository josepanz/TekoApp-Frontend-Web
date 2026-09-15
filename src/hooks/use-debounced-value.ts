import { useEffect, useState } from 'react';

/**
 * Devuelve `value`, pero actualizado recién `delayMs` después del último cambio — para no
 * disparar una query (ej. búsqueda global) en cada tecla. Genérico y sin dependencia de ningún
 * feature en particular para poder reusarse donde haga falta.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
