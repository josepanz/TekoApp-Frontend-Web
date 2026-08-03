import { QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/render';
import { createTestQueryClient } from '@/test/query-client';
import { server } from '@/test/msw/server';
import { PushSubscriptionToggle } from './push-subscription-toggle';

function renderToggle() {
  const queryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <PushSubscriptionToggle />
    </QueryClientProvider>,
  );
}

function stubPushSupport({
  permission = 'default' as NotificationPermission,
  existingSubscription = null as unknown,
}) {
  const toJSON = () => ({
    endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
    keys: { p256dh: 'p256dh-key', auth: 'auth-key' },
  });
  const unsubscribe = vi.fn().mockResolvedValue(true);

  const subscription = existingSubscription ?? { toJSON, unsubscribe };

  const pushManager = {
    getSubscription: vi.fn().mockResolvedValue(existingSubscription),
    subscribe: vi.fn().mockResolvedValue(subscription),
  };
  const registration = { pushManager };

  Object.defineProperty(window, 'PushManager', {
    value: function PushManagerStub() {},
    configurable: true,
  });
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      register: vi.fn().mockResolvedValue(registration),
      getRegistration: vi.fn().mockResolvedValue(registration),
    },
    configurable: true,
  });
  Object.defineProperty(window, 'Notification', {
    value: {
      permission,
      requestPermission: vi
        .fn()
        .mockResolvedValue(permission === 'denied' ? 'denied' : 'granted'),
    },
    configurable: true,
  });

  return { pushManager, unsubscribe };
}

describe('PushSubscriptionToggle', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    // @ts-expect-error -- limpiar el stub definido con defineProperty entre tests
    delete window.PushManager;
    // @ts-expect-error -- idem
    delete navigator.serviceWorker;
    // @ts-expect-error -- idem
    delete window.Notification;
  });

  it('no renderiza nada si el navegador no soporta Web Push', () => {
    // Arrange & Act
    renderToggle();

    // Assert
    expect(
      screen.queryByLabelText('Notificaciones push'),
    ).not.toBeInTheDocument();
  });

  it('muestra el toggle apagado cuando no hay suscripción activa', async () => {
    // Arrange
    stubPushSupport({ existingSubscription: null });

    // Act
    renderToggle();

    // Assert
    const toggle = await screen.findByRole('switch');
    await waitFor(() => expect(toggle).not.toBeChecked());
  });

  it('muestra el estado bloqueado cuando el permiso fue denegado', async () => {
    // Arrange
    stubPushSupport({ permission: 'denied' });

    // Act
    renderToggle();

    // Assert
    expect(
      await screen.findByText('Bloqueadas en la configuración del navegador.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true');
  });

  it('se suscribe y persiste el referenceId al activar el toggle', async () => {
    // Arrange
    const { pushManager } = stubPushSupport({ existingSubscription: null });
    const user = userEvent.setup();
    renderToggle();
    const toggle = await screen.findByRole('switch');
    await waitFor(() => expect(toggle).toBeEnabled());

    // Act
    await user.click(toggle);

    // Assert
    await waitFor(() => expect(pushManager.subscribe).toHaveBeenCalled());
    await waitFor(() =>
      expect(localStorage.getItem('teko-push-subscription-reference-id')).toBe(
        'push-sub-ref-1',
      ),
    );
  });

  it('se da de baja y limpia el referenceId al desactivar el toggle', async () => {
    // Arrange
    const existingSubscription = {
      toJSON: () => ({
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
        keys: { p256dh: 'p256dh-key', auth: 'auth-key' },
      }),
      unsubscribe: vi.fn().mockResolvedValue(true),
    };
    stubPushSupport({ existingSubscription });
    localStorage.setItem(
      'teko-push-subscription-reference-id',
      'push-sub-ref-1',
    );
    let deleteCalled = false;
    server.use(
      http.delete(
        '/api/backend/notifications/push-subscriptions/:referenceId',
        () => {
          deleteCalled = true;
          return new HttpResponse(null, { status: 204 });
        },
      ),
    );
    const user = userEvent.setup();
    renderToggle();
    const toggle = await screen.findByRole('switch');
    await waitFor(() => expect(toggle).toBeChecked());

    // Act
    await user.click(toggle);

    // Assert
    await waitFor(() =>
      expect(existingSubscription.unsubscribe).toHaveBeenCalled(),
    );
    await waitFor(() => expect(deleteCalled).toBe(true));
    await waitFor(() =>
      expect(
        localStorage.getItem('teko-push-subscription-reference-id'),
      ).toBeNull(),
    );
  });
});
