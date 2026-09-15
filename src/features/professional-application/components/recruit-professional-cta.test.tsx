import { QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/render';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { professionalModeHandlers } from '@/test/msw/handlers/professional-mode';
import { RecruitProfessionalCta } from './recruit-professional-cta';

function renderCta() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <RecruitProfessionalCta />
    </QueryClientProvider>,
  );
}

describe('RecruitProfessionalCta', () => {
  it('muestra la invitación a postularse si el usuario no es profesional', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/professionals/me', () =>
        HttpResponse.json(
          { message: 'Profesional no encontrado' },
          { status: 404 },
        ),
      ),
    );

    // Act
    renderCta();

    // Assert
    expect(
      await screen.findByText('¿Querés trabajar con nosotros?'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Postulate como profesional' }),
    ).toHaveAttribute('href', '/postularme-como-profesional');
  });

  it('no muestra nada si el usuario ya tiene perfil profesional', async () => {
    // Arrange
    server.use(...professionalModeHandlers);

    // Act
    const { container } = renderCta();

    // Assert
    await vi.waitFor(() => expect(container).toBeEmptyDOMElement());
  });
});
