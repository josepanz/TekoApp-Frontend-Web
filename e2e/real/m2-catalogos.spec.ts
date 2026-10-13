/**
 * Suite: M2 Catalogos - CRUD de categorias (admin) reflejado en la vista cliente, contra el
 * backend REAL de e2e.
 * Casos: CP-WEB-CAT-101..103 (ver test/qa/casos/CP-CAT.md)
 * Tipo: e2e (+ a11y)   Prioridad: P0
 * Precondiciones: stack e2e del Backend arriba y sembrado; fixtures admin y cliente_a. Los
 *   nombres de categoria son unicos por corrida (`E2E-<runId>`) y se limpian al final.
 * Trazabilidad: plan maestro M2; contrato W1 (mutaciones de categorias exigen permiso, la
 *   categoria oculta no se ve para no admin).
 */
import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from '@playwright/test';
import { loginUi, newBffContext, scanA11y, visit } from './support';

const RUN_ID = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const NAME = `E2E-${RUN_ID}`;
const NAME_EDITED = `${NAME}-editada`;

async function optionNames(page: Page): Promise<string[]> {
  await page.getByLabel('Categoría').click();
  const names = await page.getByRole('option').allInnerTexts();
  await page.keyboard.press('Escape');
  return names.map((n) => n.trim());
}

async function openSolicitar(page: Page): Promise<string[]> {
  await page.goto('/solicitar');
  await expect(page.getByLabel('Categoría')).toBeVisible();
  return optionNames(page);
}

test.describe.serial('M2 Categorias: admin -> vista cliente', () => {
  test('CP-WEB-CAT-101 admin crea, edita, oculta y borra una categoria y el cliente lo ve reflejado', async ({
    browser,
    page,
  }) => {
    // Cliente en un contexto aparte (sesion independiente).
    const clientCtx = await browser.newContext();
    const clientPage = await clientCtx.newPage();
    await loginUi(clientPage, 'cliente_a');

    await loginUi(page, 'admin');
    await visit(page, '/admin/categories', 'admin-categories');

    await test.step('crear', async () => {
      await page.getByRole('button', { name: 'Nueva categoría' }).click();
      await page.getByLabel('Nombre').fill(NAME);
      await page.getByRole('button', { name: 'Crear categoría' }).click();
      await expect(
        page.getByRole('cell', { name: NAME, exact: true }),
      ).toBeVisible();
      await scanA11y(page, 'admin-categories-tras-crear');
      expect(await openSolicitar(clientPage)).toContain(NAME);
    });

    await test.step('editar', async () => {
      await page
        .getByRole('row', { name: new RegExp(NAME) })
        .getByRole('button', { name: 'Editar' })
        .click();
      await page.getByLabel('Nombre').fill(NAME_EDITED);
      await page.getByRole('button', { name: 'Guardar cambios' }).click();
      await expect(
        page.getByRole('cell', { name: NAME_EDITED, exact: true }),
      ).toBeVisible();
      const names = await openSolicitar(clientPage);
      expect(names).toContain(NAME_EDITED);
      expect(names).not.toContain(NAME);
    });

    await test.step('ocultar: el cliente deja de verla', async () => {
      await page
        .getByRole('switch', { name: `Ocultar ${NAME_EDITED}` })
        .click();
      await expect(
        page.getByRole('switch', { name: `Mostrar ${NAME_EDITED}` }),
      ).toBeVisible();
      expect(await openSolicitar(clientPage)).not.toContain(NAME_EDITED);
    });

    await test.step('borrar', async () => {
      await page
        .getByRole('row', { name: new RegExp(NAME_EDITED) })
        .getByRole('button', { name: 'Eliminar' })
        .click();
      await page
        .getByRole('alertdialog')
        .getByRole('button', { name: 'Eliminar' })
        .click();
      await expect(
        page.getByRole('cell', { name: NAME_EDITED, exact: true }),
      ).toHaveCount(0);
      expect(await openSolicitar(clientPage)).not.toContain(NAME_EDITED);
    });

    await clientCtx.close();
  });

  test('CP-WEB-CAT-102 un 400 del backend (nombre > 100 caracteres) se muestra como error del campo Nombre', async ({
    page,
  }) => {
    await loginUi(page, 'admin');
    await page.goto('/admin/categories');
    await page.getByRole('button', { name: 'Nueva categoría' }).click();
    await page.getByLabel('Nombre').fill('x'.repeat(101));
    await page.getByRole('button', { name: 'Crear categoría' }).click();
    await expect(
      page.getByText(/must be shorter than or equal to 100 characters/),
    ).toBeVisible();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});

test.describe
  .serial('M2 Tabla admin de categorias con muchos registros', () => {
  const created: number[] = [];
  let admin: APIRequestContext;
  const TOTAL = 25;

  test.beforeAll(async ({ baseURL }) => {
    admin = await newBffContext(baseURL!, 'admin');
    for (let i = 0; i < TOTAL; i++) {
      const res = await admin.post('/api/backend/categories', {
        data: { name: `E2E-${RUN_ID}-p${String(i).padStart(2, '0')}` },
      });
      expect(res.status()).toBe(201);
      const body = (await res.json()) as { data: { id: number } };
      created.push(body.data.id);
    }
  });

  test.afterAll(async () => {
    for (const id of created) {
      await admin.delete(`/api/backend/categories/${id}`);
    }
    await admin.dispose();
  });

  // DEF-WEB-002: `GET /categories/all` devuelve TODAS las categorias (ignora page/pageSize) y la
  // tabla las renderiza todas, sin paginacion: con N grande el DOM crece sin limite.
  test('CP-WEB-CAT-103 DEF-WEB-002 la tabla admin de categorias pagina (no renderiza todo de una vez)', async ({
    page,
  }) => {
    test.fail(true, 'DEF-WEB-002: la tabla de categorias no tiene paginacion');
    await loginUi(page, 'admin');
    await visit(page, '/admin/categories', 'admin-categories-muchas');
    const rows = await page.getByRole('row').count();
    expect(rows, 'filas renderizadas (incluye encabezado)').toBeLessThanOrEqual(
      21,
    );
    await expect(
      page.getByRole('button', { name: 'Página siguiente' }),
    ).toBeVisible();
  });
});
