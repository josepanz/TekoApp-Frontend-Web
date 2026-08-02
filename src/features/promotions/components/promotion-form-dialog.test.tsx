import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@/test/render';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import {
  promotionsHandlers,
  buildPromotion,
} from '@/test/msw/handlers/promotions';
import { server } from '@/test/msw/server';
import { createTestQueryClient } from '@/test/query-client';
import { PromotionFormDialog } from './promotion-form-dialog';

// El agregador central `src/test/msw/handlers.ts` todavía no incluye este dominio (lo integra
// otro equipo), así que los handlers se registran acá con `server.use`.
function renderDialog(props: Parameters<typeof PromotionFormDialog>[0]) {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <PromotionFormDialog {...props} />
    </QueryClientProvider>,
  );
}

describe('PromotionFormDialog', () => {
  it('envía el payload correcto al crear una promoción', async () => {
    // Arrange
    const user = userEvent.setup();
    server.use(...promotionsHandlers);
    let capturedBody: Record<string, unknown> | undefined;
    server.use(
      http.post('/api/backend/promotions', async ({ request }) => {
        capturedBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(buildPromotion(), { status: 201 });
      }),
    );
    renderDialog({ trigger: <button type="button">Nueva promoción</button> });

    // Act
    await user.click(screen.getByRole('button', { name: 'Nueva promoción' }));
    await user.type(await screen.findByLabelText('Código'), 'VERANO25');
    await user.type(screen.getByLabelText('Nombre'), 'Promo Verano');
    const discountInput = screen.getByLabelText('Valor del descuento');
    await user.clear(discountInput);
    await user.type(discountInput, '15');
    // input[type=date] no se completa de forma confiable con user.type en jsdom (no soporta el
    // widget nativo de fecha) — se setea el valor directo, como excepción puntual documentada en
    // rules/test.md.
    fireEvent.change(screen.getByLabelText('Vigente desde'), {
      target: { value: '2025-01-01' },
    });
    fireEvent.change(screen.getByLabelText('Vigente hasta'), {
      target: { value: '2025-06-01' },
    });
    await user.click(screen.getByRole('button', { name: 'Crear promoción' }));

    // Assert
    await waitFor(() => expect(capturedBody).toBeDefined());
    expect(capturedBody).toMatchObject({
      code: 'VERANO25',
      name: 'Promo Verano',
      type: 'PERCENTAGE',
      discountValue: 15,
    });
  });

  it('muestra errores de validación si se envía el formulario vacío', async () => {
    // Arrange
    const user = userEvent.setup();
    renderDialog({ trigger: <button type="button">Nueva promoción</button> });

    // Act
    await user.click(screen.getByRole('button', { name: 'Nueva promoción' }));
    await user.click(
      await screen.findByRole('button', { name: 'Crear promoción' }),
    );

    // Assert
    expect(
      await screen.findByText('El código es obligatorio'),
    ).toBeInTheDocument();
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
  });

  it('precarga los valores de la promoción en modo edición', async () => {
    // Arrange
    const user = userEvent.setup();
    server.use(...promotionsHandlers);
    const promotion = buildPromotion();
    renderDialog({
      promotion,
      trigger: <button type="button">Editar</button>,
    });

    // Act
    await user.click(screen.getByRole('button', { name: 'Editar' }));

    // Assert
    expect(await screen.findByDisplayValue('PROMO2025')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Descuento de verano')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Guardar cambios' }),
    ).toBeInTheDocument();
  });
});
