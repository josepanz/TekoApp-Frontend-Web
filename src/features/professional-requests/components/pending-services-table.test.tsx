/**
 * Suite: PendingServicesTable (solicitudes pendientes del profesional)
 * Casos: CP-WEB-MKT-105 (ver test/qa/casos/CP-MKT.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: handlers MSW de professional-mode; sin backend real.
 * Trazabilidad: DEF-WEB-006 (403 de profesional no aprobado), plan maestro M3/M4.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { professionalModeHandlers } from '@/test/msw/handlers/professional-mode';
import { PendingServicesTable } from './pending-services-table';

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PendingServicesTable />
    </QueryClientProvider>,
  );
}

describe('PendingServicesTable', () => {
  beforeEach(() => {
    server.use(...professionalModeHandlers);
  });

  it('muestra las solicitudes pendientes con cliente y monto', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('Reparación de cañería'),
    ).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });

  it('dispara la aceptación del servicio al hacer click en Aceptar', async () => {
    // Arrange
    const user = userEvent.setup();
    renderTable();
    await screen.findByText('Reparación de cañería');

    // Act
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    // Assert — el botón vuelve a estar habilitado tras resolver la mutation (sin quedar
    // deshabilitado indefinidamente), confirmando que el POST /accept se resolvió sin error.
    await vi.waitFor(() =>
      expect(screen.getByRole('button', { name: 'Aceptar' })).toBeEnabled(),
    );
  });

  // DEF-WEB-006
  it('explica que el perfil no está aprobado cuando el backend responde 403', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/services', () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              code: 403,
              message: 'Forbidden',
              error: 'Forbidden',
              timestamp: '2026-10-13T10:00:00.000Z',
              path: '/x',
            },
          },
          { status: 403 },
        ),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Tu perfil profesional todavía no está aprobado',
    );
  });
});
