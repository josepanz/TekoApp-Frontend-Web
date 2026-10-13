import AxeBuilder from '@axe-core/playwright';
import {
  expect,
  request as pwRequest,
  test,
  type APIRequestContext,
  type Locator,
  type Page,
} from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const BACKEND_API_URL =
  process.env.E2E_BACKEND_API_URL ??
  'http://localhost:3100/tekoapp-backend/api';

const PASSWORD = 'E2e-Passw0rd!';
export const USERS = {
  admin: { email: 'admin@tekoapp.com.py', password: 'Tekoapp123!' },
  cliente_a: { email: 'cliente_a@e2e.tekoapp.local', password: PASSWORD },
  cliente_b: { email: 'cliente_b@e2e.tekoapp.local', password: PASSWORD },
  pro_aprobado: { email: 'pro_aprobado@e2e.tekoapp.local', password: PASSWORD },
  pro_pendiente: {
    email: 'pro_pendiente@e2e.tekoapp.local',
    password: PASSWORD,
  },
  compliance: { email: 'compliance@e2e.tekoapp.local', password: PASSWORD },
} as const;
export type UserKey = keyof typeof USERS;

/** Secret Basic Auth del cliente `tekoapp-web` de ESTA corrida del backend (nunca hardcodeado). */
export function readWebClientSecret(): string {
  if (process.env.E2E_BACKEND_CLIENT_SECRET)
    return process.env.E2E_BACKEND_CLIENT_SECRET;
  const dir = resolve(
    process.env.E2E_BACKEND_DIR ??
      resolve(process.cwd(), '..', 'TekoApp-Backend'),
  );
  const file = resolve(dir, '.env.e2e');
  if (!existsSync(file)) throw new Error(`No existe ${file}`);
  const line = readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith('WEB_CLIENT_SECRET='));
  if (!line) throw new Error(`WEB_CLIENT_SECRET ausente en ${file}`);
  return line.slice('WEB_CLIENT_SECRET='.length).trim();
}

export function backendBasicAuth(): string {
  return `Basic ${Buffer.from(`tekoapp-web:${readWebClientSecret()}`).toString('base64')}`;
}

/** Aterrizaje por rol despues del login (sin `from`): admin -> /admin, compliance -> su primera
 *  seccion permitida, profesional -> /pro y cliente -> /. */
export const LANDING: Record<UserKey, string> = {
  admin: '/admin',
  cliente_a: '/',
  cliente_b: '/',
  // `/pro` redirige por servidor a `/pro/solicitudes`; el login aterriza en `/pro` y el salto puede
  // tardar o no completarse (flaky de test, DEF-WEB-014): `loginUi` acepta ambas URLs.
  pro_aprobado: '/pro',
  // Tiene perfil profesional (aunque PENDING): el login lo lleva igual al modo pro.
  pro_pendiente: '/pro',
  compliance: '/admin/legal/document-versions',
};

/** Login por la UI (formulario `/login`). Termina en el aterrizaje del rol (`LANDING`). */
export async function loginUi(page: Page, who: UserKey): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Email').fill(USERS[who].email);
  await page
    .getByLabel('Contraseña', { exact: true })
    .fill(USERS[who].password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  if (LANDING[who] === '/pro') {
    // No depende del redirect `/pro` -> `/pro/solicitudes`: quien necesite la bandeja navega explicito.
    await expect(page).toHaveURL(/\/pro(\/solicitudes)?$/);
  } else {
    await expect(page).toHaveURL(LANDING[who]);
  }
}

/**
 * Contexto API autenticado por el BFF: hace `POST /api/auth/login` y reenvia las cookies de
 * sesion en el header `Cookie` (el jar de APIRequestContext no envia cookies `Secure` por http
 * a 127.0.0.1, a diferencia de Chromium con localhost).
 */
export async function newBffContext(
  baseURL: string,
  who: UserKey,
): Promise<APIRequestContext> {
  return newBffContextWith(baseURL, USERS[who], who);
}

/** Igual que `newBffContext` pero con credenciales arbitrarias (usuarios creados en el test). */
export async function newBffContextWith(
  baseURL: string,
  creds: { email: string; password: string },
  label: string = creds.email,
): Promise<APIRequestContext> {
  const login = await pwRequest.newContext({ baseURL });
  const res = await login.post('/api/auth/login', {
    data: { email: creds.email, password: creds.password },
  });
  expect(res.status(), `login BFF de ${label}`).toBe(200);
  const body = (await res.json()) as { data?: { login?: boolean } };
  expect(body.data?.login).toBe(true);
  const cookie = res
    .headersArray()
    .filter((h) => h.name.toLowerCase() === 'set-cookie')
    .map((h) => h.value.split(';')[0])
    .join('; ');
  await login.dispose();
  return pwRequest.newContext({
    baseURL,
    extraHTTPHeaders: { cookie },
  });
}

/** Registra por API (BFF) un usuario nuevo con email unico y devuelve sus credenciales. */
export async function registerViaApi(
  baseURL: string,
  names: { firstName: string; lastName: string },
): Promise<{ email: string; password: string }> {
  const email = `w2.api.${Date.now()}.${Math.floor(Math.random() * 1e6)}@e2e.tekoapp.local`;
  const anon = await pwRequest.newContext({ baseURL });
  const res = await anon.post('/api/auth/register', {
    data: {
      ...names,
      email,
      phoneNumber: '+595981123499',
      password: NEW_USER_PASSWORD,
      confirmPassword: NEW_USER_PASSWORD,
      acceptTerms: true,
    },
  });
  expect(res.status(), 'registro por API').toBe(201);
  await anon.dispose();
  return { email, password: NEW_USER_PASSWORD };
}

