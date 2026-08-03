import { QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/render';
import { createTestQueryClient } from '@/test/query-client';
import { UserDetailDialog } from './user-detail-dialog';

function renderDialog(referenceId: string | null) {
  const queryClient = createTestQueryClient();
  const onOpenChange = vi.fn();
  render(
    <QueryClientProvider client={queryClient}>
      <UserDetailDialog referenceId={referenceId} onOpenChange={onOpenChange} />
    </QueryClientProvider>,
  );
  return { onOpenChange };
}

describe('UserDetailDialog', () => {
  it('no muestra el diálogo cuando no hay un referenceId seleccionado', () => {
    // Arrange & Act
    renderDialog(null);

    // Assert
    expect(screen.queryByText('Detalle de usuario')).not.toBeInTheDocument();
  });

  it('carga y muestra los datos del usuario seleccionado', async () => {
    // Arrange & Act
    renderDialog('ref-001');

    // Assert
    expect(
      await screen.findByDisplayValue('Ana', undefined, { timeout: 3000 }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText('ana.gonzalez@example.com')).toBeInTheDocument(),
    );
  });
});
