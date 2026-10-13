/**
 * Suite: MyServicesTable (servicios asignados al profesional)
 * Casos: CP-WEB-MKT-002 (ver test/qa/casos/CP-MKT.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: handlers MSW de professional-mode; sin backend real.
 * Trazabilidad: DEF-WEB-011 (vista desactualizada tras un 409 de transicion), plan maestro M4.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { buildService } from '@/test/msw/handlers/services';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { professionalModeHandlers } from '@/test/msw/handlers/professional-mode';
import { MyServicesTable } from './my-services-table';

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MyServicesTable />
    </QueryClientProvider>,
  );
}

describe('MyServicesTable', () => {
  beforeEach(() => {
    server.use(...professionalModeHandlers);
  });

  it('muestra la acción correcta según el estado de cada servicio', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    await screen.findAllByText('Reparación de cañería');
    expect(screen.getByRole('button', { name: 'Iniciar' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Completar' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Calificar cliente' }),
    ).toBeInTheDocument();
  });

  // DEF-WEB-011
  it('CP-WEB-MKT-002 tras un 409 al completar refresca la lista y deja de ofrecer Completar', async () => {
    // Arrange: el servicio ya fue completado desde otra pestaña; esta vista sigue "En curso".
    let completedElsewhere = false;
    let listCalls = 0;
    server.use(
      http.get('/api/backend/services/my-services', () => {
        listCalls += 1;
        return HttpResponse.json([
          buildService({
            referenceId: 'inprogress-svc-001',
            status: completedElsewhere ? 'COMPLETED' : 'IN_PROGRESS',
          }),
        ]);
      }),
      http.post('/api/backend/services/:id/complete', () => {
        completedElsewhere = true;
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: 409,
              message: 'El servicio no puede ser completado en este estado',
              error: 'Conflict',
              timestamp: '2026-10-13T10:00:00.000Z',
              path: '/x',
            },
          },
          { status: 409 },
        );
      }),
    );
    const user = userEvent.setup();
    renderTable();
    await user.click(await screen.findByRole('button', { name: 'Completar' }));

    // Assert
    await waitFor(() => expect(listCalls).toBeGreaterThan(1));
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Completar' })).toBeNull(),
    );
  });
});
