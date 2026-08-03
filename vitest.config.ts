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
