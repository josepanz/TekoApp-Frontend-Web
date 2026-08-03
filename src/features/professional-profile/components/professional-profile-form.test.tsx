import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@/test/render';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { professionalModeHandlers } from '@/test/msw/handlers/professional-mode';
import { ProfessionalProfileForm } from './professional-profile-form';

function renderForm() {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ProfessionalProfileForm />
    </QueryClientProvider>,
  );
}

describe('ProfessionalProfileForm', () => {
  beforeEach(() => {
    server.use(...professionalModeHandlers);
  });

  it('precarga el formulario con los datos del perfil profesional propio', async () => {
    // Arrange & Act
    renderForm();

    // Assert
    expect(
      await screen.findByDisplayValue('Plomero con 10 años de experiencia'),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
    expect(screen.getByText('Plomería')).toBeInTheDocument();
  });
});
