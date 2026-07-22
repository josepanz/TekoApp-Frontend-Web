import { expect, test } from '@playwright/test';

// Contra el fake-backend (e2e/fake-backend/server.mjs), no el backend real — ver
// documentation/architecture.md y rules/test.md para el porqué de este diseño.
test.describe('Login', () => {
  test('redirige a /login si no hay sesión', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('inicia sesión, entra al panel de administración y ve el Resumen con datos reales del backend (fake)', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('ana@tekoapp.com.py');
    await page.getByLabel('Contraseña').fill('Sup3rSecreto!');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL('/');
    await page
      .getByRole('link', { name: 'Ir al panel de administración' })
      .click();

    await expect(page).toHaveURL('/admin');
    await expect(page.getByText('Usuarios totales')).toBeVisible();
    await expect(page.getByText('1.500')).toBeVisible();
  });

  test('muestra un error si las credenciales son inválidas', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('fail@tekoapp.com.py');
    await page.getByLabel('Contraseña').fill('loQueSea');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page.getByText('Credenciales inválidas')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('navega a Usuarios dentro del panel de administración y ve la tabla paginada, luego cierra sesión', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('ana@tekoapp.com.py');
    await page.getByLabel('Contraseña').fill('Sup3rSecreto!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL('/');

    await page
      .getByRole('link', { name: 'Ir al panel de administración' })
      .click();
    await expect(page).toHaveURL('/admin');

    await page.getByRole('link', { name: 'Usuarios' }).click();
    await expect(page).toHaveURL('/admin/users');
    await expect(page.getByText('ana.gonzalez@example.com')).toBeVisible();

    await page.getByRole('button', { name: 'Menú de usuario' }).click();
    await page.getByRole('menuitem', { name: 'Cerrar sesión' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
