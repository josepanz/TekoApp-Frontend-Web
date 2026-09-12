import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fakeProfessionalsPage1,
  professionalsHandlers,
} from '@/test/msw/handlers/professionals';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { triggerFileDownload } from '@/lib/trigger-file-download';
import { ProfessionalsTable } from './professionals-table';

vi.mock('@/lib/trigger-file-download', () => ({
  triggerFileDownload: vi.fn(),
}));

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

// El agregador central `src/test/msw/handlers.ts` todavía no incluye este dominio (lo integra
// otro equipo), así que los handlers se registran acá con `server.use`.
beforeEach(() => {
  server.use(...professionalsHandlers);
  // `vi.mock` crea el mock una sola vez por archivo — sin esto, las llamadas de un test quedan
  // registradas en el siguiente.
  vi.mocked(triggerFileDownload).mockClear();
});

function renderProfessionalsTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfessionalsTable />
    </QueryClientProvider>,
  );
}

describe('ProfessionalsTable', () => {
  it('muestra las filas de profesionales una vez cargadas', async () => {
    // Arrange & Act
    renderProfessionalsTable();

    // Assert
    expect(
      await screen.findByText('Juan Pérez', {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText('María López')).toBeInTheDocument();
    expect(screen.getByText('Plomería')).toBeInTheDocument();
    expect(screen.getByText('Electricidad')).toBeInTheDocument();
    expect(screen.getByText('Aprobado')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('4.8 ⭐')).toBeInTheDocument();
  });

  it('muestra las acciones de verificar y suspender según el estado del profesional', async () => {
    // Arrange & Act
    renderProfessionalsTable();
    await screen.findByText('Juan Pérez', {}, { timeout: 3000 });

    // Assert: Juan ya está verificado y aprobado → solo puede suspenderse
    const rows = screen.getAllByRole('row');
    const juanRow = rows.find((row) => row.textContent?.includes('Juan Pérez'));
    expect(juanRow).toBeDefined();
    expect(
      juanRow &&
        Array.from(juanRow.querySelectorAll('button')).some(
          (button) => button.textContent === 'Suspender',
        ),
    ).toBe(true);
    expect(
      juanRow &&
        Array.from(juanRow.querySelectorAll('button')).some(
          (button) => button.textContent === 'Verificar',
        ),
    ).toBe(false);
  });

  it("avanza de página al hacer click en 'Página siguiente'", async () => {
    // Arrange
    const user = userEvent.setup();
    renderProfessionalsTable();
    await screen.findByText('Juan Pérez', {}, { timeout: 3000 });

    // Act
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }));

    // Assert
    expect(await screen.findByText('Página 2 de 2')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando el backend no devuelve profesionales', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professionals', () =>
        HttpResponse.json({
          data: [],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 },
        }),
      ),
    );

    // Act
    renderProfessionalsTable();

    // Assert
    expect(
      await screen.findByText('No hay profesionales para mostrar'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professionals', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderProfessionalsTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar la lista de profesionales. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });

  it('no muestra el botón de exportar si el usuario no tiene el permiso de verificación', async () => {
    // Arrange
    mockScope([]);

    // Act
    renderProfessionalsTable();
    await screen.findByText('Juan Pérez', {}, { timeout: 3000 });

    // Assert
    expect(
      screen.queryByRole('button', { name: 'Exportar' }),
    ).not.toBeInTheDocument();
  });

  it('exporta el CSV de profesionales y dispara la descarga con el filename real', async () => {
    // Arrange
    mockScope(['admin:all']);
    const user = userEvent.setup();
    renderProfessionalsTable();
    await screen.findByText('Juan Pérez', {}, { timeout: 3000 });

    // Act
    await user.click(await screen.findByRole('button', { name: 'Exportar' }));

    // Assert
    await waitFor(() => {
      expect(triggerFileDownload).toHaveBeenCalledTimes(1);
    });
    // No `expect.any(Blob)`: ver nota en payments-table.test.tsx (mismatch de `instanceof` entre
    // el `Blob` de undici/Node y el de jsdom en este entorno de test).
    const [blob, filename] = vi.mocked(triggerFileDownload).mock.calls[0];
    expect(filename).toBe('profesionales.csv');
    expect(blob.type).toBe('text/csv');
  });

  it('verifica en bloque a los profesionales seleccionados cuando todas las llamadas tienen éxito', async () => {
    // Arrange
    const user = userEvent.setup();
    const verifiedIds: string[] = [];
    server.use(
      http.post('/api/backend/professionals/:id/verify', ({ params }) => {
        verifiedIds.push(String(params.id));
        return HttpResponse.json({
          ...fakeProfessionalsPage1.data[0],
          id: Number(params.id),
          verificationStatus: 'VERIFIED',
        });
      }),
    );
    renderProfessionalsTable();
    await screen.findByText('Juan Pérez', {}, { timeout: 3000 });

    // Act
    const rowCheckboxes = screen.getAllByRole('checkbox', {
      name: 'Seleccionar fila',
    });
    await user.click(rowCheckboxes[0]);
    await user.click(rowCheckboxes[1]);
    await user.click(
      screen.getByRole('button', { name: 'Verificar seleccionados (2)' }),
    );
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Confirmar' }));

    // Assert
    await waitFor(() => {
      expect(verifiedIds.sort()).toEqual(['1', '2']);
    });
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('exige un motivo para suspender en bloque y aplica el mismo motivo a todas las llamadas', async () => {
    // Arrange
    const user = userEvent.setup();
    const suspendCalls: { id: string; reason?: string }[] = [];
    server.use(
      http.post(
        '/api/backend/professionals/:id/suspend',
        async ({ request, params }) => {
          const body = (await request.json()) as { reason?: string };
          suspendCalls.push({ id: String(params.id), reason: body.reason });
          return HttpResponse.json({
            ...fakeProfessionalsPage1.data[0],
            id: Number(params.id),
            status: 'SUSPENDED',
          });
        },
      ),
    );
    renderProfessionalsTable();
    await screen.findByText('Juan Pérez', {}, { timeout: 3000 });

    // Act
    const rowCheckboxes = screen.getAllByRole('checkbox', {
      name: 'Seleccionar fila',
    });
    await user.click(rowCheckboxes[0]);
    await user.click(rowCheckboxes[1]);
    await user.click(
      screen.getByRole('button', { name: 'Suspender seleccionados (2)' }),
    );

    // Assert: exige el motivo antes de mandar cualquier request
    await user.click(
      screen.getByRole('button', { name: 'Confirmar suspensión' }),
    );
    expect(
      await screen.findByText('El motivo es obligatorio'),
    ).toBeInTheDocument();
    expect(suspendCalls).toHaveLength(0);

    // Act: completa el motivo y confirma
    await user.type(
      screen.getByLabelText(
        'Motivo de suspensión (se aplica a todos los profesionales seleccionados)',
      ),
      'Conducta inapropiada reportada por varios clientes',
    );
    await user.click(
      screen.getByRole('button', { name: 'Confirmar suspensión' }),
    );

    // Assert
    await waitFor(() => {
      expect(suspendCalls).toHaveLength(2);
    });
    expect(
      suspendCalls.every(
        (call) =>
          call.reason === 'Conducta inapropiada reportada por varios clientes',
      ),
    ).toBe(true);
  });

  it('reporta el fallo parcial y no bloquea el resto cuando alguna verificación en bloque falla', async () => {
    // Arrange
    const user = userEvent.setup();
    server.use(
      http.post('/api/backend/professionals/:id/verify', ({ params }) => {
        if (params.id === '2') {
          return HttpResponse.json(
            { message: 'No autorizado' },
            { status: 403 },
          );
        }
        return HttpResponse.json({
          ...fakeProfessionalsPage1.data[0],
          id: Number(params.id),
          verificationStatus: 'VERIFIED',
        });
      }),
    );
    renderProfessionalsTable();
    await screen.findByText('Juan Pérez', {}, { timeout: 3000 });

    // Act
    const rowCheckboxes = screen.getAllByRole('checkbox', {
      name: 'Seleccionar fila',
    });
    await user.click(rowCheckboxes[0]);
    await user.click(rowCheckboxes[1]);
    await user.click(
      screen.getByRole('button', { name: 'Verificar seleccionados (2)' }),
    );
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Confirmar' }));

    // Assert: el diálogo se cierra y la selección se limpia pese al fallo parcial
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });
    expect(
      screen.getAllByRole('checkbox', { name: 'Seleccionar fila' })[0],
    ).not.toBeChecked();
  });
});
