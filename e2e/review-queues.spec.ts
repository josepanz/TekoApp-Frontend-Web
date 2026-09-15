import { expect, test } from '@playwright/test';

// Colas de revisión de documentos y portafolio (I-03 del WORKPLAN de hardening): deciden si un
// profesional puede operar y no tenían ningún e2e (contra el fake-backend, no el backend real —
// ver rules/test.md).
test.describe('Colas de revisión', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('ana@tekoapp.com.py');
    await page.getByLabel('Contraseña', { exact: true }).fill('Sup3rSecreto!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL('/');
    await page
      .getByRole('link', { name: 'Ir al panel de administración' })
      .click();
    await expect(page).toHaveURL('/admin');
  });

  test('aprueba un documento pendiente en la cola de revisión', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'Revisión de documentos' }).click();
    await expect(page).toHaveURL('/admin/professional-documents');

    const row = page.getByRole('row', { name: /Carlos Gómez/ });
    await expect(row).toBeVisible();
    await expect(row.getByText('Pendiente')).toBeVisible();

    await row.getByRole('button', { name: 'Revisar' }).click();
    await page.getByRole('button', { name: 'Aprobar' }).click();

    await expect(row.getByText('Aprobado')).toBeVisible();
  });

  test('rechaza una foto de portafolio pendiente con un motivo', async ({
    page,
  }) => {
    await page.getByRole('link', { name: 'Revisión de portafolio' }).click();
    await expect(page).toHaveURL('/admin/professional-portfolio');

    const row = page.getByRole('row', { name: /Lucía Fernández/ });
    await expect(row).toBeVisible();
    await expect(row.getByText('Pendiente')).toBeVisible();

    await row.getByRole('button', { name: 'Revisar' }).click();
    await page.getByRole('button', { name: 'Rechazar' }).click();
    await page
      .getByLabel('Motivo de rechazo')
      .fill('La foto no muestra un trabajo terminado');
    await page.getByRole('button', { name: 'Confirmar rechazo' }).click();

    await expect(row.getByText('Rechazado')).toBeVisible();
  });
});
