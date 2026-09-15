import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import type { SessionUser } from '@/core/auth/session';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { AccountDeletionSection } from './account-deletion-section';

const baseSession: SessionUser = {
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
  deletionScheduledAt: null,
};

function renderSection(session: SessionUser = baseSession) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AccountDeletionSection session={session} />
    </QueryClientProvider>,
  );
}

async function openConfirmStep(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Eliminar mi cuenta' }));
  await user.click(await screen.findByRole('button', { name: 'Continuar' }));
}

describe('AccountDeletionSection', () => {
  it('muestra el botón de borrado cuando no hay una solicitud activa', () => {
    // Arrange & Act
    renderSection();

    // Assert
    expect(
      screen.getByRole('button', { name: 'Eliminar mi cuenta' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Eliminación pendiente')).not.toBeInTheDocument();
  });

  it('muestra el banner de eliminación pendiente si ya hay una solicitud activa', () => {
    // Arrange & Act
    renderSection({
      ...baseSession,
      deletionScheduledAt: '2026-09-25T00:00:00.000Z',
    });

    // Assert
    expect(screen.getByText('Eliminación pendiente')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Cancelar eliminación' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Eliminar mi cuenta' }),
    ).not.toBeInTheDocument();
  });

  it('el paso de confirmación exige el checkbox antes de habilitar el envío', async () => {
    // Arrange
    const user = userEvent.setup();
    renderSection();

    // Act
    await openConfirmStep(user);

    // Assert
    const submit = screen.getByRole('button', {
      name: 'Confirmar eliminación',
    });
    expect(submit).toBeDisabled();

    await user.click(
      screen.getByRole('checkbox', {
        name: 'Entiendo que, pasado el plazo de gracia, esta acción no se puede deshacer.',
      }),
    );
    expect(submit).not.toBeDisabled();
  });

  it('al confirmar exitosamente, cierra el diálogo y muestra el banner con la fecha real', async () => {
    // Arrange
    server.use(
      http.post('/api/backend/auth/me/deletion-request', () =>
        HttpResponse.json({
          status: 'PENDING_DELETION',
          deletionRequestedAt: '2026-09-11T00:00:00.000Z',
          deletionScheduledAt: '2026-09-25T00:00:00.000Z',
        }),
      ),
    );
    const user = userEvent.setup();
    renderSection();
    await openConfirmStep(user);
    await user.click(
      screen.getByRole('checkbox', {
        name: 'Entiendo que, pasado el plazo de gracia, esta acción no se puede deshacer.',
      }),
    );

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Confirmar eliminación' }),
    );

    // Assert
    expect(
      await screen.findByText('Eliminación pendiente'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Confirmá la eliminación'),
    ).not.toBeInTheDocument();
  });

  it('si el backend responde 409 DELETION_BLOCKED, muestra los bloqueantes y no cierra el diálogo', async () => {
    // Arrange
    server.use(
      http.post('/api/backend/auth/me/deletion-request', () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              code: 409,
              message: 'No se puede eliminar la cuenta',
              error: 'Conflict',
              errorCode: 'DELETION_BLOCKED',
              details: {
                blockers: [
                  { type: 'ACTIVE_SERVICE', count: 1 },
                  { type: 'PENDING_PAYMENT', count: 2 },
                ],
              },
            },
          },
          { status: 409 },
        ),
      ),
    );
    const user = userEvent.setup();
    renderSection();
    await openConfirmStep(user);
    await user.click(
      screen.getByRole('checkbox', {
        name: 'Entiendo que, pasado el plazo de gracia, esta acción no se puede deshacer.',
      }),
    );

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Confirmar eliminación' }),
    );

    // Assert
    expect(
      await screen.findByText('Tenés 1 servicio en curso'),
    ).toBeInTheDocument();
    expect(screen.getByText('Tenés 2 pagos pendientes')).toBeInTheDocument();
    expect(screen.getByText('Confirmá la eliminación')).toBeInTheDocument();
  });

  it('al cancelar una solicitud activa, el banner desaparece y vuelve a mostrarse el botón de borrado', async () => {
    // Arrange
    server.use(
      http.post('/api/backend/auth/me/deletion-request/cancel', () =>
        HttpResponse.json({ status: 'ACTIVE' }),
      ),
    );
    const user = userEvent.setup();
    renderSection({
      ...baseSession,
      deletionScheduledAt: '2026-09-25T00:00:00.000Z',
    });

    // Act
    await user.click(
      screen.getByRole('button', { name: 'Cancelar eliminación' }),
    );

    // Assert
    await waitFor(() => {
      expect(
        screen.queryByText('Eliminación pendiente'),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole('button', { name: 'Eliminar mi cuenta' }),
    ).toBeInTheDocument();
  });
});
