import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { professionalsHandlers } from '@/test/msw/handlers/professionals';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { ProfessionalsTable } from './professionals-table';

// El agregador central `src/test/msw/handlers.ts` todavía no incluye este dominio (lo integra
// otro equipo), así que los handlers se registran acá con `server.use`.
beforeEach(() => {
  server.use(...professionalsHandlers);
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
});
