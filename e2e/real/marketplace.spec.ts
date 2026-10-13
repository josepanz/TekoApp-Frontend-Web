/**
 * Suite: M4 Marketplace (servicios) - flujos que cruzan roles (cliente <-> profesional) contra el
 * backend REAL de e2e. Un `browser.newContext()` por rol dentro del mismo test.
 * Casos: CP-WEB-MKT-101..105 (ver test/qa/casos/CP-MKT.md)
 * Tipo: e2e (+ a11y)   Prioridad: P1
 * Precondiciones: stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed &&
 *   pnpm e2e:serve`); fixtures cliente_a, cliente_b, pro_aprobado (Plomeria, APPROVED),
 *   pro_pendiente (PENDING). Cada servicio tiene un titulo unico por corrida.
 * Trazabilidad: plan maestro M4; contrato W2 (transiciones invalidas -> 409, GET /services/:id
 *   solo dueno/asignado/admin, /services solo admin o pro aprobado, `:id` = referenceId),
 *   DEF-WEB-005/006.
 */
import { expect, test, type Browser, type Page } from '@playwright/test';
import {
  backendFetch,
  findRowAcrossPages,
  loginUi,
  scanA11y,
  settle,
  setTheme,
  type UserKey,
  visit,
} from './support';

const RUN_ID = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e3)}`;

async function asRole(browser: Browser, who: UserKey): Promise<Page> {
  const ctx = await browser.newContext({ locale: 'es-PY' });
  const page = await ctx.newPage();
  await setTheme(page, 'light');
  await loginUi(page, who);
  return page;
}

/** El cliente solicita un servicio en `/solicitar` (categoria Plomeria del seed). */
async function solicitar(page: Page, title: string): Promise<void> {
  await page.goto('/solicitar');
  await settle(page);
  await page.getByLabel('Título').fill(title);
  await page
    .getByLabel('Descripción')
    .fill('Pérdida de agua en la cocina (e2e)');
  await page.getByLabel('Categoría').click();
  await page.getByRole('option', { name: 'Plomería' }).click();
  await page.getByLabel('Tipo de servicio').click();
  await page.getByRole('option').first().click();
  await page.getByLabel('Dirección').fill('Av. España 1234, Asunción');
  await page.getByRole('button', { name: 'Solicitar profesional' }).click();
  await expect(page).toHaveURL('/mis-servicios');
  await expect(page.getByRole('cell', { name: title })).toBeVisible();
}

test.describe('M4 Marketplace', () => {
  test('CP-WEB-MKT-101 solicitar -> aceptar -> iniciar -> completar, visto por ambos roles', async ({
    browser,
  }) => {
    const title = `E2E MKT ${RUN_ID} flujo`;
    const cliente = await asRole(browser, 'cliente_a');
    const pro = await asRole(browser, 'pro_aprobado');

    await test.step('cliente solicita', async () => {
      await visit(cliente, '/solicitar', 'solicitar');
      await solicitar(cliente, title);
      await settle(cliente);
      await scanA11y(cliente, 'mis-servicios');
      const row = await findRowAcrossPages(cliente, title);
      await expect(row).toContainText('Pendiente');
      await expect(row).toContainText('Sin asignar');
    });

    await test.step('pro lo ve en solicitudes y lo acepta', async () => {
      await visit(pro, '/pro/solicitudes', 'pro-solicitudes');
      const row = await findRowAcrossPages(pro, title);
      await row.getByRole('button', { name: 'Aceptar' }).click();
      await expect(pro.getByText('Servicio aceptado')).toBeVisible();
      await expect(pro.getByRole('row').filter({ hasText: title })).toHaveCount(
        0,
      );
    });

    await test.step('cliente ve el cambio a Aceptado con el profesional asignado', async () => {
      await cliente.reload();
      await settle(cliente);
      const row = await findRowAcrossPages(cliente, title);
      await expect(row).toContainText('Aceptado');
      await expect(row).toContainText('Pro Aprobado');
    });

    await test.step('pro inicia y completa en /pro/servicios', async () => {
      await visit(pro, '/pro/servicios', 'pro-servicios');
      let row = await findRowAcrossPages(pro, title);
      await expect(row).toContainText('Aceptado');
      await row.getByRole('button', { name: 'Iniciar' }).click();
      await expect(pro.getByText('Servicio iniciado')).toBeVisible();
      row = await findRowAcrossPages(pro, title);
      await expect(row).toContainText('En curso');
      await row.getByRole('button', { name: 'Completar' }).click();
      await expect(pro.getByText('Servicio completado')).toBeVisible();
      row = await findRowAcrossPages(pro, title);
      await expect(row).toContainText('Completado');
    });

    await test.step('cliente ve COMPLETED y el CTA de calificar (sin calificar: W4)', async () => {
      await cliente.reload();
      await settle(cliente);
      const row = await findRowAcrossPages(cliente, title);
      await expect(row).toContainText('Completado');
      await expect(
        row.getByRole('button', { name: 'Calificar profesional' }),
      ).toBeVisible();
      await scanA11y(cliente, 'mis-servicios-completado');
    });

    await cliente.context().close();
    await pro.context().close();
  });

  test('CP-WEB-MKT-102 el cliente cancela un servicio pendiente y el profesional ya no lo ve', async ({
    browser,
  }) => {
    const title = `E2E MKT ${RUN_ID} cancelar`;
    const cliente = await asRole(browser, 'cliente_a');
    const pro = await asRole(browser, 'pro_aprobado');

    await solicitar(cliente, title);
    await pro.goto('/pro/solicitudes');
    await settle(pro);
    await findRowAcrossPages(pro, title);

    const row = await findRowAcrossPages(cliente, title);
    await row.getByRole('button', { name: 'Cancelar' }).click();
    // Sin motivo, el boton de confirmacion esta deshabilitado.
    await expect(
      cliente.getByRole('button', { name: 'Confirmar cancelación' }),
    ).toBeDisabled();
    await cliente.getByLabel('Motivo').fill('Ya no lo necesito (e2e)');
    await cliente
      .getByRole('button', { name: 'Confirmar cancelación' })
      .click();
    await expect(cliente.getByText('Servicio cancelado')).toBeVisible();
    await expect(
      (await findRowAcrossPages(cliente, title)).getByText('Cancelado'),
    ).toBeVisible();

    // El profesional ya no lo ve entre las solicitudes pendientes.
    await pro.reload();
    await settle(pro);
    await expect(pro.getByRole('row').filter({ hasText: title })).toHaveCount(
      0,
    );

    await cliente.context().close();
    await pro.context().close();
  });

  test('CP-WEB-MKT-103 conflicto: completar dos veces desde dos pestanas muestra el 409 explicado, sin crash', async ({
    browser,
  }) => {
    const title = `E2E MKT ${RUN_ID} conflicto`;
    const cliente = await asRole(browser, 'cliente_a');
    const pro = await asRole(browser, 'pro_aprobado');
    await solicitar(cliente, title);

    await pro.goto('/pro/solicitudes');
    await settle(pro);
    await (
      await findRowAcrossPages(pro, title)
    )
      .getByRole('button', { name: 'Aceptar' })
      .click();
    await expect(pro.getByText('Servicio aceptado')).toBeVisible();

    await pro.goto('/pro/servicios');
    await settle(pro);
    await (
      await findRowAcrossPages(pro, title)
    )
      .getByRole('button', { name: 'Iniciar' })
      .click();
    await expect(pro.getByText('Servicio iniciado')).toBeVisible();

    // Segunda pestana (mismo contexto = misma sesion) que quedo con la vista "En curso".
    const tab2 = await pro.context().newPage();
    await tab2.goto('/pro/servicios');
    await settle(tab2);
    const row2 = await findRowAcrossPages(tab2, title);
    await expect(row2).toContainText('En curso');

    // Pestana 1 completa.
    await (
      await findRowAcrossPages(pro, title)
    )
      .getByRole('button', { name: 'Completar' })
      .click();
    await expect(pro.getByText('Servicio completado')).toBeVisible();

    // Pestana 2 (vista vieja) intenta completar otra vez -> 409.
    await row2.getByRole('button', { name: 'Completar' }).click();
    const toast = tab2.locator('[data-sonner-toast][data-type="error"]');
    await expect(toast).toBeVisible();
    await expect(toast).not.toContainText(
      /Error 409|Ocurrió un error inesperado/,
    );
    // Sin crash: la tabla sigue y tras el refetch refleja el estado real.
    await expect(tab2.getByRole('table')).toBeVisible();
    // La vista se asienta (refetch + transiciones de los botones) antes de escanear.
    await settle(tab2);
    await expect(
      tab2.getByRole('row').filter({ hasText: title }),
    ).toContainText('Completado');
    await scanA11y(tab2, 'pro-servicios-conflicto');
    test.info().annotations.push({
      type: 'mensaje-409',
      description: (await toast.innerText()).replace(/\s+/g, ' '),
    });

    await cliente.context().close();
    await pro.context().close();
  });

  test('CP-WEB-MKT-104 IDOR por UI: otro cliente no ve ni accede al servicio ajeno', async ({
    browser,
  }) => {
    const title = `E2E MKT ${RUN_ID} idor`;
    const clienteA = await asRole(browser, 'cliente_a');
    const clienteB = await asRole(browser, 'cliente_b');
    await solicitar(clienteA, title);

    // Obtiene el referenceId del servicio desde la sesion del dueno.
    const mine = await backendFetch(
      clienteA,
      'services/my-services?role=client',
    );
    const list = JSON.parse(mine.text) as {
      data: { referenceId: string; title: string }[];
    };
    const ref = list.data.find((s) => s.title === title)?.referenceId;
    expect(ref, 'referenceId del servicio de cliente_a').toBeTruthy();

    await test.step('el listado de cliente_b no contiene el servicio', async () => {
      await visit(clienteB, '/mis-servicios', 'mis-servicios-b');
      await expect(clienteB.getByText(title)).toHaveCount(0);
    });

    await test.step('GET directo del servicio y de sus ofertas -> 403 sin datos filtrados', async () => {
      for (const path of [`services/${ref}`, `services/${ref}/requests`]) {
        const res = await backendFetch(clienteB, path);
        expect(res.status, path).toBe(403);
        expect(res.text).not.toContain(title);
        expect(res.text).not.toContain('Av. España 1234');
      }
      // cliente_b tampoco puede cancelar ni aceptar el servicio ajeno.
      const del = await backendFetch(clienteB, `services/${ref}`, {
        method: 'DELETE',
        body: { reason: 'intento de IDOR' },
      });
      expect([403, 404]).toContain(del.status);
    });

    await test.step('la ruta admin del servicio no se renderiza para un cliente', async () => {
      await clienteB.goto(`/admin/services/${ref}`);
      await settle(clienteB);
      await expect(clienteB.getByText(title)).toHaveCount(0);
      await expect(clienteB.getByTestId('access-denied')).toBeVisible();
    });

    // Limpieza: el dueno cancela su servicio para no dejar pendientes.
    const row = await findRowAcrossPages(clienteA, title);
    await row.getByRole('button', { name: 'Cancelar' }).click();
    await clienteA.getByLabel('Motivo').fill('Limpieza e2e');
    await clienteA
      .getByRole('button', { name: 'Confirmar cancelación' })
      .click();
    await expect(clienteA.getByText('Servicio cancelado')).toBeVisible();

    await clienteA.context().close();
    await clienteB.context().close();
  });

  test('CP-WEB-MKT-105 pro_pendiente no puede ver ni aceptar solicitudes: mensaje claro', async ({
    browser,
  }) => {
    const title = `E2E MKT ${RUN_ID} pendiente`;
    const cliente = await asRole(browser, 'cliente_a');
    const proPend = await asRole(browser, 'pro_pendiente');
    await solicitar(cliente, title);

    await proPend.goto('/pro/solicitudes');
    await settle(proPend);
    await scanA11y(proPend, 'pro-solicitudes-pendiente');
    await expect(
      proPend.getByText(/pendiente de aprobación/i).first(),
    ).toBeVisible();
    await expect(proPend.getByRole('button', { name: 'Aceptar' })).toHaveCount(
      0,
    );

    // El resto del area /pro sigue operativa para el pendiente (no cae en "sin acceso").
    for (const path of [
      '/pro/servicios',
      '/pro/perfil',
      '/pro/mis-documentos',
      '/pro/portafolio',
    ]) {
      await proPend.goto(path);
      await settle(proPend);
      await expect(proPend.getByTestId('access-denied'), path).toHaveCount(0);
      await expect(
        proPend.getByTestId('professional-status-banner'),
        path,
      ).toBeVisible();
      await scanA11y(proPend, `pro-pendiente${path.replace('/pro', '')}`);
    }

    // Aceptar por API tambien se rechaza (403).
    const mine = await backendFetch(
      cliente,
      'services/my-services?role=client',
    );
    const ref = (
      JSON.parse(mine.text) as {
        data: { referenceId: string; title: string }[];
      }
    ).data.find((s) => s.title === title)?.referenceId;
    const res = await backendFetch(proPend, `services/${ref}/accept`, {
      method: 'POST',
    });
    expect(res.status).toBe(403);

    // Limpieza.
    const row = await findRowAcrossPages(cliente, title);
    await row.getByRole('button', { name: 'Cancelar' }).click();
    await cliente.getByLabel('Motivo').fill('Limpieza e2e');
    await cliente
      .getByRole('button', { name: 'Confirmar cancelación' })
      .click();
    await expect(cliente.getByText('Servicio cancelado')).toBeVisible();

    await cliente.context().close();
    await proPend.context().close();
  });
});
