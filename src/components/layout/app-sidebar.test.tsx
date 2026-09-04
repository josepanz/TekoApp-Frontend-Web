import { QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/render';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { professionalModeHandlers } from '@/test/msw/handlers/professional-mode';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

function renderSidebar(variant: 'client' | 'pro' | 'admin' = 'client') {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar variant={variant} />
      </SidebarProvider>
    </QueryClientProvider>,
  );
}

describe('AppSidebar', () => {
  beforeEach(() => {
    // Sin perfil profesional por default — mismo patrón que mode-switcher.test.tsx.
    server.use(
      http.get('/api/backend/professionals/me', () =>
        HttpResponse.json(
          { message: 'Profesional no encontrado' },
          { status: 404 },
        ),
      ),
    );
  });

  it('no muestra el grupo "Cambiar de modo" si el usuario no tiene otro modo disponible', async () => {
    // Arrange & Act
    renderSidebar('client');

    // Assert: ni el label ni el separador quedan huérfanos en el DOM.
    await waitFor(() =>
      expect(screen.queryByText('Cambiar de modo')).not.toBeInTheDocument(),
    );
  });

  it('muestra el grupo "Cambiar de modo" con el link correspondiente si el usuario tiene 2+ modos', async () => {
    // Arrange
    server.use(...professionalModeHandlers);

    // Act
    renderSidebar('client');

    // Assert
    expect(await screen.findByText('Cambiar de modo')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /modo profesional/i }),
    ).toHaveAttribute('href', '/pro');
  });
});
