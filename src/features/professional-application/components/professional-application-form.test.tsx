import { QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/render';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { clientModeHandlers } from '@/test/msw/handlers/client-mode';
import { professionalModeHandlers } from '@/test/msw/handlers/professional-mode';
import { ProfessionalApplicationForm } from './professional-application-form';

const mockReplace = vi.fn();
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

function renderForm() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfessionalApplicationForm />
    </QueryClientProvider>,
  );
}

describe('ProfessionalApplicationForm', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();
    server.use(...clientModeHandlers);
    // Sin perfil profesional por default — mismo patrón que professional-gate.test.tsx.
    server.use(
      http.get('/api/backend/professionals/me', () =>
        HttpResponse.json(
          { message: 'Profesional no encontrado' },
          { status: 404 },
        ),
      ),
    );
  });

  it('redirige a /pro si el usuario ya tiene perfil profesional', async () => {
    // Arrange
    server.use(...professionalModeHandlers);

    // Act
    renderForm();

    // Assert
    await vi.waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/pro'));
  });

  it('muestra errores de validación si se envía sin completar los campos obligatorios', async () => {
    // Arrange
    const user = userEvent.setup();
    renderForm();
    await screen.findByLabelText('Categoría');

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Enviar postulación' }),
    );

    // Assert: "Elegí una categoría" también es el placeholder del selector, así que se busca
    // puntualmente el párrafo de error (no cualquier elemento con ese texto).
    expect(
      await screen.findByText('Elegí una categoría', { selector: 'p' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('La descripción es obligatoria'),
    ).toBeInTheDocument();
  });

  it('crea el perfil profesional y muestra el mensaje de éxito', async () => {
    // Arrange
    const user = userEvent.setup();
    server.use(
      http.post('/api/backend/professionals', () =>
        HttpResponse.json(
          { id: 5, referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          { status: 201 },
        ),
      ),
    );
    renderForm();
    await screen.findByLabelText('Categoría');

    // Act
    await user.click(screen.getByLabelText('Categoría'));
    await user.click(await screen.findByRole('option', { name: 'Plomería' }));
    await user.type(
      screen.getByLabelText('Descripción'),
      'Electricista con 5 años de experiencia',
    );
    await user.type(screen.getByLabelText('Tarifa por hora'), '50000');
    await user.click(
      screen.getByRole('button', { name: 'Enviar postulación' }),
    );

    // Assert
    expect(
      await screen.findByText('¡Postulación enviada!'),
    ).toBeInTheDocument();

    // Act: el CTA de éxito navega al perfil profesional propio
    await user.click(
      screen.getByRole('button', { name: 'Ir a mi perfil profesional' }),
    );
    expect(mockPush).toHaveBeenCalledWith('/pro');
  });
});
