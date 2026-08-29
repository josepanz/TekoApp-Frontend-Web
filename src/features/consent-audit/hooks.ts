import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getContentConsentGrantsAudit,
  getUserConsentsAudit,
  type GetContentConsentGrantsAuditParams,
  type GetUserConsentsAuditParams,
} from './api';

export function useUserConsentsAuditQuery(params: GetUserConsentsAuditParams) {
  return useQuery({
    queryKey: ['consent-audit', 'user-consents', params],
    queryFn: () => getUserConsentsAudit(params),
    placeholderData: keepPreviousData,
  });
}

export function useContentConsentGrantsAuditQuery(
  params: GetContentConsentGrantsAuditParams,
) {
  return useQuery({
    queryKey: ['consent-audit', 'content-consents', params],
    queryFn: () => getContentConsentGrantsAudit(params),
    placeholderData: keepPreviousData,
  });
}
