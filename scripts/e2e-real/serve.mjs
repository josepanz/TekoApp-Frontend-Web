// webServer de `playwright.real.config.ts`: levanta el build standalone de Next apuntando al
// backend REAL de e2e (TekoApp-Backend `pnpm e2e:serve`, puerto 3100).
//
// Setup de claves: las claves RSA del backend e2e se generan POR CORRIDA (no estan en `.env.e2e`).
// Este script lee el secret del cliente `tekoapp-web` de `<backend>/.env.e2e` (WEB_CLIENT_SECRET) y
// pide la clave publica vigente a `GET /auth/public-key`; ambos viajan SOLO por variables de
// entorno al proceso de Next. Nada se escribe a disco ni se commitea.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BACKEND_API_URL =
  process.env.E2E_BACKEND_API_URL ??
  'http://localhost:3100/tekoapp-backend/api';
const BACKEND_DIR = resolve(
  process.env.E2E_BACKEND_DIR ?? resolve(ROOT, '..', 'TekoApp-Backend'),
);
const CLIENT_ID = process.env.E2E_BACKEND_CLIENT_ID ?? 'tekoapp-web';
const PORT = process.env.E2E_REAL_PORT ?? '3002';

function readClientSecret() {
  if (process.env.E2E_BACKEND_CLIENT_SECRET)
    return process.env.E2E_BACKEND_CLIENT_SECRET;
  const file = resolve(BACKEND_DIR, '.env.e2e');
  if (!existsSync(file))
    throw new Error(
      `No existe ${file}: levantar el backend e2e (pnpm e2e:up) o definir E2E_BACKEND_CLIENT_SECRET.`,
    );
  const line = readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .find((l) => l.startsWith('WEB_CLIENT_SECRET='));
  const value = line?.slice('WEB_CLIENT_SECRET='.length).trim();
  if (!value) throw new Error(`WEB_CLIENT_SECRET ausente en ${file}`);
  return value;
}

async function fetchPublicKey(secret) {
  const basic = Buffer.from(`${CLIENT_ID}:${secret}`).toString('base64');
  const res = await fetch(`${BACKEND_API_URL}/v1/auth/public-key`, {
    headers: { Authorization: `Basic ${basic}` },
  });
  if (!res.ok)
    throw new Error(
      `GET /auth/public-key respondio ${res.status}: ¿backend e2e arriba (pnpm e2e:serve)?`,
    );
  const body = await res.json();
  return (body.data ?? body).publicKeyPem;
}

const secret = readClientSecret();
const publicKey = await fetchPublicKey(secret);

if (process.env.E2E_REAL_SKIP_BUILD !== '1') {
  const build = spawnSync('pnpm build', {
    shell: true,
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
}

const server = spawn(process.execPath, ['.next/standalone/server.js'], {
  cwd: ROOT,
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT,
    HOSTNAME: '127.0.0.1',
    NODE_ENV: 'production',
    BACKEND_API_URL,
    BACKEND_CLIENT_ID: CLIENT_ID,
    BACKEND_CLIENT_SECRET: secret,
    BACKEND_JWT_PUBLIC_KEY: publicKey,
    BACKEND_SOCKET_URL: new URL(BACKEND_API_URL).origin,
  },
});
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => server.kill(sig));
}
server.on('exit', (code) => process.exit(code ?? 0));
