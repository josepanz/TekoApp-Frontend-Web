import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  auditLogHandlers,
  buildAuditLogEntry,
} from '@/test/msw/handlers/audit-log';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { AuditLogTable } from './audit-log-table';

function mockScope(permissions: string[]) {
  server.use(
    http.get('/api/backend/auth/scope', () => {
      return HttpResponse.json({
        permissions: permissions.map((name) => ({ name })),
        roles: [],
      });
    }),
  );
}

beforeEach(() => {
  server.use(...auditLogHandlers);
  mockScope(['admin:all']);
});

function renderTable() {
  const queryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AuditLogTable />
    </QueryClientProvider>,
  );
  return queryClient;
}

describe('AuditLogTable', () => {
  it('no renderiza nada si el usuario no tiene permiso de auditoría de sistema', async () => {
    // Arrange
    mockScope([]);

    // Act
    const queryClient = renderTable();

    // Assert
    await waitFor(() =>
      expect(queryClient.getQueryState(['auth', 'scope'])?.status).toBe(
        'success',
      ),
    );
    expect(screen.queryByText('professionals')).not.toBeInTheDocument();
  });

  it('muestra las filas de auditoría una vez cargadas', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(await screen.findByText('professionals')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('UPDATE')).toBeInTheDocument();
    expect(screen.getByText('staff-uuid-1')).toBeInTheDocument();
  });

  it('manda los filtros activos al backend (tabla, registro, quién y rango de fechas)', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.get('/api/backend/admin/audit-logs', ({ request }) => {
        const url = new URL(request.url);
        onRequest(Object.fromEntries(url.searchParams.entries()));
        return HttpResponse.json({
          data: [buildAuditLogEntry()],
          pagination: { total: 1, page: 1, pageSize: 10, totalPages: 1 },
        });
      }),
    );
    renderTable();
    await screen.findByText('professionals');

    // Act
    await user.type(screen.getByLabelText('Tabla afectada'), 'professionals');
    await user.type(screen.getByLabelText('ID de registro'), '42');
    await user.type(screen.getByLabelText('Quién'), 'staff-uuid-1');

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenLastCalledWith(
        expect.objectContaining({
          tableName: 'professionals',
          recordId: '42',
          changedBy: 'staff-uuid-1',
        }),
      );
    });
  });

  it('muestra un mensaje vacío cuando el backend no devuelve registros', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/audit-logs', () =>
        HttpResponse.json({
          data: [],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
        }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText(
        'No hay registros de auditoría que coincidan con los filtros.',
      ),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/audit-logs', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('No se pudo cargar el registro de auditoría.'),
    ).toBeInTheDocument();
  });
});
