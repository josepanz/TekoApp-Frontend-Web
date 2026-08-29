import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { consentAuditHandlers } from '@/test/msw/handlers/consent-audit';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { ConsentAuditTabs } from './consent-audit-tabs';

beforeEach(() => {
  server.use(...consentAuditHandlers);
});

function renderTabs() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ConsentAuditTabs />
    </QueryClientProvider>,
  );
}

describe('ConsentAuditTabs', () => {
  it('muestra la pestaña de aceptaciones de términos por defecto', async () => {
    // Arrange & Act
    renderTabs();

    // Assert
    expect(await screen.findByText('Ana Gómez')).toBeInTheDocument();
  });

  it('cambia a la pestaña de consentimiento de contenido al hacer clic', async () => {
    // Arrange
    const user = userEvent.setup();
    renderTabs();
    await screen.findByText('Ana Gómez');

    // Act
    await user.click(
      screen.getByRole('tab', { name: 'Consentimiento de contenido' }),
    );

    // Assert
    expect(await screen.findByText('Juan Pérez')).toBeInTheDocument();
  });
});
