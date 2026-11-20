/**
 * Suite: imagenes y documentos servidos por URL presignada (portafolio, documentos del admin y
 * propios, avatar): cargan bien y, ante un 403/404 del presigned, muestran un placeholder o un aviso
 * (nunca una imagen rota). Contra el backend REAL de e2e; el 403/404 se inyecta con `page.route`.
 * Casos: CP-WEB-IMG-101..104 (ver test/qa/casos/CP-ONB.md)
 * Tipo: e2e (+ a11y)   Prioridad: P1
 * Precondiciones: stack e2e del Backend arriba y sembrado; fixtures admin, cliente_a, cliente_b y
 *   pro_aprobado. Las fotos y documentos de prueba se crean por API (BFF) y se limpian al final.
 * Trazabilidad: plan maestro M3 (uploads), contrato W2 (presigned 403/404, TTL <= 300 s),
 *   DEF-WEB-008 (imagen rota ante 403/404 del presigned).
 */
import {
  expect,
  test,
  type APIRequestContext,
  type Browser,
  type Page,
} from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  findRowAcrossPages,
  loginUi,
  newBffContext,
  newBffContextWith,
  registerViaApi,
  scanA11y,
  setTheme,
  settle,
  unwrap,
} from './support';

const FIXTURES = resolve(process.cwd(), 'e2e', 'real', 'fixtures');
const RUN_ID = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e3)}`;
const be = (p: string) => `/api/backend/${p}`;
const PRESIGNED = '**/api/backend/uploads/presigned-url**';

let baseURL: string;
let pro: APIRequestContext;
let admin: APIRequestContext;
let itemRef = '';
const CAPTION = `Presigned-${RUN_ID}`;

async function newPage(browser: Browser): Promise<Page> {
  const ctx = await browser.newContext({ locale: 'es-PY' });
  const page = await ctx.newPage();
  await setTheme(page, 'light');
  return page;
}

async function failPresigned(page: Page, status: 403 | 404): Promise<void> {
  await page.route(PRESIGNED, (route) =>
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: {
          code: status,
          message: status === 403 ? 'Sin permiso' : 'Archivo no encontrado',
          error: status === 403 ? 'Forbidden' : 'Not Found',
          timestamp: new Date().toISOString(),
          path: '/uploads/presigned-url',
        },
      }),
    }),
  );
}

test.describe.serial('Imagenes y documentos por presigned', () => {
  test.beforeAll(async ({}, testInfo) => {
    baseURL = String(testInfo.project.use.baseURL);
    pro = await newBffContext(baseURL, 'pro_aprobado');
    admin = await newBffContext(baseURL, 'admin');
    // Foto de portafolio aprobada y visible de pro_aprobado (con consentimiento de imagenes).
    const pending = (await unwrap<
      { referenceId: string; documentType: string }[]
    >(await pro.get(be('legal/consents/pending'))))!;
    for (const v of pending.filter(
      (x) => x.documentType === 'IMAGE_USAGE_CONSENT',
    )) {
      await pro.post(be(`legal/consents/${v.referenceId}/accept`));
    }
    const up = await pro.post(be('professionals/me/portfolio'), {
      multipart: {
        file: {
          name: 'pixel.png',
          mimeType: 'image/png',
          buffer: readFileSync(resolve(FIXTURES, 'pixel.png')),
        },
        caption: CAPTION,
      },
    });
    expect(up.status(), 'subir foto de portafolio').toBe(201);
    itemRef = (await unwrap<{ referenceId: string }>(up)).referenceId;
    const review = await admin.patch(
      be(`admin/professional-portfolio/${itemRef}/review`),
      { data: { status: 'APPROVED' } },
    );
    expect(review.status(), 'aprobar la foto').toBe(200);
  });

  test.afterAll(async () => {
    await pro?.delete(be(`professionals/me/portfolio/${itemRef}`));
    await pro?.dispose();
    await admin?.dispose();
  });

  test('CP-WEB-IMG-101 el portafolio propio y el perfil publico cargan la imagen por presigned', async ({
    browser,
  }) => {
    const proPage = await newPage(browser);
    const cliente = await newPage(browser);
    await loginUi(proPage, 'pro_aprobado');
    await loginUi(cliente, 'cliente_a');

    await proPage.goto('/pro/portafolio');
    await settle(proPage);
    const mine = proPage.getByRole('img', { name: CAPTION });
    await expect(mine).toBeVisible();
    await expect
      .poll(() => mine.evaluate((el: HTMLImageElement) => el.naturalWidth))
      .toBeGreaterThan(0);
    await expect(proPage.getByTestId('image-placeholder')).toHaveCount(0);
    await scanA11y(proPage, 'pro-portafolio-imagen');

    const meRes = await pro.get(be('professionals/me'));
    const ref = (await unwrap<{ referenceId: string }>(meRes)).referenceId;
    await cliente.goto(`/profesionales/${ref}`);
    await settle(cliente);
    const pub = cliente.getByRole('img', { name: CAPTION });
    await expect(pub).toBeVisible();
    await expect
      .poll(() => pub.evaluate((el: HTMLImageElement) => el.naturalWidth))
      .toBeGreaterThan(0);
    await scanA11y(cliente, 'profesional-detalle-imagen');
    await proPage.context().close();
    await cliente.context().close();
  });

  for (const status of [403, 404] as const) {
    test(`CP-WEB-IMG-102 ante ${status} del presigned las vistas de portafolio muestran placeholder, no imagen rota`, async ({
      browser,
    }) => {
      const proPage = await newPage(browser);
      const cliente = await newPage(browser);
      await loginUi(proPage, 'pro_aprobado');
      await loginUi(cliente, 'cliente_a');
      await failPresigned(proPage, status);
      await failPresigned(cliente, status);

      await proPage.goto('/pro/portafolio');
      await settle(proPage);
      await expect(
        proPage.getByTestId('image-placeholder').first(),
      ).toBeVisible();
      await expect(proPage.getByRole('img', { name: CAPTION })).toHaveCount(0);
      await scanA11y(proPage, `pro-portafolio-placeholder-${status}`);

      const ref = (
        await unwrap<{ referenceId: string }>(
          await pro.get(be('professionals/me')),
        )
      ).referenceId;
      await cliente.goto(`/profesionales/${ref}`);
      await settle(cliente);
      await expect(
        cliente.getByTestId('image-placeholder').first(),
      ).toBeVisible();
      await expect(cliente.getByRole('img', { name: CAPTION })).toHaveCount(0);
      await scanA11y(cliente, `profesional-detalle-placeholder-${status}`);
      await proPage.context().close();
      await cliente.context().close();
    });
  }

  test('CP-WEB-IMG-103 la revision del admin muestra placeholder o aviso ante 403/404 del presigned', async ({
    browser,
  }) => {
    // Foto PENDING + documento PENDING de un profesional descartable para la cola del admin.
    const creds = await registerViaApi(baseURL, {
      firstName: 'Descartable',
      lastName: `Img${RUN_ID.replace(/[0-9]/g, (d) => 'abcdefghij'[Number(d)])}`,
    });
    const user = await newBffContextWith(baseURL, creds);
    const lastName = `Img${RUN_ID.replace(/[0-9]/g, (d) => 'abcdefghij'[Number(d)])}`;
    await user.post(be('professionals'), {
      data: {
        categoryId: 1,
        description: 'Descartable (e2e)',
        hourlyRate: 1000,
      },
    });
    const pending = (await unwrap<
      { referenceId: string; documentType: string }[]
    >(await user.get(be('legal/consents/pending'))))!;
    for (const v of pending) {
      await user.post(be(`legal/consents/${v.referenceId}/accept`));
    }
    const types = await unwrap<{
      data: { documentType: { referenceId: string; name: string } }[];
    }>(await user.get(be('professionals/me/documents')));
    const docType = types.data[0].documentType;
    const docUp = await user.post(be('professionals/me/documents'), {
      multipart: {
        file: {
          name: 'doc.pdf',
          mimeType: 'application/pdf',
          buffer: readFileSync(resolve(FIXTURES, 'documento.pdf')),
        },
        professionalDocumentTypeReferenceId: docType.referenceId,
      },
    });
    expect(docUp.status()).toBe(201);
    const docRef = (await unwrap<{ referenceId: string }>(docUp)).referenceId;
    const photoUp = await user.post(be('professionals/me/portfolio'), {
      multipart: {
        file: {
          name: 'pixel.png',
          mimeType: 'image/png',
          buffer: readFileSync(resolve(FIXTURES, 'pixel.png')),
        },
        caption: `Revision-${RUN_ID}`,
      },
    });
    expect(photoUp.status()).toBe(201);
    const photoRef = (await unwrap<{ referenceId: string }>(photoUp))
      .referenceId;

    const page = await newPage(browser);
    await loginUi(page, 'admin');

    await test.step('documentos: con presigned OK hay enlace; con 403/404 hay aviso', async () => {
      await page.goto('/admin/professional-documents');
      await settle(page);
      const row = await findRowAcrossPages(page, new RegExp(lastName));
      await row.getByRole('button', { name: 'Revisar' }).click();
      const dialog = page.getByRole('dialog');
      await expect(
        dialog.getByRole('button', { name: 'Ver archivo' }),
      ).toBeVisible();
      await expect(dialog.getByTestId('file-unavailable')).toHaveCount(0);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();

      await failPresigned(page, 403);
      await page.reload();
      await settle(page);
      const row2 = await findRowAcrossPages(page, new RegExp(lastName));
      await row2.getByRole('button', { name: 'Revisar' }).click();
      await expect(page.getByTestId('file-unavailable')).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Ver archivo' }),
      ).toHaveCount(0);
      await scanA11y(page, 'admin-documento-presigned-403');
      await page.keyboard.press('Escape');
      await page.unroute(PRESIGNED);
    });

    await test.step('portafolio: con 404 el dialogo muestra placeholder', async () => {
      await failPresigned(page, 404);
      await page.goto('/admin/professional-portfolio');
      await settle(page);
      const row = await findRowAcrossPages(page, `Revision-${RUN_ID}`);
      await row.getByRole('button', { name: 'Revisar' }).click();
      await expect(
        page.getByRole('dialog').getByTestId('image-placeholder'),
      ).toBeVisible();
      await scanA11y(page, 'admin-portafolio-presigned-404');
      await page.keyboard.press('Escape');
      await page.unroute(PRESIGNED);
    });

    // Limpieza: deja ambos elementos en estado terminal (la cola PENDING no acumula basura).
    await admin.patch(be(`admin/professional-documents/${docRef}/review`), {
      data: { status: 'REJECTED', rejectionReason: 'Limpieza e2e' },
    });
    await admin.patch(be(`admin/professional-portfolio/${photoRef}/review`), {
      data: { status: 'REJECTED', rejectionReason: 'Limpieza e2e' },
    });
    await user.dispose();
    await page.context().close();
  });

  test('CP-WEB-IMG-104 avatar: se sube, carga por presigned y ante imagen caida muestra las iniciales', async ({
    browser,
  }) => {
    const page = await newPage(browser);
    await loginUi(page, 'cliente_b');
    await page.goto('/perfil');
    await settle(page);
    // La subida es multipart a /uploads/avatar y despues se persiste la key con PUT /auth/me.
    const saved = page.waitForResponse(
      (r) =>
        r.url().endsWith('/api/backend/auth/me') &&
        r.request().method() === 'PUT',
    );
    await page
      .getByLabel('Subir foto de perfil')
      .setInputFiles(resolve(FIXTURES, 'pixel.png'));
    expect((await saved).status()).toBe(200);

    // Recarga: el avatar viene de una URL presignada de la sesion y debe cargar.
    await page.reload();
    await settle(page);
    const avatar = page.locator('[data-slot="avatar-image"]').first();
    await expect(avatar).toBeVisible();
    await expect
      .poll(() => avatar.evaluate((el: HTMLImageElement) => el.naturalWidth))
      .toBeGreaterThan(0);
    await scanA11y(page, 'perfil-avatar');

    // Imagen caida (el archivo del presigned ya no responde): quedan las iniciales, sin <img> roto.
    await page.route(/\/(uploads|avatars?|.*\.png).*X-Amz-/i, (route) =>
      route.abort(),
    );
    await page.reload();
    await settle(page);
    await expect(
      page.locator('[data-slot="avatar-fallback"]').first(),
    ).toBeVisible();
    await expect(page.locator('[data-slot="avatar-image"]')).toHaveCount(0);
    await page.context().close();
  });
});