/** Espera a que la pagina se asiente (la app mantiene conexiones abiertas: no hay networkidle estricto). */
export async function settle(page: Page): Promise<void> {
  await page.waitForLoadState('load');
  await page
    .waitForLoadState('networkidle', { timeout: 4_000 })
    .catch(() => {});
}

/** Desenvuelve `{success,data}` del backend. */
export async function unwrap<T>(res: {
  json(): Promise<unknown>;
  status(): number;
}): Promise<T> {
  const body = (await res.json()) as { data?: T };
  return (body.data ?? body) as T;
}

/**
 * Escaneo axe de la pagina actual. Las violaciones serious/critical NO fallan el run: se agregan
 * como anotaciones `a11y` del test (las lee `scripts/qa/report.mjs` para el informe y CP-A11Y).
 * Devuelve el conteo de violaciones serious/critical.
 */
export async function scanA11y(page: Page, label: string): Promise<number> {
  // Estabiliza transiciones antes de escanear: toasts de sonner entrando/saliendo y dialogos de
  // Base UI abriendose/cerrandose miden contraste con opacidad parcial o con el overlay encima.
  await page
    .waitForFunction(
      () =>
        document.querySelector('[data-starting-style],[data-ending-style]') ===
          null &&
        [...document.querySelectorAll('[data-sonner-toast]')].every(
          (t) => getComputedStyle(t).opacity === '1',
        ),
      undefined,
      { timeout: 3_000 },
    )
    .catch(() => {});
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  const path = new URL(page.url()).pathname;
  // Registro de cada pagina escaneada (aunque no tenga violaciones) para el informe.
  test.info().annotations.push({
    type: 'a11y-scan',
    description: `${label} | ${path} | ${bad.length}`,
  });
  for (const v of bad) {
    test.info().annotations.push({
      type: 'a11y',
      description: `${label} | ${path} | ${v.id} | ${v.impact} | ${v.nodes.length} | ${v.nodes[0]?.target.join(' ').slice(0, 80)}`,
    });
  }
  return bad.length;
}

/**
 * Fija el tema de la app (next-themes guarda `theme` en localStorage; el default es `dark` aunque
 * el SO sea claro, asi que `emulateMedia` no alcanza). Llamar ANTES de navegar.
 */
export async function setTheme(
  page: Page,
  theme: 'light' | 'dark',
): Promise<void> {
  await page.addInitScript((t) => {
    try {
      localStorage.setItem('theme', t);
    } catch {
      /* sin storage: queda el default */
    }
  }, theme);
}

/** Navega y escanea a11y. */
export async function visit(
  page: Page,
  path: string,
  label: string,
): Promise<void> {
  await page.goto(path);
  await settle(page);
  await scanA11y(page, label);
}

/**
 * Fila de una DataTable por texto, recorriendo las paginas (el backend e2e acumula datos entre
 * corridas, asi que la fila buscada puede no estar en la pagina 1). Devuelve el locator de la fila.
 */
export async function findRowAcrossPages(
  page: Page,
  text: string | RegExp,
  maxPages = 15,
): Promise<Locator> {
  for (let i = 0; i < maxPages; i++) {
    const row = page.getByRole('row').filter({ hasText: text }).first();
    if (await row.isVisible().catch(() => false)) return row;
    const next = page.getByRole('button', { name: 'Página siguiente' });
    if (!(await next.isVisible().catch(() => false))) break;
    if (!(await next.isEnabled())) break;
    await next.click();
    await settle(page);
  }
  const row = page.getByRole('row').filter({ hasText: text }).first();
  await expect(row, `fila con ${String(text)}`).toBeVisible();
  return row;
}

export const NEW_USER_PASSWORD = 'E2e-Passw0rd!';

/** Registra un usuario nuevo por la UI (/register) y devuelve sus credenciales. */
export async function registerUi(
  page: Page,
  names: { firstName: string; lastName: string },
): Promise<{ email: string; password: string }> {
  const unique = `w2.${Date.now()}.${Math.floor(Math.random() * 1e6)}`;
  const email = `${unique}@e2e.tekoapp.local`;
  await page.goto('/register');
  await page.getByLabel('Nombre').fill(names.firstName);
  await page.getByLabel('Apellido').fill(names.lastName);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Teléfono').fill('+595981123456');
  await page.getByLabel('Contraseña', { exact: true }).fill(NEW_USER_PASSWORD);
  await page.getByLabel('Confirmar contraseña').fill(NEW_USER_PASSWORD);
  await page
    .getByRole('checkbox', { name: 'Acepto los términos y condiciones' })
    .click();
  await page.getByRole('button', { name: 'Crear cuenta' }).click();
  await expect(page).toHaveURL(/\/login\?registered=1/);
  return { email, password: NEW_USER_PASSWORD };
}

/** Login por la UI con credenciales arbitrarias (usuario nuevo); no asume el aterrizaje. */
export async function loginWith(
  page: Page,
  creds: { email: string; password: string },
): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('Email').fill(creds.email);
  await page.getByLabel('Contraseña', { exact: true }).fill(creds.password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).not.toHaveURL(/\/login/);
}

/** `fetch` a `/api/backend/<path>` desde el navegador de la pagina (sesion por cookies). */
export async function backendFetch(
  page: Page,
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<{ status: number; text: string }> {
  return page.evaluate(
    async ({ path, init }) => {
      const res = await fetch(`/api/backend/${path}`, {
        method: init?.method ?? 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: init?.body ? JSON.stringify(init.body) : undefined,
      });
      return { status: res.status, text: await res.text() };
    },
    { path, init },
  );
}
