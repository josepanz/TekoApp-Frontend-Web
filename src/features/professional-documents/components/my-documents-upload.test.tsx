/**
 * Suite: subida de documentos propios del profesional (MyDocumentsUpload), incl. el flujo de
 * consentimiento requerido.
 * Casos: CP-WEB-ONB-001..002 (ver test/qa/casos/CP-ONB.md)
 * Tipo: unitaria (componente + MSW)   Prioridad: P1
 * Precondiciones: handlers MSW de professional-documents; sin backend real.
 * Trazabilidad: DEF-WEB-004 (403 CONSENT_REQUIRED sin forma de aceptar), plan maestro M3.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@/test/render';
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

  // CP-WEB-ONB-001 / DEF-WEB-004
  it('CP-WEB-ONB-001 ante 403 CONSENT_REQUIRED ofrece aceptar el consentimiento y reintenta la subida', async () => {
    // Arrange
    let uploads = 0;
    const accepted: string[] = [];
    server.use(
      http.post('/api/backend/professionals/me/documents', () => {
        uploads += 1;
        if (accepted.length === 0) {
          return HttpResponse.json(
            {
              success: false,
              error: {
                code: 403,
                message: 'Necesitás aceptar el documento legal vigente',
                error: 'Forbidden',
                errorCode: 'CONSENT_REQUIRED',
                timestamp: '2026-10-13T10:00:00.000Z',
                path: '/x',
              },
            },
            { status: 403 },
          );
        }
        return HttpResponse.json(buildProfessionalDocument(), { status: 201 });
      }),
      http.get('/api/backend/legal/consents/pending', () =>
        HttpResponse.json([
          {
            referenceId: 'v-datos',
            documentType: 'DATA_PROCESSING_CONSENT',
            version: 'v1',
            contentUrl: 'https://legal.example/datos',
            publishedAt: '2026-10-01T00:00:00.000Z',
            isActive: true,
          },
          {
            referenceId: 'v-imagen',
            documentType: 'IMAGE_USAGE_CONSENT',
            version: 'v1',
            contentUrl: 'https://legal.example/imagen',
            publishedAt: '2026-10-01T00:00:00.000Z',
            isActive: true,
          },
        ]),
      ),
      http.post(
        '/api/backend/legal/consents/:versionReferenceId/accept',
        ({ params }) => {
          accepted.push(String(params.versionReferenceId));
          return HttpResponse.json({ referenceId: 'c-1' }, { status: 201 });
        },
      ),
    );
    const user = userEvent.setup();
    renderComponent();
    const input = await screen.findByLabelText(
      'Archivo para Antecedentes policiales',
    );

    // Act
    await user.upload(
      input,
      new File(['x'], 'ant.pdf', { type: 'application/pdf' }),
    );
    const dialog = await screen.findByTestId('consent-required-dialog');
    await user.click(
      within(dialog).getByRole('button', { name: 'Acepto y continuar' }),
    );

    // Assert: acepta SOLO el consentimiento de datos y reintenta la subida con el mismo archivo
    await waitFor(() => expect(uploads).toBe(2));
    expect(accepted).toEqual(['v-datos']);
    await waitFor(() =>
      expect(screen.queryByTestId('consent-required-dialog')).toBeNull(),
    );
  });

  // CP-WEB-ONB-002 / DEF-WEB-004
  it('CP-WEB-ONB-002 si el usuario cancela el diálogo de consentimiento no reintenta la subida', async () => {
    // Arrange
    let uploads = 0;
    server.use(
      http.post('/api/backend/professionals/me/documents', () => {
        uploads += 1;
        return HttpResponse.json(
          {
            success: false,
            error: {
              code: 403,
              message: 'Necesitás aceptar el documento legal vigente',
              error: 'Forbidden',
              errorCode: 'CONSENT_REQUIRED',
              timestamp: '2026-10-13T10:00:00.000Z',
              path: '/x',
            },
          },
          { status: 403 },
        );
      }),
      http.get('/api/backend/legal/consents/pending', () =>
        HttpResponse.json([]),
      ),
    );
    const user = userEvent.setup();
    renderComponent();
    const input = await screen.findByLabelText(
      'Archivo para Antecedentes policiales',
    );

    // Act
    await user.upload(
      input,
      new File(['x'], 'ant.pdf', { type: 'application/pdf' }),
    );
    const dialog = await screen.findByTestId('consent-required-dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Cancelar' }));

    // Assert
    await waitFor(() =>
      expect(screen.queryByTestId('consent-required-dialog')).toBeNull(),
    );
    expect(uploads).toBe(1);
  });
});
