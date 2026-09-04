import { QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@/test/render';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { professionalModeHandlers } from '@/test/msw/handlers/professional-mode';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ModeSwitcher } from './mode-switcher';

function renderSwitcher(current: 'client' | 'pro' | 'admin' = 'client') {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <ModeSwitcher current={current} />
      </SidebarProvider>
    </QueryClientProvider>,
  );
}

describe('ModeSwitcher', () => {
  beforeEach(() => {
    // Sin perfil profesional por default (ver professional-gate.test.tsx para el mismo patrón) —
    // auth/scope ya devuelve sin permisos por default (src/test/msw/handlers/auth.ts).
    server.use(
      http.get('/api/backend/professionals/me', () =>
        HttpResponse.json(
          { message: 'Profesional no encontrado' },
          { status: 404 },
        ),
      ),
    );
  });

  it('no renderiza nada si el usuario no tiene ningún otro modo disponible', async () => {
    // Arrange & Act
    renderSwitcher('client');

    // Assert
    await waitFor(() => expect(screen.queryAllByRole('link')).toHaveLength(0));
  });

  it('muestra el link a modo profesional si el usuario tiene perfil profesional', async () => {
    // Arrange
    server.use(...professionalModeHandlers);

    // Act
    renderSwitcher('client');

    // Assert
    expect(
      await screen.findByRole('link', { name: /modo profesional/i }),
    ).toHaveAttribute('href', '/pro');
  });

  it('muestra el link al panel de administración si el usuario es staff', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/auth/scope', () =>
        HttpResponse.json({ permissions: [{ name: 'admin:all' }], roles: [] }),
      ),
    );

    // Act
    renderSwitcher('client');

    // Assert
    expect(
      await screen.findByRole('link', { name: /panel de administración/i }),
    ).toHaveAttribute('href', '/admin');
  });

  it('no ofrece el modo actual como opción', async () => {
    // Arrange
    server.use(...professionalModeHandlers);

    // Act
    renderSwitcher('pro');

    // Assert: solo "Modo cliente" debería aparecer, nunca "Modo profesional" (es el actual)
    expect(
      await screen.findByRole('link', { name: /modo cliente/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /modo profesional/i }),
    ).not.toBeInTheDocument();
  });
});
