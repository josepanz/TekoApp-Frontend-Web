import { QueryClient } from '@tanstack/react-query';

// Reutilizar en cada test que necesite un QueryClientProvider — nunca instanciar uno nuevo
// inline por archivo. `retry: false` evita que un test de "estado de error" tarde varios
// segundos reintentando antes de fallar.
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}
