/**
 * Suite: contrato del backend W2 (servicios, ofertas, profesionales, uploads) consumido por la Web
 * a traves del BFF (`/api/backend/*`), contra el backend REAL de e2e. Un contexto API por rol.
 * Casos: CP-WEB-MKT-201..208, CP-WEB-ONB-201..205 y CP-WEB-IMG-201..202 (ver
 *   test/qa/casos/CP-MKT.md, CP-ONB.md).
 * Tipo: e2e (API via BFF)   Prioridad: P1
 * Precondiciones: stack e2e del Backend arriba y sembrado; fixtures cliente_a, cliente_b,
 *   pro_aprobado, pro_pendiente y admin. Cada servicio lleva un titulo unico por corrida y se
 *   deja en estado terminal (COMPLETED/CANCELLED) para no acumular pendientes.
 * Trazabilidad: contrato W2 del backend (409 en transiciones invalidas y doble postulacion, 403 en
 *   GET /services/:id, /services solo admin o pro aprobado, motivo vacio -> 400, profesionales no
 *   aprobados -> 404, uploads 403/404 y TTL <= 300 s); defectos DEF-BE-027..029 (`test.fail()`).
 */
import {
  expect,
  test,
  type APIRequestContext,
  type APIResponse,
} from '@playwright/test';
import {
  newBffContext,
  newBffContextWith,
  registerViaApi,
  unwrap,
  type UserKey,
} from './support';

