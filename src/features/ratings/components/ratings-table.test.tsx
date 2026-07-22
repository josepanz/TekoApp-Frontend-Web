import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { fakeRatings, ratingsHandlers } from '@/test/msw/handlers/ratings';
import { RatingsTable } from './ratings-table';

function renderRatingsTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <RatingsTable />
    </QueryClientProvider>,
  );
}

describe('RatingsTable', () => {
  beforeEach(() => {
    server.use(...ratingsHandlers);
  });

  it('muestra las filas de calificaciones una vez cargadas', async () => {
    // Arrange & Act
    renderRatingsTable();

    // Assert
    expect(
      await screen.findByText('Excelente trabajo, muy profesional y puntual.'),
    ).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getAllByText('Cliente → Profesional').length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText('Profesional → Cliente').length).toBeGreaterThan(
      0,
    );
  });

  it('muestra el badge de "Reportada" solo en la calificación reportada', async () => {
    // Arrange & Act
    renderRatingsTable();
    await screen.findByText('Excelente trabajo, muy profesional y puntual.');

    // Assert
    expect(screen.getAllByText('Reportada', { selector: 'span' })).toHaveLength(
      1,
    );
  });

  it('muestra un mensaje vacío cuando el backend no devuelve calificaciones', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/ratings', () => HttpResponse.json({ data: [] })),
    );

    // Act
    renderRatingsTable();

    // Assert
    expect(
      await screen.findByText('No hay calificaciones para mostrar'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/ratings', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderRatingsTable();

    // Assert
    expect(
      await screen.findByText(
        'No se pudo cargar la lista de calificaciones. Intentá recargar la página.',
      ),
    ).toBeInTheDocument();
  });

  it('elimina la calificación con el id correcto al confirmar en el diálogo', async () => {
    // Arrange
    const user = userEvent.setup();
    let deletedId: string | undefined;
    server.use(
      http.delete('/api/backend/ratings/:id', ({ params }) => {
        deletedId = params.id as string;
        return new HttpResponse(null, { status: 204 });
      }),
    );
    renderRatingsTable();
    await screen.findByText('Excelente trabajo, muy profesional y puntual.');

    // Act
    const deleteButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    await user.click(deleteButtons[0]);
    await user.click(
      await screen.findByRole('button', { name: 'Confirmar eliminación' }),
    );

    // Assert
    await waitFor(() => expect(deletedId).toBe(fakeRatings.data[0].id));
  });
});
