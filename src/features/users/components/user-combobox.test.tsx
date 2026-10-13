/**
 * Suite: UserCombobox degrada sin permiso user:read (compliance).
 * Casos: CP-WEB-AUTH-128 (ver test/qa/casos/CP-AUTH.md)
 * Tipo: unitaria   Prioridad: P1
 * Precondiciones: MSW responde 403 a GET /users; QueryClient con el mismo throwOnError(403) que
 *   el QueryProvider de la app.
 * Trazabilidad: DEF-WEB-001 (consent-audit de compliance mandaba toda la pagina a "sin acceso")
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { ApiError } from '@/core/api-client/errors';
import { server } from '@/test/msw/server';
import { render, screen } from '@/test/render';
import { UserCombobox } from './user-combobox';

describe('UserCombobox', () => {
  it('CP-WEB-AUTH-128 un 403 de GET /users no propaga al error boundary y el picker sigue usable', async () => {
    server.use(
      http.get('/api/backend/users', () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 }),
      ),
    );
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          throwOnError: (error) =>
            error instanceof ApiError && error.status === 403,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <UserCombobox onChange={() => {}} ariaLabel="Usuario" />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole('combobox')).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
