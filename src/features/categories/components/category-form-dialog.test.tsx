import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildCategory,
  categoriesHandlers,
} from '@/test/msw/handlers/categories';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { CategoryFormDialog } from './category-form-dialog';
import type { Category } from '../api';

// El agregador central `src/test/msw/handlers.ts` todavía no incluye este dominio (lo integra
// otro equipo), así que los handlers se registran acá con `server.use`.
beforeEach(() => {
  server.use(...categoriesHandlers);
});

function renderDialog(category?: Category) {
  const queryClient = createTestQueryClient();
  const onOpenChange = vi.fn();
  render(
    <QueryClientProvider client={queryClient}>
      <CategoryFormDialog
        open
        onOpenChange={onOpenChange}
        category={category}
      />
    </QueryClientProvider>,
  );
  return { onOpenChange };
}

describe('CategoryFormDialog', () => {
  it('envía el payload correcto a la mutation al crear una categoría nueva', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    server.use(
      http.post('/api/backend/categories', async ({ request }) => {
        const body = await request.json();
        onRequest(body);
        return HttpResponse.json(buildCategory({ id: 50 }), { status: 201 });
      }),
    );
    renderDialog();

    // Act
    await user.type(screen.getByLabelText('Nombre'), 'Carpintería');
    await user.type(screen.getByLabelText('Slug'), 'carpinteria');
    await user.type(screen.getByLabelText('Ícono'), 'hammer-outline');
    await user.type(screen.getByLabelText('Color'), '#8e44ad');
    await user.click(screen.getByRole('button', { name: 'Crear categoría' }));

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith({
        name: 'Carpintería',
        slug: 'carpinteria',
        icon: 'hammer-outline',
        color: '#8e44ad',
        sortOrder: 0,
        status: 'ACTIVE',
        isVisible: true,
        requiresVerification: false,
        maxBudgetOptionsPerRequest: 3,
      });
    });
  });

  it('muestra un error de validación cuando el nombre está vacío', async () => {
    // Arrange
    const user = userEvent.setup();
    renderDialog();

    // Act
    await user.click(screen.getByRole('button', { name: 'Crear categoría' }));

    // Assert
    expect(
      await screen.findByText('El nombre es obligatorio'),
    ).toBeInTheDocument();
  });

  it('muestra un error de validación cuando el color no es un hexadecimal válido', async () => {
    // Arrange
    const user = userEvent.setup();
    renderDialog();

    // Act
    await user.type(screen.getByLabelText('Nombre'), 'Carpintería');
    await user.type(screen.getByLabelText('Color'), 'no-es-un-color');
    await user.click(screen.getByRole('button', { name: 'Crear categoría' }));

    // Assert
    expect(
      await screen.findByText(
        'El color debe ser un hexadecimal válido (ej. #2ecc71)',
      ),
    ).toBeInTheDocument();
  });

  it('conserva los campos no editados del formulario al actualizar una categoría existente', async () => {
    // Arrange
    const user = userEvent.setup();
    const onRequest = vi.fn();
    const category = buildCategory({
      id: 2,
      name: 'Electricidad',
      slug: 'electricidad',
      sortOrder: 1,
      requiresVerification: true,
    });
    server.use(
      http.patch('/api/backend/categories/:id', async ({ request }) => {
        const body = await request.json();
        onRequest(body);
        return HttpResponse.json({ ...category, ...(body as object) });
      }),
    );
    renderDialog(category);

    // Act
    const nameInput = await screen.findByLabelText('Nombre');
    await user.clear(nameInput);
    await user.type(nameInput, 'Electricidad residencial');
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }));

    // Assert
    await waitFor(() => {
      expect(onRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Electricidad residencial',
          sortOrder: 1,
          requiresVerification: true,
        }),
      );
    });
  });
});
