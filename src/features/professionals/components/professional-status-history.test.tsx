/**
 * Suite: ProfessionalStatusHistory (tabla paginada del historial de estados en el detalle admin)
 * Casos: CP-WEB-ONB-010 (ver test/qa/casos/CP-ONB.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: MSW; sin backend real.
 * Trazabilidad: contrato `GET /professionals/:id/status-history?page&pageSize` (mas reciente primero).
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import type { ProfessionalStatusHistoryItem } from '../api';
import { ProfessionalStatusHistory } from './professional-status-history';

function item(
  overrides: Partial<ProfessionalStatusHistoryItem> = {},
): ProfessionalStatusHistoryItem {
  return {
    id: '1',
    action: 'SUSPEND',
    fromStatus: 'APPROVED',
    toStatus: 'SUSPENDED',
    reason: 'Conducta inapropiada reportada',
    changedAt: '2026-10-13T14:30:00.000Z',
    ipAddress: '127.0.0.1',
    userAgent: 'vitest',
    actor: {
      referenceId: 'a1',
      name: 'Ada Lovelace',
      email: 'ada@tekoapp.com.py',
    },
    ...overrides,
  };
}

function renderHistory() {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <ProfessionalStatusHistory professionalId={9} />
    </QueryClientProvider>,
  );
}

describe('ProfessionalStatusHistory', () => {
  it('CP-WEB-ONB-010 muestra actor, de -> a y motivo, en el orden recibido (más reciente primero)', async () => {
    // Arrange
    const onRequest = vi.fn();
    server.use(
      http.get(
        '/api/backend/professionals/:id/status-history',
        ({ request, params }) => {
          const url = new URL(request.url);
          onRequest(
            params.id,
            url.searchParams.get('page'),
            url.searchParams.get('pageSize'),
          );
          return HttpResponse.json({
            data: [
              item({
                id: '2',
                action: 'REACTIVATE',
                fromStatus: 'SUSPENDED',
                toStatus: 'APPROVED',
                reason: 'Apelación aceptada',
                changedAt: '2026-10-14T14:30:00.000Z',
              }),
              item({ id: '1' }),
            ],
            pagination: { total: 2, page: 1, pageSize: 10, totalPages: 1 },
          });
        },
      ),
    );

    // Act
    renderHistory();

    // Assert
    const table = await screen.findByRole('table', {
      name: 'Historial de estados',
    });
    await within(table).findByText('Apelación aceptada');
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByText('Apelación aceptada')).toBeInTheDocument();
    expect(within(rows[0]).getByText('Suspendido')).toBeInTheDocument();
    expect(within(rows[0]).getByText('Aprobado')).toBeInTheDocument();
    expect(
      within(rows[1]).getByText('Conducta inapropiada reportada'),
    ).toBeInTheDocument();
    expect(within(rows[1]).getByText('Ada Lovelace')).toBeInTheDocument();
    expect(within(rows[1]).getByText('ada@tekoapp.com.py')).toBeInTheDocument();
    expect(onRequest).toHaveBeenCalledWith('9', '1', '10');
  });

  it('CP-WEB-ONB-010 sin transiciones muestra el estado vacío', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professionals/:id/status-history', () =>
        HttpResponse.json({
          data: [],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
        }),
      ),
    );

    // Act
    renderHistory();

    // Assert
    expect(
      await screen.findByText('Sin cambios de estado'),
    ).toBeInTheDocument();
  });

  it('CP-WEB-ONB-010 pagina: pide la página siguiente', async () => {
    // Arrange
    const pages: string[] = [];
    server.use(
      http.get(
        '/api/backend/professionals/:id/status-history',
        ({ request }) => {
          const page = new URL(request.url).searchParams.get('page') ?? '1';
          pages.push(page);
          return HttpResponse.json({
            data: [item({ id: page, reason: `motivo pagina ${page}` })],
            pagination: {
              total: 20,
              page: Number(page),
              pageSize: 10,
              totalPages: 2,
            },
          });
        },
      ),
    );
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('motivo pagina 1');

    // Act
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));

    // Assert
    expect(await screen.findByText('motivo pagina 2')).toBeInTheDocument();
    expect(pages).toEqual(['1', '2']);
  });

  it('CP-WEB-ONB-010 si falla la carga muestra un error con reintento', async () => {
    // Arrange
    server.use(
      http.get(
        '/api/backend/professionals/:id/status-history',
        () => new HttpResponse(null, { status: 500 }),
      ),
    );

    // Act
    renderHistory();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar el historial de estados.',
        {},
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
  }, 15000);
});
