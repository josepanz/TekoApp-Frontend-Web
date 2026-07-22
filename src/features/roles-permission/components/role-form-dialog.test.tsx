import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { Button } from '@/components/ui/button';
import { rolesHandlers } from '@/test/msw/handlers/roles';
import { createTestQueryClient } from '@/test/query-client';
import { server } from '@/test/msw/server';
import { RoleFormDialog } from './role-form-dialog';

function renderDialog() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <RoleFormDialog trigger={<Button>Nuevo rol</Button>} />
    </QueryClientProvider>,
  );
}

describe('RoleFormDialog', () => {
  beforeEach(() => {
    server.use(...rolesHandlers);
  });

  it('exige seleccionar al menos un permiso antes de poder enviar el formulario', async () => {
    // Arrange
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole('button', { name: 'Nuevo rol' }));
    await user.type(await screen.findByLabelText('Nombre'), 'SupportAgent');

    // Act
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    // Assert
    expect(
      await screen.findByText('Seleccioná al menos un permiso'),
    ).toBeInTheDocument();
  });

  it('al crear un rol, envía a la mutation solo nombre y descripción (el backend todavía no acepta permisos)', async () => {
    // Arrange
    let capturedBody: unknown;
    server.use(
      http.post('/api/backend/roles', async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json(
          {
            id: 99,
            name: 'SupportAgent',
            displayName: 'SupportAgent',
            description: 'Descripción de prueba',
            isActive: true,
            createdAt: '2026-01-01T00:00:00Z',
            createdBy: 'admin@correo.com.py',
            lastChangedAt: null,
            lastChangedBy: null,
          },
          { status: 201 },
        );
      }),
    );
    const user = userEvent.setup();
    renderDialog();
    await user.click(screen.getByRole('button', { name: 'Nuevo rol' }));
    await user.type(await screen.findByLabelText('Nombre'), 'SupportAgent');
    await user.type(
      screen.getByLabelText('Descripción'),
      'Descripción de prueba',
    );
    await user.click(screen.getByRole('checkbox', { name: 'DASHBOARD' }));

    // Act
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    // Assert
    await waitFor(() => {
      expect(capturedBody).toEqual({
        name: 'SupportAgent',
        description: 'Descripción de prueba',
      });
    });
  });
});
