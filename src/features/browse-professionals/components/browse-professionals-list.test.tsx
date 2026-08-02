import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { clientModeHandlers } from '@/test/msw/handlers/client-mode';
import { BrowseProfessionalsList } from './browse-professionals-list';

function renderList() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowseProfessionalsList />
    </QueryClientProvider>,
  );
}

describe('BrowseProfessionalsList', () => {
  beforeEach(() => {
    server.use(...clientModeHandlers);
  });

  it('muestra los profesionales disponibles con su calificación', async () => {
    // Arrange & Act
    renderList();

    // Assert
    expect(await screen.findByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('⭐ 4.8')).toBeInTheDocument();
  });
});
