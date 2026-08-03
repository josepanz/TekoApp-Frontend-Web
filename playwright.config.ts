import { defineConfig, devices } from '@playwright/test';

const FAKE_BACKEND_PORT = 4000;
// 127.0.0.1 explícito, no "localhost" — Playwright/Node pueden resolver "localhost" a ::1
// primero en este entorno, y el fake-backend solo escucha en IPv4.
const FAKE_BACKEND_URL = `http://127.0.0.1:${FAKE_BACKEND_PORT}/tekoapp-backend/api`;

// Clave RSA de prueba (no protege nada real) — el fake-backend nunca la usa para descifrar,
// solo hace falta que `core/config/env.ts` la valide como un string no vacío.
const TEST_JWT_PUBLIC_KEY =
  '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr8lAmtIh+gl5mmcc48urP3oUIXVbft5roDcBuFF6wi5vkKOmQ5uZQxIj10WmSa/nZ2KMX/QFxDMWrfChJWaIZr8gFJ5fe5zVn4ww2YrnBJip11ln9AwBeqIOHLDGwlON1owU5JwXq4hg/m9Qvw2xOEz57OFmZxVRW/PfZXOzfO2J4gA7A6a43AqVmYfB8q3RMc2nKWycecKBGrqh+8ERiyVPRHomLmfjIgs3OAKeyVFhhVng4DCSxTpU05kcZ5INtxnHssxZnrT2xCRwWUg0g5OQ3+sc1XtTkgr2z/BVycSv1+N9y0Kuq/xhRiI8Fa7+19vkvWSu1ZzynhXKchhIeQIDAQAB\n-----END PUBLIC KEY-----';

export default defineConfig({
  testDir: './e2e',
  testIgnore: '**/fake-backend/**',
  // Un solo worker: los webServer (fake-backend + Next standalone) son una única instancia
  // compartida, no pensada para servir carga concurrente de varios browser contexts a la vez —
  // 5 workers en paralelo generaban fallas intermitentes de red bajo contención, no bugs reales.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3001',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: `node e2e/fake-backend/server.mjs`,
      // `port` (no `url`): Playwright solo espera que el puerto acepte conexiones TCP — el
      // fake-backend no tiene healthcheck propio y devuelve 404 en "/", que `url` NO acepta
      // como señal de "listo" (solo 2xx/3xx/400-403).
      port: FAKE_BACKEND_PORT,
      reuseExistingServer: !process.env.CI,
      env: { FAKE_BACKEND_PORT: String(FAKE_BACKEND_PORT) },
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      // Build de producción, no `pnpm dev`: en dev, la hidratación de React puede llegar
      // después de que Playwright ya interactuó con el HTML servido por SSR, causando un
      // submit nativo del <form> (GET con los campos como query string) en vez del handler de
      // React — no reproducible contra un build real.
      command: 'pnpm build && pnpm start',
      url: 'http://127.0.0.1:3001',
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      stdout: 'pipe',
      stderr: 'pipe',
      env: {
        BACKEND_API_URL: FAKE_BACKEND_URL,
        BACKEND_CLIENT_ID: 'e2e-test-client',
        BACKEND_CLIENT_SECRET: 'e2e-test-secret',
        BACKEND_JWT_PUBLIC_KEY: TEST_JWT_PUBLIC_KEY,
        BACKEND_SOCKET_URL: `http://127.0.0.1:${FAKE_BACKEND_PORT}`,
      },
    },
  ],
});
