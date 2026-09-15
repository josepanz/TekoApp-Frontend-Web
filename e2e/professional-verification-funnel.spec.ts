import { expect, test } from '@playwright/test';

// Embudo completo de captación de oferta (I-03 del WORKPLAN de hardening): un usuario se postula
// como profesional y un admin lo verifica. El fake-backend solo tiene una cuenta (Ana), así que
// "quien se postula" y "el admin que verifica" son la misma cuenta cambiando de modo — no hay
// forma de simular dos usuarios distintos con este fake-backend (contra el fake-backend, no el
// backend real — ver rules/test.md).
test.describe('Postulación → verificación de profesional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('ana@tekoapp.com.py');
    await page.getByLabel('Contraseña', { exact: true }).fill('Sup3rSecreto!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL('/');
  });

  test('postula, queda pendiente y el staff la verifica', async ({ page }) => {
    await page
      .getByRole('link', { name: 'Postulate como profesional' })
      .click();
    await expect(page).toHaveURL('/postularme-como-profesional');

    // No se asume un nombre de categoría puntual: admin-categories.spec.ts corre en el mismo
    // proceso de fake-backend y puede haber creado/eliminado categorías antes que este test — se
    // elige la primera opción disponible, sea cual sea (mismo criterio que
    // client-solicitar.spec.ts).
    await page.getByLabel('Categoría').click();
    await page.getByRole('option').first().click();
    await page
      .getByLabel('Descripción')
      .fill('Reparaciones eléctricas residenciales, más de 5 años de oficio');
    await page.getByLabel('Tarifa por hora').fill('60000');

    // Se espera la respuesta real del POST en vez de asumir a qué pantalla lleva el éxito: el
    // propio formulario invalida la query de "mi perfil profesional" al confirmar, y eso puede
    // redirigir a /pro antes de que la card de éxito llegue a pintarse — una carrera entre dos
    // estados igualmente válidos. Lo único estable de verificar acá es que la postulación se
    // guardó.
    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.request().method() === 'POST' &&
          res.url().endsWith('/api/backend/professionals'),
      ),
      page.getByRole('button', { name: 'Enviar postulación' }).click(),
    ]);
    expect(response.ok()).toBe(true);

    // El staff ve la postulación en la cola de profesionales, pendiente y sin verificar.
    await page.goto('/admin/professionals');
    const row = page.getByRole('row', { name: /Ana Test/ });
    await expect(row).toBeVisible();
    await expect(row.getByText('Pendiente')).toBeVisible();
    await expect(row.getByText('UNVERIFIED')).toBeVisible();

    // El staff la verifica.
    await row.getByRole('button', { name: 'Verificar' }).click();
    await page.getByRole('button', { name: 'Confirmar' }).click();

    await expect(row.getByText('VERIFIED')).toBeVisible();
  });
});
