import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dataRetentionPoliciesHandlers } from '@/test/msw/handlers/data-retention-policies';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { RetentionPoliciesTable } from './retention-policies-table';

beforeEach(() => {
  server.use(...dataRetentionPoliciesHandlers);
});

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <RetentionPoliciesTable />
    </QueryClientProvider>,
  );
}

describe('RetentionPoliciesTable', () => {
  it('muestra las políticas configuradas una vez cargadas', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(await screen.findByText('365 días')).toBeInTheDocument();
    expect(screen.getByText('Indefinida')).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando no hay políticas configuradas', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/legal/retention-policies', () =>
        HttpResponse.json([]),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('Todavía no hay políticas configuradas.'),
    ).toBeInTheDocument();
  });

  it('permite editar los días de retención de una política existente', async () => {
    // Arrange
    const user = userEvent.setup();
    const onUpsert = vi.fn();
    server.use(
      http.patch(
        '/api/backend/admin/legal/retention-policies',
        async ({ request }) => {
          const body = (await request.json()) as { retentionDays?: number };
          onUpsert(body.retentionDays);
          return HttpResponse.json({
            referenceId: 'policy-1',
            countryId: undefined,
            contentType: 'IMAGE',
            retentionDays: body.retentionDays,
            allowsUserDeletion: true,
            requiresLegalHold: false,
          });
        },
      ),
    );
    renderTable();
    await screen.findByText('365 días');

    // Act
    const editButtons = await screen.findAllByRole('button', {
      name: 'Editar',
    });
    await user.click(editButtons[0]);
    const retentionInput = await screen.findByLabelText('Días de retención');
    await user.clear(retentionInput);
    await user.type(retentionInput, '30');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    // Assert
    await waitFor(() => {
      expect(onUpsert).toHaveBeenCalledWith(30);
    });
  });

  it('abre el diálogo de creación al hacer clic en "Nueva política"', async () => {
    // Arrange
    const user = userEvent.setup();
    renderTable();
    await screen.findByText('365 días');

    // Act
    await user.click(screen.getByRole('button', { name: 'Nueva política' }));

    // Assert
    expect(
      await screen.findByText('Nueva política de retención'),
    ).toBeInTheDocument();
  });
});
