import { expect, test } from '@playwright/test';

// Flujo de pagos (I-03 del WORKPLAN de hardening: reembolso, cancelación y propina no tenían
// ningún e2e pese a mover plata real). Cada acción usa un pago fijo y separado del
// fake-backend (payment-refund-1/payment-cancel-1/payment-tip-1) para no pisarse entre sí ni con
// el resto de la corrida (contra el fake-backend, no el backend real — ver rules/test.md).
test.describe('Pagos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('ana@tekoapp.com.py');
    await page.getByLabel('Contraseña', { exact: true }).fill('Sup3rSecreto!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL('/');
  });

  test('reembolsa un pago desde el panel de administración', async ({
    page,
  }) => {
    await page
      .getByRole('link', { name: 'Ir al panel de administración' })
      .click();
    await expect(page).toHaveURL('/admin');
    await page.getByRole('link', { name: 'Pagos' }).click();
    await expect(page).toHaveURL('/admin/payments');

    const row = page.getByRole('row', { name: /txn-refund-1/ });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Reembolsar' }).click();

    await page.getByLabel('Motivo').click();
    await page.getByRole('option', { name: 'Solicitud del cliente' }).click();
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Confirmar reembolso' })
      .click();

    await expect(row.getByText('Reembolsado')).toBeVisible();
  });

  test('cancela un pago propio desde Mis pagos', async ({ page }) => {
    await page.getByRole('link', { name: 'Mis pagos' }).click();
    await expect(page).toHaveURL('/mis-pagos');

    const row = page.getByRole('row', { name: /txn-cancel-1/ });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Cancelar' }).click();
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Sí, cancelar' })
      .click();

    await expect(row.getByText('Cancelado')).toBeVisible();
  });

  test('deja una propina desde el detalle de un pago propio', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'Mis pagos' }).click();
    await expect(page).toHaveURL('/mis-pagos');

    const row = page.getByRole('row', { name: /txn-tip-1/ });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Ver' }).click();
    await expect(page).toHaveURL('/mis-pagos/payment-tip-1');

    await page.getByRole('button', { name: 'Dejar propina' }).click();
    await page.getByRole('button', { name: '15%' }).click();
    await page.getByRole('button', { name: 'Confirmar propina' }).click();

    // El trigger desaparece porque el pago ya tiene propina (`isTippable` pasa a false) y el
    // detalle ahora muestra el monto de la propina — evidencia de que el flujo completo (elegir
    // porcentaje → confirmar → reflejarse en el detalle) funcionó de punta a punta.
    await expect(
      page.getByRole('button', { name: 'Dejar propina' }),
    ).not.toBeVisible();
    await expect(page.getByText(/Propina: /)).toBeVisible();
  });
});
