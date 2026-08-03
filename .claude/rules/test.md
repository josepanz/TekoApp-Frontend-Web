## Reglas de testing

- SIEMPRE generar el archivo `.test.tsx`/`.test.ts` cuando se crea o modifica un componente, hook
  o función de `features/*`, `core/*` o `lib/*`.
- NUNCA pegarle al backend real ni a servicios externos en tests unitarios/integración — mockear
  con **MSW** (`src/test/msw/handlers.ts`) a nivel de `fetch`, nunca mockear módulos individuales
  de `core/api-client` a mano.
- Nombres de test en español, describiendo el COMPORTAMIENTO esperado, no la implementación.
  - ❌ `it('llama a fetch')`
  - ✅ `it('muestra un mensaje de error si el login falla')`
- Patrón AAA (Arrange / Act / Assert) obligatorio — nunca mezclar las tres fases en una línea.
- SIEMPRE `0 WARNINGS y 0 ERRORES` en `pnpm lint`, `pnpm check:types`, `pnpm test` — mismo estándar
  que `TekoApp-Backend`.

## Vitest + Testing Library (unit / integración de componentes)

```tsx
// UserTable.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { UserTable } from './UserTable';

describe('UserTable', () => {
  it('muestra un mensaje vacío cuando no hay usuarios', () => {
    // Arrange
    render(<UserTable users={[]} />);

    // Act & Assert
    expect(
      screen.getByText('No hay usuarios para mostrar'),
    ).toBeInTheDocument();
  });
});
```

- Usar `@testing-library/user-event` para interacción (`userEvent.click`, `.type`) — nunca
  `fireEvent` directo salvo un caso muy puntual que `user-event` no cubra.
- Testear comportamiento visible al usuario (texto, roles ARIA, estados disabled/loading) — nunca
  implementación interna (`wrapper.find('.some-class')`, estado interno de un hook).
- Hooks de TanStack Query: envolver en un `QueryClientProvider` de test (`src/test/query-client.ts`
  — reutilizar, no recrear por archivo).

## MSW (mocks de API)

- Handlers reutilizables en `src/test/msw/handlers.ts`, organizados por dominio
  (`src/test/msw/handlers/users.ts`, etc.) — igual que los mocks compartidos de `TekoApp-Backend`
  en `test/mocks/`.
- Nunca handlers inline duplicados por archivo de test si ya existe uno reutilizable.

## Playwright (e2e)

- Vive en `e2e/` en la raíz del proyecto (no en `src/`).
- Cubre por ahora: login completo (real contra un backend de test) + un flujo CRUD representativo
  (users). Se amplía a medida que se agregan dominios — no se busca cubrir el 100% de las rutas
  con e2e, eso es trabajo de los tests unitarios/integración.
- `data-testid` solo cuando no hay un rol ARIA o texto visible confiable para seleccionar el
  elemento — preferir `getByRole`/`getByLabelText` siempre que se pueda.

## TDD

- Para features nuevas: escribir el test (rojo) → implementar lo mínimo para pasarlo (verde) →
  refactorizar. No es obligatorio para fixes triviales de UI, pero sí para cualquier lógica en
  `features/*/hooks.ts`, `core/*` o `lib/*`.

## Comandos

- `pnpm test` — todos los tests (Vitest, modo run)
- `pnpm test:watch` — modo watch
- `pnpm test:coverage` — con cobertura
- `pnpm test:e2e` — Playwright
