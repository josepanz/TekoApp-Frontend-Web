import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // server-only/client-only chequean la condición de resolución "react-server" que solo
      // setea el bundler de Next.js — fuera de él (acá) tiran error siempre. No-op en tests.
      'server-only': '/src/test/empty-module.ts',
      'client-only': '/src/test/empty-module.ts',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Default (5s) empezó a producir timeouts intermitentes en tests de interacción con varios
    // pasos async (selects + submit) a medida que la suite creció y corre con más contención de
    // CPU en paralelo — no es un bug de los componentes, se confirmó corriendo cada test fallido
    // en aislamiento (siempre verde). Subido acá en vez de parchear cada test nuevo que lo pise.
    testTimeout: 10000,
    exclude: ['**/node_modules/**', '**/.next/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.stories.tsx',
        'src/app/**',
        'src/core/api-client/types.generated.ts',
        'src/design-system/**',
      ],
    },
  },
});
