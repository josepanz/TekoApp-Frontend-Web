import { apiFetch } from '@/core/api-client/client';
import type { components } from '@/core/api-client/types.generated';

export type DashboardStats = components['schemas']['DashboardStatsResponseDTO'];

// GET /analytics/dashboard — sin guard en el backend (público), ver documentation/architecture.md.
export function getDashboardStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>('analytics/dashboard');
}
