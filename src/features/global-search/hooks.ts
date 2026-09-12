import { useQueries } from '@tanstack/react-query';
import { getProfessionals } from '@/features/professionals/api';
import { getUsers } from '@/features/users/api';
import type { GlobalSearchResult } from './api';

const MIN_QUERY_LENGTH = 2;
const RESULTS_PER_ENTITY = 5;

interface UseGlobalSearchQueryResult {
  results: GlobalSearchResult[];
  isPending: boolean;
  /** true si AL MENOS UNA de las dos búsquedas falló (ej. el usuario no tiene USER.READ) — el
   * resto de los resultados se sigue mostrando, nunca se oculta todo por un solo 403/500. */
  hasPartialError: boolean;
}

// Dos queries independientes en paralelo (`useQueries`, no dos `useQuery` separados) — si
// `/users` falla (ej. 403 por falta de USER.READ) igual se muestran los resultados de
// `/professionals`, y viceversa. Nunca se combina en una sola promesa que tire todo por un solo
// error parcial.
export function useGlobalSearchQuery(
  query: string,
): UseGlobalSearchQueryResult {
  const trimmed = query.trim();
  const enabled = trimmed.length >= MIN_QUERY_LENGTH;

  const [usersQuery, professionalsQuery] = useQueries({
    queries: [
      {
        queryKey: ['global-search', 'users', trimmed],
        queryFn: () =>
          getUsers({ page: 1, pageSize: RESULTS_PER_ENTITY, name: trimmed }),
        enabled,
      },
      {
        queryKey: ['global-search', 'professionals', trimmed],
        queryFn: () =>
          getProfessionals({
            page: 1,
            pageSize: RESULTS_PER_ENTITY,
            search: trimmed,
          }),
        enabled,
      },
    ],
  });

  const userResults: GlobalSearchResult[] = (usersQuery.data?.data ?? []).map(
    (user) => ({
      type: 'user',
      id: user.referenceId,
      label: `${user.firstName} ${user.lastName} · ${user.email}`,
      href: `/admin/users/${user.referenceId}`,
    }),
  );

  const professionalResults: GlobalSearchResult[] = (
    professionalsQuery.data?.data ?? []
  ).map((professional) => ({
    type: 'professional',
    id: professional.referenceId,
    label: `${professional.user.firstName} ${professional.user.lastName} · ${professional.category.name}`,
    href: `/admin/professionals/${professional.referenceId}`,
  }));

  return {
    results: [...userResults, ...professionalResults],
    isPending:
      enabled && (usersQuery.isPending || professionalsQuery.isPending),
    hasPartialError: usersQuery.isError || professionalsQuery.isError,
  };
}
