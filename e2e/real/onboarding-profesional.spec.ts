/**
 * Suite: M3 Onboarding profesional - flujo que cruza roles (usuario nuevo -> admin -> cliente)
 * contra el backend REAL de e2e. Un `browser.newContext()` por rol (nuevo pro, admin, cliente).
 * Casos: CP-WEB-ONB-101..108 (ver test/qa/casos/CP-ONB.md)
 * Tipo: e2e (+ a11y)   Prioridad: P1
 * Precondiciones: stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed &&
 *   pnpm e2e:serve`); fixtures admin y cliente_a; categoria Plomeria y tipos de documento del
 *   seed; archivos chicos en `e2e/real/fixtures/`. El usuario nuevo se registra con email unico.
 * Trazabilidad: plan maestro M3; contrato W2 (POST /professionals/me/documents multipart con
 *   403 CONSENT_REQUIRED, rechazo sin motivo -> 400, profesionales no aprobados -> 404 para
 *   no-admin); DEF-WEB-004 (consentimiento), DEF-WEB-005 (estado del pro), DEF-WEB-007 (404 amable).
 */
import { expect, test, type Browser, type Page } from '@playwright/test';
import { resolve } from 'node:path';
import {
  backendFetch,
  findRowAcrossPages,
  loginUi,
  loginWith,
  registerUi,
  scanA11y,
  settle,
  setTheme,
  visit,
} from './support';

