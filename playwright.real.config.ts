import { defineConfig, devices } from '@playwright/test';

// Playwright contra el BACKEND REAL de e2e (TekoApp-Backend `pnpm e2e:up && pnpm e2e:seed &&
// pnpm e2e:serve`, puerto 3100). Es independiente de `playwright.config.ts` (fake-backend, CI).
// `scripts/e2e-real/serve.mjs` hace el setup de claves y levanta el build standalone de Next.
const PORT = process.env.E2E_REAL_PORT ?? '3002';

export default defineConfig({
  testDir: './e2e/real',
  // Un solo worker: una unica instancia de Next + un backend con estado compartido.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Fija el idioma (la app negocia por Accept-Language); TekoApp es un marketplace paraguayo.
    locale: 'es-PY',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node scripts/e2e-real/serve.mjs',
    url: `http://127.0.0.1:${PORT}/api/health`,
    // Siempre fresco: la clave RSA del backend cambia por corrida.
    reuseExistingServer: false,
    timeout: 360_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
