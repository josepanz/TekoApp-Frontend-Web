import { QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/test/render';
import { createTestQueryClient } from '@/test/query-client';
import { AvatarUpload } from './avatar-upload';

function renderComponent(onUploaded = vi.fn()) {
  const queryClient = createTestQueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <AvatarUpload
        name="Ana González"
        currentAvatarUrl={null}
        onUploaded={onUploaded}
      />
    </QueryClientProvider>,
  );
  return { onUploaded };
}

describe('AvatarUpload', () => {
  it('muestra las iniciales del nombre cuando no hay foto', () => {
    // Arrange & Act
    renderComponent();

    // Assert
    expect(screen.getByText('AG')).toBeInTheDocument();
  });

  it('sube el archivo elegido y notifica la key resultante', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onUploaded } = renderComponent();
    const file = new File(['contenido'], 'foto.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText('Subir foto de perfil');

    // Act
    await user.upload(input, file);

    // Assert
    await vi.waitFor(() => {
      expect(onUploaded).toHaveBeenCalledWith('a1b2c3.jpg');
    });
  });
});
