import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestQueryClient } from '@/test/query-client';
import { RegisterForm } from './register-form';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

function renderRegisterForm() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <RegisterForm />
    </QueryClientProvider>,
  );
}

async function fillValidForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<Record<'email', string>> = {},
) {
  await user.type(screen.getByLabelText('Nombre'), 'Ana');
  await user.type(screen.getByLabelText('Apellido'), 'García');
  await user.type(
    screen.getByLabelText('Email'),
    overrides.email ?? 'ana@tekoapp.com.py',
  );
  await user.type(screen.getByLabelText('Teléfono'), '0981234567');
  await user.type(screen.getByLabelText('Contraseña'), 'Sup3rSecreto!');
  await user.type(
    screen.getByLabelText('Confirmar contraseña'),
    'Sup3rSecreto!',
  );
  await user.click(
    screen.getByRole('checkbox', {
      name: 'Acepto los términos y condiciones',
    }),
  );
}

describe('RegisterForm', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('muestra errores de validación si se envía el formulario vacío', async () => {
    // Arrange
    const user = userEvent.setup();
    renderRegisterForm();

    // Act
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    // Assert
    expect(
      await screen.findByText('El nombre es obligatorio'),
    ).toBeInTheDocument();
    expect(screen.getByText('El apellido es obligatorio')).toBeInTheDocument();
    expect(
      screen.getByText('Debés aceptar los términos y condiciones'),
    ).toBeInTheDocument();
  });

  it('muestra un error cuando las contraseñas no coinciden', async () => {
    // Arrange
    const user = userEvent.setup();
    renderRegisterForm();

    // Act
    await user.type(screen.getByLabelText('Contraseña'), 'Sup3rSecreto!');
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'OtraCosa!');
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    // Assert
    expect(
      await screen.findByText('Las contraseñas no coinciden'),
    ).toBeInTheDocument();
  });

  it('redirige al login cuando el registro es exitoso', async () => {
    // Arrange
    const user = userEvent.setup();
    renderRegisterForm();

    // Act
    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    // Assert
    await vi.waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith('/login?registered=1'),
    );
  });

  it('muestra un mensaje de error si el backend rechaza el registro', async () => {
    // Arrange
    const user = userEvent.setup();
    renderRegisterForm();

    // Act
    await fillValidForm(user, { email: 'ya-existe@tekoapp.com.py' });
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }));

    // Assert
    expect(
      await screen.findByText('El email ya está registrado'),
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
