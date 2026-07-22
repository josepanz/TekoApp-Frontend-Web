import { expect, test } from '@playwright/test';

// Flujo cliente representativo de la Fase 6: solicitar un profesional y verlo en "Mis servicios"
// (contra el fake-backend, no el backend real — ver rules/test.md).
test.describe('Cliente — Solicitar servicio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('ana@tekoapp.com.py');
    await page.getByLabel('Contraseña').fill('Sup3rSecreto!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL('/');
  });

  test('solicita un servicio y lo ve reflejado en Mis servicios', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'Solicitar', exact: true }).click();
    await expect(page).toHaveURL('/solicitar');

    await page.getByLabel('Título').fill('Arreglar canilla');
    await page
      .getByLabel('Descripción')
      .fill('Se rompió la canilla de la cocina');
    // No se asume un nombre de categoría puntual: e2e/admin-categories.spec.ts corre en el mismo
    // proceso de fake-backend y puede haber creado/eliminado categorías antes que este test —
    // se elige la primera opción disponible, sea cual sea.
    await page.getByLabel('Categoría').click();
    await page.getByRole('option').first().click();
    await page.getByLabel('Tipo de servicio').click();
    await page.getByRole('option', { name: 'Instalación' }).click();
    await page.getByLabel('Dirección').fill('Av. España 1234');
    await page.getByRole('button', { name: 'Solicitar profesional' }).click();

    await expect(page).toHaveURL('/mis-servicios');
    await expect(page.getByText('Arreglar canilla')).toBeVisible();
  });
});
