import 'server-only';
import { z } from 'zod';

// Validado de forma LAZY (recién al leer una propiedad) — nunca importar este archivo desde un
// Client Component (contiene secrets que jamás deben llegar al bundle del browser; `import
// "server-only"` rompe el build si se intenta igual). La validación es lazy a propósito: Next.js
// evalúa este módulo durante "collect page data" en el build, sin que haya env vars reales
// disponibles todavía (esas las inyecta Vault recién en producción) — si validáramos eager acá,
// `pnpm build` fallaría siempre que no exista un .env.local con todo completo.
const serverEnvSchema = z.object({
  BACKEND_API_URL: z.string().url(),
  BACKEND_CLIENT_ID: z.string().min(1),
  BACKEND_CLIENT_SECRET: z.string().min(1),
  BACKEND_JWT_PUBLIC_KEY: z.string().min(1),
  BACKEND_SOCKET_URL: z.string().url(),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

function loadEnv(): ServerEnv {
  cached ??= serverEnvSchema.parse({
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    BACKEND_CLIENT_ID: process.env.BACKEND_CLIENT_ID,
    BACKEND_CLIENT_SECRET: process.env.BACKEND_CLIENT_SECRET,
    BACKEND_JWT_PUBLIC_KEY: process.env.BACKEND_JWT_PUBLIC_KEY,
    BACKEND_SOCKET_URL: process.env.BACKEND_SOCKET_URL,
  });
  return cached;
}

export const env: ServerEnv = new Proxy({} as ServerEnv, {
  get(_target, prop: keyof ServerEnv) {
    return loadEnv()[prop];
  },
});