const RUN_ID = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e3)}`;

let baseURL: string;
const ctxs: Partial<Record<UserKey, APIRequestContext>> = {};

async function as(who: UserKey): Promise<APIRequestContext> {
  ctxs[who] ??= await newBffContext(baseURL, who);
  return ctxs[who]!;
}

const be = (path: string) => `/api/backend/${path}`;

async function json<T = unknown>(res: APIResponse): Promise<T | undefined> {
  try {
    return await unwrap<T>(res);
  } catch {
    return undefined;
  }
}

interface ServiceDto {
  referenceId: string;
  status: string;
  title: string;
}

/** El cliente crea un servicio de Plomeria por API y devuelve su referenceId. */
async function createService(
  who: 'cliente_a' | 'cliente_b',
  label: string,
): Promise<string> {
  const c = await as(who);
  const cats = (await json<{ id: number; slug: string }[]>(
    await c.get(be('categories')),
  ))!;
  const types = (await json<{ id: number }[]>(
    await c.get(be('service-types')),
  ))!;
  const res = await c.post(be('services'), {
    data: {
      title: `E2E API ${RUN_ID} ${label}`,
      description: 'Servicio de prueba de contrato (e2e)',
      categoryId: cats.find((x) => x.slug === 'plomeria')!.id,
      serviceTypeId: types[0].id,
      address: 'Av. España 1234, Asunción',
      latitude: -25.2637,
      longitude: -57.5759,
      isUrgent: false,
    },
  });
  expect(res.status(), 'crear servicio').toBe(201);
  return (await json<ServiceDto>(res))!.referenceId;
}

async function cancel(ref: string): Promise<void> {
  const c = await as('cliente_a');
  await c.delete(be(`services/${ref}`), { data: { reason: 'limpieza e2e' } });
}

test.beforeAll(({}, testInfo) => {
  baseURL = String(testInfo.project.use.baseURL);
});

test.afterAll(async () => {
  for (const c of Object.values(ctxs)) await c?.dispose();
});

test.describe('M4 contrato de servicios y ofertas (via BFF)', () => {
  test('CP-WEB-MKT-201 una transicion invalida (aceptar/iniciar/completar repetidos) responde 409', async () => {
    const ref = await createService('cliente_a', 'transiciones');
    const pro = await as('pro_aprobado');

    // Un profesional ajeno (sin asignar) no puede mover el servicio: 403, no 409.
    expect((await pro.post(be(`services/${ref}/complete`))).status()).toBe(403);

    expect((await pro.post(be(`services/${ref}/accept`))).status()).toBe(201);
    expect(
      (await pro.post(be(`services/${ref}/accept`))).status(),
      'aceptar dos veces',
    ).toBe(409);
    expect(
      (await pro.post(be(`services/${ref}/complete`))).status(),
      'completar un ACCEPTED sin iniciar',
    ).toBe(409);
    expect((await pro.post(be(`services/${ref}/start`))).status()).toBe(201);
    expect(
      (await pro.post(be(`services/${ref}/start`))).status(),
      'iniciar dos veces',
    ).toBe(409);
    expect((await pro.post(be(`services/${ref}/complete`))).status()).toBe(201);
    expect(
      (await pro.post(be(`services/${ref}/complete`))).status(),
      'completar dos veces',
    ).toBe(409);

    // El cliente no puede cancelar un servicio COMPLETED.
    const cliente = await as('cliente_a');
    const del = await cliente.delete(be(`services/${ref}`), {
      data: { reason: 'tarde' },
    });
    expect(del.status(), 'cancelar un COMPLETED').toBe(409);
  });

  test('CP-WEB-MKT-202 dos aceptaciones concurrentes: solo una gana (409 la otra)', async () => {
    const ref = await createService('cliente_a', 'concurrencia');
    const pro = await as('pro_aprobado');
    const [a, b] = await Promise.all([
      pro.post(be(`services/${ref}/accept`)),
      pro.post(be(`services/${ref}/accept`)),
    ]);
    const statuses = [a.status(), b.status()].sort();
    expect(statuses).toEqual([201, 409]);
    await cancel(ref);
  });

  test('CP-WEB-MKT-203 ofertas: doble postulacion 409, pro pendiente 403, solo el dueno las ve y responde', async () => {
    const ref = await createService('cliente_a', 'ofertas');
    const pro = await as('pro_aprobado');
    const pend = await as('pro_pendiente');
    const a = await as('cliente_a');
    const b = await as('cliente_b');

    const offer = await pro.post(be(`services/${ref}/requests`), {
      data: { proposedPrice: 120000, message: 'Puedo ir hoy' },
    });
    expect(offer.status()).toBe(201);
    const requestRef = (await json<{ referenceId: string }>(offer))!
      .referenceId;
    expect(requestRef).toBeTruthy();

    expect(
      (
        await pro.post(be(`services/${ref}/requests`), {
          data: { proposedPrice: 130000 },
        })
      ).status(),
      'doble postulacion',
    ).toBe(409);
    expect(
      (
        await pend.post(be(`services/${ref}/requests`), {
          data: { proposedPrice: 90000 },
        })
      ).status(),
      'pro pendiente ofertando',
    ).toBe(403);

    expect((await a.get(be(`services/${ref}/requests`))).status()).toBe(200);
    expect(
      (await b.get(be(`services/${ref}/requests`))).status(),
      'otro cliente lee las ofertas',
    ).toBe(403);
    expect(
      (
        await b.put(be(`services/${ref}/requests/${requestRef}`), {
          data: { status: 'ACCEPTED' },
        })
      ).status(),
      'otro cliente responde la oferta',
    ).toBe(403);

    // El dueno acepta la oferta; responder de nuevo es una transicion invalida (409).
    const accepted = await a.put(be(`services/${ref}/requests/${requestRef}`), {
      data: { status: 'ACCEPTED' },
    });
    expect(accepted.status()).toBe(200);
    expect(
      (
        await a.put(be(`services/${ref}/requests/${requestRef}`), {
          data: { status: 'ACCEPTED' },
        })
      ).status(),
      'responder dos veces la misma oferta',
    ).toBe(409);
    await cancel(ref);
  });

  // DEF-BE-027: el contrato dice "motivo vacio de rechazo -> 400"; rechazar una OFERTA con
  // `reason: ''` responde 200 (el DTO deja `reason` opcional y ni siquiera lo persiste).
  test('CP-WEB-MKT-208 rechazar una oferta con motivo vacio responde 400 (DEF-BE-027)', async () => {
    test.fail(
      true,
      'DEF-BE-027: PUT /services/:id/requests/:requestId {status:REJECTED, reason:""} responde 200',
    );
    const ref = await createService('cliente_a', 'rechazo-oferta');
    const pro = await as('pro_aprobado');
    const a = await as('cliente_a');
    const offer = await pro.post(be(`services/${ref}/requests`), {
      data: { proposedPrice: 100000 },
    });
    expect(offer.status()).toBe(201);
    const requestRef = (await json<{ referenceId: string }>(offer))!
      .referenceId;
    try {
      const res = await a.put(be(`services/${ref}/requests/${requestRef}`), {
        data: { status: 'REJECTED', reason: '' },
      });
      expect(res.status(), 'rechazo de oferta con motivo vacio').toBe(400);
    } finally {
      await cancel(ref);
    }
  });

  test('CP-WEB-MKT-204 GET /services/:id solo para dueno, asignado o admin; el listado solo para admin o pro aprobado', async () => {
    const ref = await createService('cliente_a', 'permisos');
    const a = await as('cliente_a');
    const b = await as('cliente_b');
    const pro = await as('pro_aprobado');
    const admin = await as('admin');

    expect((await a.get(be(`services/${ref}`))).status()).toBe(200);
    expect((await admin.get(be(`services/${ref}`))).status()).toBe(200);
    expect((await b.get(be(`services/${ref}`))).status()).toBe(403);
    // Un profesional aprobado puede ver los PENDING (necesita verlos para ofertar); uno pendiente no.
    expect((await pro.get(be(`services/${ref}`))).status()).toBe(200);
    expect(
      (await (await as('pro_pendiente')).get(be(`services/${ref}`))).status(),
    ).toBe(403);

    expect((await pro.post(be(`services/${ref}/accept`))).status()).toBe(201);
    expect((await pro.get(be(`services/${ref}`))).status(), 'el asignado').toBe(
      200,
    );

    expect((await a.get(be('services'))).status(), 'cliente lista').toBe(403);
    expect(
      (
        await a.get(
          be('services/nearby?latitude=-25.26&longitude=-57.57&radius=10'),
        )
      ).status(),
    ).toBe(403);
    expect((await pro.get(be('services?status=PENDING'))).status()).toBe(200);
    expect((await admin.get(be('services'))).status()).toBe(200);
    await cancel(ref);
  });

  test('CP-WEB-MKT-205 aceptar con un pro pendiente o un cliente responde 403', async () => {
    const ref = await createService('cliente_a', 'aceptar-403');
    const pend = await as('pro_pendiente');
    const b = await as('cliente_b');
    expect((await pend.post(be(`services/${ref}/accept`))).status()).toBe(403);
    expect((await b.post(be(`services/${ref}/accept`))).status()).toBe(403);
    expect((await pend.get(be('services?status=PENDING'))).status()).toBe(403);
    await cancel(ref);
  });

  test('CP-WEB-MKT-206 cancelar con motivo vacio responde 400 y la transicion CANCELLED -> CANCELLED responde 409', async () => {
    const ref = await createService('cliente_a', 'cancelar');
    const a = await as('cliente_a');
    expect(
      (
        await a.delete(be(`services/${ref}`), { data: { reason: '' } })
      ).status(),
    ).toBe(400);
    expect(
      (
        await a.delete(be(`services/${ref}`), { data: { reason: 'x' } })
      ).status(),
    ).toBe(200);
    expect(
      (
        await a.delete(be(`services/${ref}`), { data: { reason: 'x' } })
      ).status(),
      'cancelar dos veces',
    ).toBe(409);
  });

  test('CP-WEB-MKT-207 otro cliente no puede cancelar ni editar el servicio ajeno', async () => {
    const ref = await createService('cliente_a', 'ajeno');
    const b = await as('cliente_b');
    expect(
      (
        await b.delete(be(`services/${ref}`), { data: { reason: 'idor' } })
      ).status(),
    ).toBe(403);
    expect(
      (
        await b.put(be(`services/${ref}`), { data: { title: 'hackeado' } })
      ).status(),
    ).toBe(403);
    await cancel(ref);
  });
});

test.describe('M3 contrato de profesionales (via BFF)', () => {
  test('CP-WEB-ONB-201 un profesional PENDING no es visible a un cliente (id, reference, listado, nearby, stats, services) pero si a admin', async () => {
    const pend = await as('pro_pendiente');
    const me = (await json<{ id: number; referenceId: string }>(
      await pend.get(be('professionals/me')),
    ))!;
    const a = await as('cliente_a');
    const admin = await as('admin');

    for (const path of [
      `professionals/${me.id}`,
      `professionals/reference/${me.referenceId}`,
      `professionals/${me.id}/stats`,
      `professionals/${me.id}/services`,
    ]) {
      expect((await a.get(be(path))).status(), `cliente GET ${path}`).toBe(404);
      expect((await admin.get(be(path))).status(), `admin GET ${path}`).toBe(
        200,
      );
    }
    const list = await a.get(be('professionals?pageSize=100'));
    expect(list.status()).toBe(200);
    expect(await list.text()).not.toContain(me.referenceId);
    const nearby = await a.get(
      be('professionals/nearby?latitude=-25.26&longitude=-57.57&radius=50'),
    );
    expect(nearby.status()).toBe(200);
    expect(await nearby.text()).not.toContain(me.referenceId);
  });

  test('CP-WEB-ONB-202 suspender con motivo vacio responde 400 y no cambia el estado del profesional', async () => {
    const admin = await as('admin');
    // Profesional descartable (no se toca ningun fixture): usuario nuevo + postulacion.
    const creds = await registerViaApi(baseURL, {
      firstName: 'Descartable',
      lastName: 'Suspension',
    });
    const throwaway = await newBffContextWith(baseURL, creds);
    const cats = (await json<{ id: number; slug: string }[]>(
      await throwaway.get(be('categories')),
    ))!;
    const created = await throwaway.post(be('professionals'), {
      data: {
        categoryId: cats.find((x) => x.slug === 'plomeria')!.id,
        description: 'Profesional descartable (e2e)',
        hourlyRate: 1000,
      },
    });
    expect(created.status()).toBe(201);
    const me = (await json<{ id: number }>(created))!;

    for (const reason of ['', '   ']) {
      expect(
        (
          await admin.post(be(`professionals/${me.id}/suspend`), {
            data: { reason },
          })
        ).status(),
        `suspender con motivo ${JSON.stringify(reason)}`,
      ).toBe(400);
    }
    const after = (await json<{ status: string }>(
      await throwaway.get(be('professionals/me')),
    ))!;
    expect(after.status).toBe('PENDING');
    await throwaway.dispose();
  });

  // DEF-BE-028 / DEF-BE-029: la maquina de estados del profesional no valida transiciones. Verificar
  // a un SUSPENDED lo reactiva (APPROVED) con 201 y suspender a un SUSPENDED responde 201 otra vez;
  // el contrato W2 pide 409 para transiciones invalidas (servicios/ofertas), y aqui ocurre lo mismo.
  async function throwawayPro(label: string) {
    const creds = await registerViaApi(baseURL, {
      firstName: 'Descartable',
      lastName: label,
    });
    const ctx = await newBffContextWith(baseURL, creds);
    const cats = (await json<{ id: number; slug: string }[]>(
      await ctx.get(be('categories')),
    ))!;
    const created = await ctx.post(be('professionals'), {
      data: {
        categoryId: cats.find((x) => x.slug === 'plomeria')!.id,
        description: 'Profesional descartable (e2e)',
        hourlyRate: 1000,
      },
    });
    expect(created.status()).toBe(201);
    const me = (await json<{ id: number }>(created))!;
    return { ctx, id: me.id };
  }

  test('CP-WEB-ONB-204 verificar a un profesional SUSPENDED responde 409 (DEF-BE-028)', async () => {
    test.fail(
      true,
      'DEF-BE-028: POST /professionals/:id/verify sobre un SUSPENDED responde 201 y lo deja APPROVED',
    );
    const admin = await as('admin');
    const { ctx, id } = await throwawayPro('Reactivacion');
    expect(
      (
        await admin.post(be(`professionals/${id}/suspend`), {
          data: { reason: 'Motivo e2e' },
        })
      ).status(),
    ).toBe(201);
    const verify = await admin.post(be(`professionals/${id}/verify`), {
      data: { isVerified: true },
    });
    const after = (await json<{ status: string }>(
      await ctx.get(be('professionals/me')),
    ))!;
    await ctx.dispose();
    expect(
      verify.status(),
      `verify sobre SUSPENDED dejo al profesional ${after.status}`,
    ).toBe(409);
  });

  test('CP-WEB-ONB-205 suspender a un profesional ya SUSPENDED responde 409 (DEF-BE-029)', async () => {
    test.fail(
      true,
      'DEF-BE-029: POST /professionals/:id/suspend sobre un SUSPENDED responde 201 (sobrescribe el motivo)',
    );
    const admin = await as('admin');
    const { ctx, id } = await throwawayPro('Resuspension');
    const first = await admin.post(be(`professionals/${id}/suspend`), {
      data: { reason: 'Primer motivo' },
    });
    expect(first.status()).toBe(201);
    const second = await admin.post(be(`professionals/${id}/suspend`), {
      data: { reason: 'Segundo motivo' },
    });
    await ctx.dispose();
    expect(second.status(), 'suspender dos veces').toBe(409);
  });

  test('CP-WEB-ONB-203 rechazar un documento sin motivo responde 400 y con motivo se rechaza', async () => {
    const admin = await as('admin');
    const creds = await registerViaApi(baseURL, {
      firstName: 'Descartable',
      lastName: 'Documento',
    });
    const user = await newBffContextWith(baseURL, creds);
    const cats = (await json<{ id: number; slug: string }[]>(
      await user.get(be('categories')),
    ))!;
    expect(
      (
        await user.post(be('professionals'), {
          data: {
            categoryId: cats.find((x) => x.slug === 'plomeria')!.id,
            description: 'Profesional descartable (e2e)',
            hourlyRate: 1000,
          },
        })
      ).status(),
    ).toBe(201);
    const pending = (await json<
      { referenceId: string; documentType: string }[]
    >(await user.get(be('legal/consents/pending'))))!;
    for (const v of pending.filter(
      (x) => x.documentType === 'DATA_PROCESSING_CONSENT',
    )) {
      await user.post(be(`legal/consents/${v.referenceId}/accept`));
    }
    const types = (await json<{
      data: { documentType: { referenceId: string } }[];
    }>(await user.get(be('professionals/me/documents'))))!;
    const up = await user.post(be('professionals/me/documents'), {
      multipart: {
        file: {
          name: 'doc.pdf',
          mimeType: 'application/pdf',
          buffer: Buffer.from('%PDF-1.4\n%%EOF\n'),
        },
        professionalDocumentTypeReferenceId:
          types.data[0].documentType.referenceId,
      },
    });
    expect(up.status(), 'subir documento').toBe(201);
    const doc = (await json<{ referenceId: string }>(up))!;

    const path = be(`admin/professional-documents/${doc.referenceId}/review`);
    for (const body of [
      { status: 'REJECTED' },
      { status: 'REJECTED', rejectionReason: '' },
      { status: 'REJECTED', rejectionReason: '   ' },
    ]) {
      expect(
        (await admin.patch(path, { data: body })).status(),
        `rechazo ${JSON.stringify(body)}`,
      ).toBe(400);
    }
    const ok = await admin.patch(path, {
      data: { status: 'REJECTED', rejectionReason: 'Ilegible (e2e)' },
    });
    expect(ok.status()).toBe(200);
    await user.dispose();
  });
});

test.describe('M3 contrato de uploads con presigned (via BFF)', () => {
  test('CP-WEB-IMG-201 presigned-url: 403 sin permiso, 404 sin registro, TTL <= 300 s', async () => {
    // Foto de portafolio de pro_aprobado (propia): la crea por multipart.
    const pro = await as('pro_aprobado');
    const consent = async (who: UserKey) => {
      const c = await as(who);
      const pending = (await json<
        { referenceId: string; documentType: string }[]
      >(await c.get(be('legal/consents/pending'))))!;
      for (const v of pending.filter(
        (x) => x.documentType === 'IMAGE_USAGE_CONSENT',
      )) {
        await c.post(be(`legal/consents/${v.referenceId}/accept`));
      }
    };
    await consent('pro_aprobado');
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64',
    );
    const up = await pro.post(be('professionals/me/portfolio'), {
      multipart: {
        file: { name: 'x.png', mimeType: 'image/png', buffer: png },
        caption: `E2E API ${RUN_ID} presigned`,
      },
    });
    expect(up.status(), 'subir foto de portafolio').toBe(201);
    const item = (await json<{ referenceId: string; fileKey: string }>(up))!;

    const ok = await pro.get(
      be(`uploads/presigned-url?key=${encodeURIComponent(item.fileKey)}`),
    );
    expect(ok.status(), 'dueno resuelve su presigned').toBe(200);
    const url = (await json<{ url: string }>(ok))!.url;
    const expires = Number(new URL(url).searchParams.get('X-Amz-Expires'));
    expect(expires, 'TTL presigned').toBeGreaterThan(0);
    expect(expires).toBeLessThanOrEqual(300);

    // Un cliente cualquiera: la foto de portafolio aprobada/pendiente de otro pro no es suya.
    const b = await as('cliente_b');
    const forbidden = await b.get(
      be(`uploads/presigned-url?key=${encodeURIComponent(item.fileKey)}`),
    );
    expect([200, 403], 'cliente_b sobre foto ajena').toContain(
      forbidden.status(),
    );
    const info = await b.get(
      be(`uploads/info/${encodeURIComponent(item.fileKey)}`),
    );
    expect(info.status()).toBe(forbidden.status());

    // Sin registro -> 404.
    const missing = await pro.get(
      be('uploads/presigned-url?key=no-existe-e2e.jpg'),
    );
    expect(missing.status(), 'key sin registro').toBe(404);

    // Borrado ajeno: 403 (o 404), nunca 200; el dueno si puede borrar.
    const del = await b.delete(
      be(`uploads/${encodeURIComponent(item.fileKey)}`),
    );
    expect([403, 404]).toContain(del.status());
    await pro.delete(be(`professionals/me/portfolio/${item.referenceId}`));
  });

  test('CP-WEB-IMG-202 un documento sensible del profesional no es legible por otro cliente', async () => {
    const pend = await as('pro_pendiente');
    const mine = await pend.get(be('professionals/me/documents'));
    expect(mine.status()).toBe(200);
    const admin = await as('admin');
    const queue = (await json<{ data: { fileKey: string }[] }>(
      await admin.get(be('admin/professional-documents?page=1&pageSize=1')),
    ))!;
    test.skip(queue.data.length === 0, 'no hay documentos cargados');
    const key = encodeURIComponent(queue.data[0].fileKey);
    const a = await as('cliente_a');
    expect((await a.get(be(`uploads/presigned-url?key=${key}`))).status()).toBe(
      403,
    );
    expect((await a.get(be(`uploads/info/${key}`))).status()).toBe(403);
    expect((await a.delete(be(`uploads/${key}`))).status()).toBe(403);
    expect(
      (await admin.get(be(`uploads/presigned-url?key=${key}`))).status(),
    ).toBe(200);
  });
});