const FIXTURES = resolve(process.cwd(), 'e2e', 'real', 'fixtures');
const RUN_ID = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e3)}`;
// Solo letras para el apellido (el nombre del usuario es el identificador visible en las colas).
const LAST = `Onb${RUN_ID.replace(/[0-9]/g, (d) => 'abcdefghij'[Number(d)])}`;
const FULL_NAME = `Nuevo ${LAST}`;

const POLICIAL = 'Antecedente Policial';
const JUDICIAL = 'Antecedente Judicial';

let newPro: { email: string; password: string };
let proRef = '';

async function newPage(browser: Browser): Promise<Page> {
  const ctx = await browser.newContext({ locale: 'es-PY' });
  const page = await ctx.newPage();
  await setTheme(page, 'light');
  return page;
}

async function uploadDoc(page: Page, docName: string): Promise<void> {
  await page
    .getByLabel(`Archivo para ${docName}`)
    .setInputFiles(resolve(FIXTURES, 'documento.pdf'));
}

test.describe.serial('M3 Onboarding profesional', () => {
  test('CP-WEB-ONB-101 un usuario nuevo se registra y se postula como profesional', async ({
    browser,
  }) => {
    const page = await newPage(browser);
    await visit(page, '/register', 'register-onboarding');
    newPro = await registerUi(page, { firstName: 'Nuevo', lastName: LAST });
    await loginWith(page, newPro);

    await visit(page, '/postularme-como-profesional', 'postularme');
    // Sin completar nada: errores de validacion de campo, sin llamar al backend.
    await page.getByRole('button', { name: 'Enviar postulación' }).click();
    await expect(
      page.locator('p.text-destructive', { hasText: 'Elegí una categoría' }),
    ).toBeVisible();
    await expect(
      page.locator('p.text-destructive', {
        hasText: 'La descripción es obligatoria',
      }),
    ).toBeVisible();

    await page.getByLabel('Categoría').click();
    await page.getByRole('option', { name: 'Plomería' }).click();
    await page
      .getByLabel('Descripción')
      .fill('Plomero matriculado, 6 años de experiencia (e2e)');
    await page.getByLabel('Tarifa por hora').fill('45000');
    await page.getByLabel('Años de experiencia').fill('6');
    await page.getByLabel('Habilidades').fill('cañerías, destapes');
    await page.getByRole('button', { name: 'Enviar postulación' }).click();

    // La postulacion crea el perfil PENDING y el usuario termina en el modo profesional.
    await expect(page).toHaveURL(/\/pro/);
    const me = await backendFetch(page, 'professionals/me');
    expect(me.status).toBe(200);
    const data = (
      JSON.parse(me.text) as { data: { referenceId: string; status: string } }
    ).data;
    expect(data.status).toBe('PENDING');
    proRef = data.referenceId;
    await page.context().close();
  });

  test('CP-WEB-ONB-102 mientras esta PENDING el nuevo pro ve su estado y no puede ver solicitudes', async ({
    browser,
  }) => {
    const page = await newPage(browser);
    await loginWith(page, newPro);
    await page.goto('/pro');
    await settle(page);
    await expect(page).toHaveURL('/pro/solicitudes');
    await expect(page.getByTestId('professional-status-banner')).toContainText(
      'pendiente de aprobación',
    );
    await expect(
      page.getByText('todavía no está aprobado: no podés ver ni aceptar'),
    ).toBeVisible();
    await scanA11y(page, 'pro-solicitudes-pendiente-nuevo');

    await page.goto('/pro/perfil');
    await settle(page);
    await expect(page.getByTestId('professional-status-badge')).toHaveText(
      'Pendiente de aprobación',
    );
    await scanA11y(page, 'pro-perfil-pendiente');
    await page.context().close();
  });

  test('CP-WEB-ONB-103 subir un documento sin consentimiento muestra el pedido de aceptacion; al aceptar se sube', async ({
    browser,
  }) => {
    const page = await newPage(browser);
    await loginWith(page, newPro);
    await visit(page, '/pro/mis-documentos', 'pro-mis-documentos');

    await test.step('sin consentimiento: error claro y no se sube', async () => {
      await uploadDoc(page, POLICIAL);
      const dialog = page.getByTestId('consent-required-dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText(
        'Consentimiento de tratamiento de datos',
      );
      await expect(dialog).toContainText('necesitamos tu consentimiento');
      // El boton de aceptar queda habilitado cuando carga el documento pendiente.
      await expect(
        dialog.getByRole('button', { name: 'Acepto y continuar' }),
      ).toBeEnabled();
      await scanA11y(page, 'consentimiento-requerido');
      await dialog.getByRole('button', { name: 'Cancelar' }).click();
      await expect(dialog).toBeHidden();
      // Sigue sin documento cargado: el boton del tipo sigue diciendo "Subir".
      const card = page
        .locator('div')
        .filter({ has: page.getByLabel(`Archivo para ${POLICIAL}`) })
        .last();
      await expect(card.getByRole('button', { name: 'Subir' })).toBeVisible();
    });

    await test.step('acepta el consentimiento y la subida se reintenta sola', async () => {
      await uploadDoc(page, POLICIAL);
      const dialog = page.getByTestId('consent-required-dialog');
      await dialog.getByRole('button', { name: 'Acepto y continuar' }).click();
      await expect(dialog).toBeHidden();
      await expect(
        page.getByText('Documento subido correctamente.'),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Reemplazar' }),
      ).toHaveCount(1);
    });

    await test.step('con el consentimiento vigente sube el segundo documento directo', async () => {
      await uploadDoc(page, JUDICIAL);
      await expect(
        page.getByRole('button', { name: 'Reemplazar' }),
      ).toHaveCount(2);
      await expect(page.getByTestId('consent-required-dialog')).toHaveCount(0);
      await expect(page.getByText('Pendiente').first()).toBeVisible();
      await scanA11y(page, 'pro-mis-documentos-cargados');
    });
    await page.context().close();
  });

  test('CP-WEB-ONB-104 un cliente no ve al profesional PENDING ni en el listado ni por URL directa (404 amable)', async ({
    browser,
  }) => {
    const cliente = await newPage(browser);
    await loginUi(cliente, 'cliente_a');

    await test.step('URL directa -> pantalla amable de no disponible, sin datos', async () => {
      await cliente.goto(`/profesionales/${proRef}`);
      await settle(cliente);
      await expect(cliente.getByTestId('professional-not-found')).toBeVisible();
      await expect(
        cliente.getByText('Profesional no disponible'),
      ).toBeVisible();
      await expect(cliente.getByText(LAST)).toHaveCount(0);
      await scanA11y(cliente, 'profesional-no-disponible');
    });

    await test.step('el listado /profesionales no lo incluye en ninguna pagina', async () => {
      await visit(cliente, '/profesionales', 'profesionales');
      for (let i = 0; i < 20; i++) {
        await expect(cliente.getByText(LAST)).toHaveCount(0);
        const next = cliente.getByRole('button', { name: 'Siguiente' });
        if (!(await next.isVisible()) || !(await next.isEnabled())) break;
        await next.click();
        await settle(cliente);
      }
    });

    await test.step('tampoco por API (404)', async () => {
      const res = await backendFetch(
        cliente,
        `professionals/reference/${proRef}`,
      );
      expect(res.status).toBe(404);
      expect(res.text).not.toContain(LAST);
    });
    await cliente.context().close();
  });

  test('CP-WEB-ONB-105 el admin rechaza un documento (con motivo obligatorio) y aprueba otro', async ({
    browser,
  }) => {
    const admin = await newPage(browser);
    const pro = await newPage(browser);
    await loginUi(admin, 'admin');
    await visit(
      admin,
      '/admin/professional-documents',
      'admin-professional-documents',
    );

    await test.step('rechazar sin motivo muestra el error de validacion', async () => {
      const row = await findRowAcrossPages(
        admin,
        new RegExp(`${LAST}.*${POLICIAL}`),
      );
      await row.getByRole('button', { name: 'Revisar' }).click();
      const dialog = admin.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await scanA11y(admin, 'admin-documento-dialogo');
      await dialog
        .getByRole('button', { name: 'Rechazar', exact: true })
        .click();
      await dialog.getByRole('button', { name: 'Confirmar rechazo' }).click();
      await expect(
        dialog.getByText('El motivo de rechazo es obligatorio'),
      ).toBeVisible();
      await dialog
        .getByLabel('Motivo de rechazo')
        .fill('Foto ilegible, subila de nuevo (e2e)');
      await dialog.getByRole('button', { name: 'Confirmar rechazo' }).click();
      await expect(
        admin.getByText('Documento revisado correctamente.'),
      ).toBeVisible();
      await expect(dialog).toBeHidden();
    });

    await test.step('aprobar el otro documento', async () => {
      await admin.reload();
      await settle(admin);
      const row = await findRowAcrossPages(
        admin,
        new RegExp(`${LAST}.*${JUDICIAL}`),
      );
      await row.getByRole('button', { name: 'Revisar' }).click();
      const dialog = admin.getByRole('dialog');
      await dialog.getByRole('button', { name: 'Aprobar' }).click();
      await expect(dialog).toBeHidden();
    });

    await test.step('el nuevo pro ve el motivo del rechazo y el documento aprobado', async () => {
      await loginWith(pro, newPro);
      await pro.goto('/pro/mis-documentos');
      await settle(pro);
      await expect(
        pro.getByText(
          'Motivo de rechazo: Foto ilegible, subila de nuevo (e2e)',
        ),
      ).toBeVisible();
      await expect(pro.getByText('Rechazado')).toBeVisible();
      await expect(pro.getByText('Aprobado')).toBeVisible();
      await scanA11y(pro, 'pro-mis-documentos-revisados');
    });
    await admin.context().close();
    await pro.context().close();
  });

  test('CP-WEB-ONB-106 el admin verifica al profesional y el pro ve su estado actualizado en /pro', async ({
    browser,
  }) => {
    const admin = await newPage(browser);
    const pro = await newPage(browser);
    await loginWith(pro, newPro);
    await pro.goto('/pro/solicitudes');
    await settle(pro);
    await expect(pro.getByTestId('professional-status-banner')).toBeVisible();

    await loginUi(admin, 'admin');
    await visit(
      admin,
      `/admin/professionals/${proRef}`,
      'admin-profesional-detalle',
    );
    await expect(admin.getByText(FULL_NAME)).toBeVisible();
    await expect(
      admin.getByText('Pendiente', { exact: true }).first(),
    ).toBeVisible();
    await admin.getByRole('button', { name: 'Verificar', exact: true }).click();
    await admin
      .getByRole('dialog')
      .getByRole('button', { name: 'Confirmar' })
      .click();
    // El dialogo termina de cerrarse (animacion) antes de escanear: axe no debe ver el overlay.
    await expect(admin.getByRole('dialog')).toBeHidden();
    await expect(
      admin.getByText('Aprobado', { exact: true }).first(),
    ).toBeVisible();
    await expect(admin.getByText('VERIFIED')).toBeVisible();
    await scanA11y(admin, 'admin-profesional-verificado');

    // El pro (otro contexto) recarga /pro y ve el estado actualizado, sin aviso de pendiente.
    await pro.goto('/pro');
    await settle(pro);
    await expect(pro).toHaveURL('/pro/solicitudes');
    await expect(pro.getByTestId('professional-status-banner')).toHaveCount(0);
    await pro.goto('/pro/perfil');
    await settle(pro);
    await expect(pro.getByTestId('professional-status-badge')).toHaveText(
      'Aprobado',
    );
    await scanA11y(pro, 'pro-perfil-aprobado');
    await admin.context().close();
    await pro.context().close();
  });

  test('CP-WEB-ONB-107 ya aprobado, el cliente ve su perfil por URL directa y en el listado al quedar disponible', async ({
    browser,
  }) => {
    const cliente = await newPage(browser);
    const pro = await newPage(browser);
    await loginUi(cliente, 'cliente_a');
    await loginWith(pro, newPro);

    await cliente.goto(`/profesionales/${proRef}`);
    await settle(cliente);
    await expect(cliente.getByText(FULL_NAME)).toBeVisible();
    await expect(cliente.getByTestId('professional-not-found')).toHaveCount(0);
    await scanA11y(cliente, 'profesional-detalle-aprobado');

    // El listado solo incluye profesionales disponibles: el pro se marca disponible.
    await pro.goto('/pro/perfil');
    await settle(pro);
    await pro.getByRole('switch', { name: 'No disponible' }).click();
    await expect(pro.getByRole('switch', { name: 'Disponible' })).toBeChecked();

    await visit(cliente, '/profesionales', 'profesionales-con-aprobado');
    let found = false;
    for (let i = 0; i < 20 && !found; i++) {
      found = (await cliente.getByText(FULL_NAME).count()) > 0;
      const next = cliente.getByRole('button', { name: 'Siguiente' });
      if (found || !(await next.isVisible()) || !(await next.isEnabled()))
        break;
      await next.click();
      await settle(cliente);
    }
    expect(found, 'el pro aprobado y disponible aparece en el listado').toBe(
      true,
    );
    await cliente.context().close();
    await pro.context().close();
  });

  test('CP-WEB-ONB-108 portafolio: el admin lo revisa y el perfil publico muestra solo lo aprobado y visible', async ({
    browser,
  }) => {
    const visible = `Visible-${RUN_ID}`;
    const hidden = `Oculta-${RUN_ID}`;
    const pro = await newPage(browser);
    const admin = await newPage(browser);
    const cliente = await newPage(browser);
    await loginWith(pro, newPro);
    await visit(pro, '/pro/portafolio', 'pro-portafolio-vacio');

    await test.step('sube dos fotos (consentimiento de imagenes la primera vez)', async () => {
      await pro
        .getByLabel('Subir foto', { exact: true })
        .setInputFiles(resolve(FIXTURES, 'pixel.png'));
      const dialog = pro.getByTestId('consent-required-dialog');
      await expect(dialog).toContainText('Consentimiento de uso de imágenes');
      await dialog.getByRole('button', { name: 'Acepto y continuar' }).click();
      await expect(dialog).toBeHidden();
      await expect(pro.getByText('Foto subida')).toBeVisible();
      await pro
        .getByLabel('Subir foto', { exact: true })
        .setInputFiles(resolve(FIXTURES, 'pixel.png'));
      await expect(
        pro.getByRole('button', { name: 'Eliminar foto' }),
      ).toHaveCount(2);
    });

    await test.step('describe cada foto y oculta una', async () => {
      const captions = pro.getByPlaceholder('Descripción breve (opcional)');
      await captions.nth(0).fill(visible);
      await captions.nth(0).blur();
      await captions.nth(1).fill(hidden);
      await captions.nth(1).blur();
      await settle(pro);
      const second = pro.locator('div.rounded-lg.border').filter({
        has: pro.locator(`input[value="${hidden}"]`),
      });
      await second.getByRole('switch', { name: 'Visible' }).click();
      await expect(
        second.getByRole('switch', { name: 'Visible' }),
      ).not.toBeChecked();
      await scanA11y(pro, 'pro-portafolio-con-fotos');
      // Las imagenes del propio portafolio cargan por presigned (no hay placeholder).
      await expect(pro.getByTestId('image-placeholder')).toHaveCount(0);
      await expect(pro.getByRole('img', { name: visible })).toBeVisible();
    });

    await test.step('el admin aprueba ambas en la cola de portafolio', async () => {
      await loginUi(admin, 'admin');
      await visit(
        admin,
        '/admin/professional-portfolio',
        'admin-professional-portfolio',
      );
      for (const caption of [visible, hidden]) {
        const row = await findRowAcrossPages(admin, caption);
        await row.getByRole('button', { name: 'Revisar' }).click();
        const dialog = admin.getByRole('dialog');
        await expect(dialog).toBeVisible();
        await expect(dialog.getByTestId('image-placeholder')).toHaveCount(0);
        await scanA11y(admin, 'admin-portafolio-dialogo');
        await dialog.getByRole('button', { name: 'Aprobar' }).click();
        await expect(dialog).toBeHidden();
      }
    });

    await test.step('el cliente ve solo la foto aprobada y visible en el perfil publico', async () => {
      await loginUi(cliente, 'cliente_a');
      await cliente.goto(`/profesionales/${proRef}`);
      await settle(cliente);
      await expect(cliente.getByText('Trabajos anteriores')).toBeVisible();
      await expect(cliente.getByRole('img', { name: visible })).toBeVisible();
      await expect(cliente.getByRole('img', { name: hidden })).toHaveCount(0);
      await expect(cliente.getByTestId('image-placeholder')).toHaveCount(0);
      await scanA11y(cliente, 'profesional-detalle-portafolio');
    });
    await pro.context().close();
    await admin.context().close();
    await cliente.context().close();
  });
});
