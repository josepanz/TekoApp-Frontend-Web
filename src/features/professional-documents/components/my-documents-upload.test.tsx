import { QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@/test/render';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import {
  buildMyDocumentStatus,
  buildProfessionalDocument,
  professionalDocumentsHandlers,
} from '@/test/msw/handlers/professional-documents';
import { buildProfessionalDocumentType } from '@/test/msw/handlers/professional-document-types';
import { MyDocumentsUpload } from './my-documents-upload';

function renderComponent() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MyDocumentsUpload />
    </QueryClientProvider>,
  );
}

describe('MyDocumentsUpload', () => {
  beforeEach(() => {
    server.use(...professionalDocumentsHandlers);
  });

  it('muestra cada tipo de documento aplicable con su estado', async () => {
    // Arrange & Act
    renderComponent();

    // Assert
    expect(
      await screen.findByText('Antecedentes policiales'),
    ).toBeInTheDocument();
    expect(screen.getByText('Obligatorio')).toBeInTheDocument();
    expect(screen.getByText('Título técnico')).toBeInTheDocument();
    expect(screen.getByText('Opcional')).toBeInTheDocument();
    expect(screen.getByText('Aprobado')).toBeInTheDocument();
  });

  it('muestra el motivo de rechazo cuando un documento fue rechazado', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professionals/me/documents', () =>
        HttpResponse.json({
          data: [
            buildMyDocumentStatus({
              documentType: buildProfessionalDocumentType(),
              document: buildProfessionalDocument({
                status: 'REJECTED',
                rejectionReason: 'Foto ilegible',
              }),
            }),
          ],
        }),
      ),
    );

    // Act
    renderComponent();

    // Assert
    expect(
      await screen.findByText('Motivo de rechazo: Foto ilegible'),
    ).toBeInTheDocument();
  });

  it('sube un archivo nuevo para un tipo de documento sin cargar', async () => {
    // Arrange: los handlers por default son fixtures estáticos — para observar el efecto de la
    // subida (la query se invalida y refetchea) hace falta un handler con estado propio para
    // este test puntual, que refleje el documento recién creado en el siguiente GET.
    let hasDocument = false;
    server.use(
      http.get('/api/backend/professionals/me/documents', () =>
        HttpResponse.json({
          data: [
            buildMyDocumentStatus({
              document: hasDocument
                ? buildProfessionalDocument({ status: 'PENDING' })
                : undefined,
            }),
          ],
        }),
      ),
      http.post('/api/backend/professionals/me/documents', () => {
        hasDocument = true;
        return HttpResponse.json(
          buildProfessionalDocument({ status: 'PENDING' }),
          { status: 201 },
        );
      }),
    );
    const user = userEvent.setup();
    renderComponent();
    const file = new File(['contenido'], 'antecedentes.pdf', {
      type: 'application/pdf',
    });
    const input = await screen.findByLabelText(
      'Archivo para Antecedentes policiales',
    );

    // Act
    await user.upload(input, file);

    // Assert: tras subir, el tipo pasa a mostrar el botón "Reemplazar" en vez de "Subir"
    await screen.findByRole('button', { name: 'Reemplazar' });
  });
});
