import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { aiDisclosuresHandlers } from '@/test/msw/handlers/ai-disclosures';
import { AiDisclosuresTable } from './ai-disclosures-table';

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AiDisclosuresTable />
    </QueryClientProvider>,
  );
}

describe('AiDisclosuresTable', () => {
  it('muestra las filas de disclosures una vez cargadas', async () => {
    // Arrange
    server.use(...aiDisclosuresHandlers);

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('Descripción de servicio'),
    ).toBeInTheDocument();
    expect(screen.getByText('Descripción de profesional')).toBeInTheDocument();
    expect(screen.getByText('Autodeclarado por usuario')).toBeInTheDocument();
    expect(screen.getByText('IA de plataforma')).toBeInTheDocument();
  });

  it('enlaza al detalle admin correspondiente cuando existe una ruta', async () => {
    // Arrange
    server.use(...aiDisclosuresHandlers);

    // Act
    const { container } = renderTable();
    await screen.findByText('Descripción de servicio');

    // Assert
    expect(
      container.querySelector('a[href="/admin/services/svc-1"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('a[href="/admin/professionals/prof-1"]'),
    ).toBeInTheDocument();
  });

  it('filtra por tipo de contenido al elegir una opción del select', async () => {
    // Arrange
    server.use(...aiDisclosuresHandlers);
    const user = userEvent.setup();
    renderTable();
    await screen.findByText('Descripción de servicio');

    // Act
    await user.click(
      screen.getByRole('combobox', { name: 'Tipo de contenido' }),
    );
    await user.click(
      await screen.findByRole('option', { name: 'Descripción de profesional' }),
    );

    // Assert
    const table = screen.getByRole('table');
    expect(
      await within(table).findByText('Descripción de profesional'),
    ).toBeInTheDocument();
    expect(
      within(table).queryByText('Descripción de servicio'),
    ).not.toBeInTheDocument();
  }, 10000);

  it('muestra un mensaje vacío cuando el backend no devuelve disclosures', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/ai-disclosures', () =>
        HttpResponse.json({
          data: [],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 },
        }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('No hay disclosures de IA para mostrar'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/ai-disclosures', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar el listado de disclosures de IA.',
      ),
    ).toBeInTheDocument();
  });
});
