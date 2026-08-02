import { QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@/test/render';
import { createTestQueryClient } from '@/test/query-client';
import type { SessionUser } from '@/core/auth/session';
import { ProfileForm } from './profile-form';

const session: SessionUser = {
  referenceId: 'ref-1',
  email: 'ana.gonzalez@example.com',
  firstName: 'Ana',
  lastName: 'González',
  avatarUrl: null,
  accessLevelId: 1,
  userStatus: 'ACTIVE',
  profileStatus: 'COMPLETE',
  permissions: [],
  roles: [],
};

function renderForm() {
  const queryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <ProfileForm session={session} />
    </QueryClientProvider>,
  );
}

describe('ProfileForm', () => {
  it('precarga el nombre y apellido de la sesión actual', () => {
    // Arrange & Act
    renderForm();

    // Assert
    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana');
    expect(screen.getByLabelText('Apellido')).toHaveValue('González');
  });

  it('el botón de guardar queda deshabilitado hasta que se modifica un campo', async () => {
    // Arrange
    const user = userEvent.setup();
    renderForm();
    const saveButton = screen.getByRole('button', {
      name: 'Guardar cambios',
    });

    // Assert (estado inicial)
    expect(saveButton).toBeDisabled();

    // Act
    await user.type(screen.getByLabelText('Teléfono'), '+595981234567');

    // Assert
    await waitFor(() => expect(saveButton).toBeEnabled());
  });
});
