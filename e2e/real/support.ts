import AxeBuilder from '@axe-core/playwright';
import {
  expect,
  request as pwRequest,
  test,
  type APIRequestContext,
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
  // `/pro` redirige a `/pro/solicitudes` (entrada del modo profesional).
  pro_aprobado: '/pro/solicitudes',
  pro_pendiente: '/',
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
  await expect(page).toHaveURL(LANDING[who]);
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
  const login = await pwRequest.newContext({ baseURL });
  const res = await login.post('/api/auth/login', {
    data: { email: USERS[who].email, password: USERS[who].password },
  });
  expect(res.status(), `login BFF de ${who}`).toBe(200);
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
