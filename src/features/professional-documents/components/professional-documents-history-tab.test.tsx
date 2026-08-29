import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  buildProfessionalDocument,
  professionalDocumentsHandlers,
} from '@/test/msw/handlers/professional-documents';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { ProfessionalDocumentsHistoryTab } from './professional-documents-history-tab';

beforeEach(() => {
  server.use(...professionalDocumentsHandlers);
});

function renderTab(professionalReferenceId = 'prof-1') {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfessionalDocumentsHistoryTab
        professionalReferenceId={professionalReferenceId}
      />
    </QueryClientProvider>,
  );
}

describe('ProfessionalDocumentsHistoryTab', () => {
  it('muestra el nombre y la categoría de cada documento del historial', async () => {
    // Arrange & Act
    renderTab();

    // Assert
    expect(
      await screen.findByText('Antecedentes policiales'),
    ).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('muestra el motivo de rechazo cuando el documento fue rechazado', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/professionals/:referenceId/documents', () =>
        HttpResponse.json({
          data: [
            buildProfessionalDocument({
              status: 'REJECTED',
              rejectionReason: 'Foto ilegible',
            }),
          ],
        }),
      ),
    );

    // Act
    renderTab();

    // Assert
    expect(
      await screen.findByText('Motivo: Foto ilegible'),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje vacío cuando el profesional no cargó documentos', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/professionals/:referenceId/documents', () =>
        HttpResponse.json({ data: [] }),
      ),
    );

    // Act
    renderTab();

    // Assert
    expect(
      await screen.findByText(
        'Este profesional todavía no cargó ningún documento.',
      ),
    ).toBeInTheDocument();
  });

  it('muestra un mensaje de error si la carga del historial falla', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/admin/professionals/:referenceId/documents', () =>
        HttpResponse.json({ message: 'Error interno' }, { status: 500 }),
      ),
    );

    // Act
    renderTab();

    // Assert
    expect(
      await screen.findByText('No se pudo cargar el historial de documentos.'),
    ).toBeInTheDocument();
  });
});
