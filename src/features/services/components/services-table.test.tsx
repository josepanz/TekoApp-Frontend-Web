import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { servicesHandlers } from '@/test/msw/handlers/services';
import { ServicesTable } from './services-table';

function renderServicesTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ServicesTable />
    </QueryClientProvider>,
  );
}

describe('ServicesTable', () => {
  it('muestra las filas de servicios una vez cargadas', async () => {
    // Arrange
    server.use(...servicesHandlers);

    // Act
    renderServicesTable();

    // Assert
    expect(
      await screen.findByText('Reparación de cañería'),
    ).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María López')).toBeInTheDocument();
    expect(screen.getByText('Sin asignar')).toBeInTheDocument();
    expect(screen.getByText('Profesional #2')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('Aceptado')).toBeInTheDocument();
  });

  it('filtra los servicios por estado al elegir una opción del select', async () => {
    // Arrange
    server.use(...servicesHandlers);
    const user = userEvent.setup();
    renderServicesTable();
    await screen.findByText('Reparación de cañería');

    // Act
    await user.click(
      screen.getByRole('combobox', { name: 'Filtrar por estado' }),
    );
    await user.click(await screen.findByRole('option', { name: 'Completado' }));

    // Assert
    expect(await screen.findByText('Corte de césped')).toBeInTheDocument();
    expect(screen.queryByText('Reparación de cañería')).not.toBeInTheDocument();
  }, 10000);

  it('muestra un mensaje vacío cuando el backend no devuelve servicios', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/services', () =>
        HttpResponse.json({
          data: [],
          pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 },
        }),
      ),
    );

    // Act
    renderServicesTable();

    // Assert
    expect(
      await screen.findByText('No hay servicios para mostrar'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/services', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderServicesTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar la lista de servicios. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });
});
