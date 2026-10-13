/**
 * Suite: M1 Auth y sesion - Web contra el backend REAL de e2e (BFF + cookies httpOnly).
 * Casos: CP-WEB-AUTH-101..111 (ver test/qa/casos/CP-AUTH.md)
 * Tipo: e2e (+ a11y)   Prioridad: P0
 * Precondiciones: stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed &&
 *   pnpm e2e:serve`), fixtures admin/cliente_a/pro_aprobado/compliance. Next standalone lo
 *   levanta `scripts/e2e-real/serve.mjs` (webServer de `playwright.real.config.ts`).
 * Trazabilidad: plan maestro M1, contrato W1 (login 401 generico, logout 204), bug login:false.
 */
import { expect, test } from '@playwright/test';
import {
  BACKEND_API_URL,
  backendBasicAuth,
  loginUi,
  scanA11y,
  settle,
  visit,
} from './support';

test.describe('M1 Auth', () => {
  test('CP-WEB-AUTH-101 login OK de admin llega a la home y al panel /admin', async ({
    page,
  }) => {
    await visit(page, '/login', 'login');
    await loginUi(page, 'admin');
    await scanA11y(page, 'home-admin');
    await page
      .getByRole('link', { name: 'Ir al panel de administración' })
      .click();
    await expect(page).toHaveURL('/admin');
    await expect(page.getByTestId('access-denied')).toHaveCount(0);
    await settle(page);
    await scanA11y(page, 'admin-dashboard');
  });

  test('CP-WEB-AUTH-102 login OK de cliente llega a la home del modo cliente', async ({
    page,
  }) => {
    await loginUi(page, 'cliente_a');
    await expect(
      page.getByRole('link', { name: 'Solicitar' }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Ir al panel de administración' }),
    ).toHaveCount(0);
  });

  test('CP-WEB-AUTH-103 login OK de profesional entra al modo /pro', async ({
    page,
  }) => {
    await loginUi(page, 'pro_aprobado');
    await page.getByRole('link', { name: 'Ir al modo profesional' }).click();
    await expect(page).toHaveURL('/pro');
    await settle(page);
    await scanA11y(page, 'pro-home');
  });

  test('CP-WEB-AUTH-104 email inexistente muestra error generico y sigue en /login (regresion bug login:false)', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('no-existe@e2e.tekoapp.local');
    await page.getByLabel('Contraseña', { exact: true }).fill('E2e-Passw0rd!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(
      page.getByText('Email o contraseña incorrectos.'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('CP-WEB-AUTH-105 password incorrecta muestra el mismo error y sigue en /login', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('cliente_a@e2e.tekoapp.local');
    await page.getByLabel('Contraseña', { exact: true }).fill('Incorrecta-1!');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(
      page.getByText('Email o contraseña incorrectos.'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === 'accessToken')).toBeUndefined();
  });

  test('CP-WEB-AUTH-106 registro de un usuario nuevo con email unico', async ({
    page,
  }) => {
    const unique = `web.e2e.${Date.now()}.${Math.floor(Math.random() * 1e6)}`;
    await visit(page, '/register', 'register');
    await page.getByLabel('Nombre').fill('Web');
    await page.getByLabel('Apellido').fill('E2E');
    await page.getByLabel('Email').fill(`${unique}@e2e.tekoapp.local`);
    await page.getByLabel('Teléfono').fill('+595981123456');
    await page.getByLabel('Contraseña', { exact: true }).fill('E2e-Passw0rd!');
    await page.getByLabel('Confirmar contraseña').fill('E2e-Passw0rd!');
    await page
      .getByRole('checkbox', { name: 'Acepto los términos y condiciones' })
      .click();
    await page.getByRole('button', { name: 'Crear cuenta' }).click();
    await expect(page).toHaveURL(/\/login\?registered=1/);
  });

  test('CP-WEB-AUTH-107 logout limpia las cookies, revoca el refresh en el backend y /admin vuelve a /login', async ({
    page,
    context,
  }) => {
    await loginUi(page, 'admin');
    const before = await context.cookies();
    const refresh = before.find((c) => c.name === 'refreshToken');
    expect(refresh, 'el login debe dejar la cookie refreshToken').toBeDefined();
    expect(before.find((c) => c.name === 'accessToken')).toBeDefined();

    await page.getByRole('button', { name: 'Menú de usuario' }).click();
    await page.getByRole('menuitem', { name: 'Cerrar sesión' }).click();
    await expect(page).toHaveURL(/\/login/);

    const after = await context.cookies();
    expect(after.find((c) => c.name === 'accessToken')).toBeUndefined();
    expect(after.find((c) => c.name === 'refreshToken')).toBeUndefined();

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login\?from=%2Fadmin/);

    // El refresh token viejo ya no sirve en el backend (revocado por POST /auth/logout).
    const res = await fetch(`${BACKEND_API_URL}/v1/auth/refresh-token`, {
      method: 'POST',
      headers: {
        Authorization: backendBasicAuth(),
        Cookie: `refreshToken=${refresh!.value}`,
      },
    });
    expect(res.status).toBe(401);
  });

  test('CP-WEB-AUTH-108 cliente_a en /admin ve la pantalla de sin acceso (no crash)', async ({
    page,
  }) => {
    await loginUi(page, 'cliente_a');
    await page.goto('/admin');
    await expect(page.getByTestId('access-denied')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'No tenés acceso a esta sección' }),
    ).toBeVisible();
    await scanA11y(page, 'sin-acceso');
  });

  // DEF-WEB-001: `isStaffUser` exige admin:all o dashboard:read; compliance solo tiene permisos
  // `legal.*`, asi que el layout de /admin le muestra "sin acceso" incluso en las paginas legales.
  test('CP-WEB-AUTH-109 DEF-WEB-001 compliance ve las paginas legales', async ({
    page,
  }) => {
    test.fail(
      true,
      'DEF-WEB-001: compliance no entra a /admin/legal (gate isStaffUser)',
    );
    await loginUi(page, 'compliance');
    for (const path of [
      '/admin/legal/consent-audit',
      '/admin/legal/document-versions',
      '/admin/legal/retention-policies',
    ]) {
      await visit(page, path, `compliance${path}`);
      await expect(page.getByTestId('access-denied')).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('CP-WEB-AUTH-110 compliance no accede a las paginas de admin ajenas', async ({
    page,
  }) => {
    await loginUi(page, 'compliance');
    await page.goto('/admin/users');
    await settle(page);
    await expect(page.getByTestId('access-denied')).toBeVisible();
  });

  test('CP-WEB-AUTH-111 la sesion sobrevive a un reload y el JWT no es visible desde JS', async ({
    page,
  }) => {
    await loginUi(page, 'cliente_a');
    await page.reload();
    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('link', { name: 'Solicitar' }).first(),
    ).toBeVisible();
    const jsCookies = await page.evaluate(() => document.cookie);
    expect(jsCookies).not.toContain('accessToken');
    expect(jsCookies).not.toContain('refreshToken');
  });
});
