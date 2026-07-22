import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getUsers, type GetUsersParams } from './api';

export function useUsersQuery(params: GetUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
}
