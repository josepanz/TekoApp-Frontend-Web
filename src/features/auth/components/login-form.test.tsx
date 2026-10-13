/**
 * Casos: CP-WEB-AUTH-005 agregado (ver test/qa/casos/CP-AUTH.md). Tipo: unitaria (componente) P0.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTestQueryClient } from '@/test/query-client';
import { LoginForm } from './login-form';

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
  useSearchParams: () => new URLSearchParams(),
}));

function renderLoginForm() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>,
  );
}

describe('LoginForm', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
  });

  it('muestra errores de validación si se envía el formulario vacío', async () => {
    // Arrange
    const user = userEvent.setup();
    renderLoginForm();

    // Act
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    // Assert
    expect(
      await screen.findByText('El email es obligatorio'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('La contraseña es obligatoria'),
    ).toBeInTheDocument();
  });

  it('redirige al dashboard cuando el login es exitoso', async () => {
    // Arrange
    const user = userEvent.setup();
    renderLoginForm();

    // Act
    await user.type(screen.getByLabelText('Email'), 'ana@tekoapp.com.py');
    await user.type(screen.getByLabelText('Contraseña'), 'Sup3rSecreto!');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    // Assert
    await vi.waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('muestra un mensaje de error si el backend rechaza las credenciales', async () => {
    // Arrange
    const user = userEvent.setup();
    renderLoginForm();

    // Act
    await user.type(screen.getByLabelText('Email'), 'fail@tekoapp.com.py');
    await user.type(screen.getByLabelText('Contraseña'), 'loQueSea');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    // Assert
    expect(
      await screen.findByText('Email o contraseña incorrectos.'),
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  // CP-WEB-AUTH-005 (regresion bug W1): 200 con login:false no debe redirigir como exito.
  it('no redirige y muestra error ante 200 con login:false', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({
          success: true,
          data: { login: false, requiredNewPassword: true },
        }),
      ),
    );
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText('Email'), 'legacy@tekoapp.com.py');
    await user.type(screen.getByLabelText('Contraseña'), 'loQueSea');
    await user.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(
      await screen.findByText(/necesita crear una contraseña/),
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
