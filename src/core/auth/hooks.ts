'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/core/api-client/client';

interface SessionScope {
  permissions: { name: string }[];
  roles: { name: string }[];
}

// Contraparte client-side de `getSession()` (server-only): mismo endpoint `GET /auth/scope`, para
// componentes de cliente que necesitan saber los permisos del usuario (ej. el selector de modo en
// el sidebar). No se puede reusar `getSession()` directamente porque es `server-only`.
export function useSessionScopeQuery() {
  return useQuery({
    queryKey: ['auth', 'scope'],
    queryFn: () => apiFetch<SessionScope>('auth/scope'),
    staleTime: 5 * 60 * 1000,
  });
}
