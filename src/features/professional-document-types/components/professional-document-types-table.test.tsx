import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { professionalDocumentTypesHandlers } from '@/test/msw/handlers/professional-document-types';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { ProfessionalDocumentTypesTable } from './professional-document-types-table';

beforeEach(() => {
  server.use(...professionalDocumentTypesHandlers);
});

function renderTable() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfessionalDocumentTypesTable />
    </QueryClientProvider>,
  );
}

describe('ProfessionalDocumentTypesTable', () => {
  it('muestra las filas del catálogo una vez cargadas', async () => {
    // Arrange & Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('Antecedentes policiales'),
    ).toBeInTheDocument();
    expect(screen.getByText('Título técnico')).toBeInTheDocument();
  });

  it('permite activar/desactivar un tipo desde el switch', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.patch(
        '/api/backend/admin/professional-document-types/:referenceId',
        async ({ params, request }) => {
          const body = (await request.json()) as { isActive?: boolean };
          onRequest(params.referenceId, body.isActive);
          return HttpResponse.json({
            referenceId: params.referenceId,
            code: 'BG_CHECK_CRIMINAL_PY',
            name: 'Antecedentes policiales',
            category: 'BACKGROUND_CHECK',
            isRequired: true,
            requiresStaffReview: true,
            isVisibleToClient: false,
            sortOrder: 0,
            isActive: false,
          });
        },
      ),
    );
    renderTable();
    await screen.findByText('Antecedentes policiales');

    // Act
    await user.click(
      screen.getByRole('switch', {
        name: 'Desactivar Antecedentes policiales',
      }),
    );

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith('type-1', false);
    });
  });

  it('muestra un mensaje vacío cuando no hay tipos configurados', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professional-document-types', () =>
        HttpResponse.json({ data: [] }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText(
        'Todavía no hay tipos de documento configurados.',
      ),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professional-document-types', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderTable();

    // Assert
    expect(
      await screen.findByText('No se pudo cargar el catálogo.'),
    ).toBeInTheDocument();
  });
});
