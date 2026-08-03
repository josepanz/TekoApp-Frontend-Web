import { http, HttpResponse } from 'msw';
import type { DashboardStats } from '@/features/analytics/api';

export const fakeDashboardStats: DashboardStats = {
  success: true,
  users: { total: 1500, new: 120, active: 450, growth: 12.5 },
  professionals: { total: 350, new: 25, verified: 310, growth: 5.4 },
  services: {
    total: 850,
    active: 45,
    completed: 750,
    pending: 55,
    growth: 8.2,
  },
  revenue: {
    total: 25_000_000,
    period: 4_500_000,
    average: 150_000,
    growth: 15.3,
  },
  ratings: { average: 4.7, total: 980, period: 120, distribution: {} },
  period: {
    startDate: '2026-05-01T00:00:00.000Z',
    endDate: '2026-05-31T23:59:59.999Z',
  },
};

export const analyticsHandlers = [
  http.get('/api/backend/analytics/dashboard', () => {
    return HttpResponse.json(fakeDashboardStats);
  }),
];
