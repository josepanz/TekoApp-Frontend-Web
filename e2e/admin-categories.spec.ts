import { expect, test } from '@playwright/test';

// Flujo CRUD admin representativo de la Fase 4 (contra el fake-backend, no el backend real —
// ver documentation/architecture.md y rules/test.md: no se busca cubrir el 100% de los dominios
// nuevos con e2e, cada uno ya lleva su cobertura unitaria/integración vía Vitest+MSW).
test.describe('Admin — Categorías', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('ana@tekoapp.com.py');
    await page.getByLabel('Contraseña').fill('Sup3rSecreto!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL('/');
    await page
      .getByRole('link', { name: 'Ir al panel de administración' })
      .click();
    await expect(page).toHaveURL('/admin');
    await page.getByRole('link', { name: 'Categorías' }).click();
    await expect(page).toHaveURL('/admin/categories');
  });

  test('crea una categoría nueva y la ve en la tabla', async ({ page }) => {
    await expect(
      page.getByRole('cell', { name: 'Plomería', exact: true }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Nueva categoría' }).click();
    await page.getByLabel('Nombre').fill('Jardinería');
    await page.getByRole('button', { name: 'Crear categoría' }).click();

    await expect(
      page.getByRole('cell', { name: 'Jardinería', exact: true }),
    ).toBeVisible();
  });

  test('oculta una categoría y luego la elimina', async ({ page }) => {
    const plomeriaRow = page.getByRole('row', { name: /Plomería/ });
    await expect(plomeriaRow).toBeVisible();

    await page.getByRole('switch', { name: 'Ocultar Plomería' }).click();
    await expect(
      page.getByRole('switch', { name: 'Mostrar Plomería' }),
    ).toBeVisible();

    await plomeriaRow.getByRole('button', { name: 'Eliminar' }).click();
    await page
      .getByRole('alertdialog')
      .getByRole('button', { name: 'Eliminar' })
      .click();

    // No se asume que la tabla quede vacía: el fake-backend mantiene estado en memoria durante
    // toda la corrida y el test anterior de este mismo archivo pudo haber creado otra categoría.
    await expect(
      page.getByRole('cell', { name: 'Plomería', exact: true }),
    ).not.toBeVisible();
  });
});
