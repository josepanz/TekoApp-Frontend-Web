import { http, HttpResponse } from 'msw';
import type { NearbyProfessional } from '@/features/locations/api';
import type { OnlineCount } from '@/features/locations/api';

export const fakeOnlineCount: OnlineCount = { count: 7 };

export const fakeNearbyProfessionals: NearbyProfessional[] = [
  {
    id: 1,
    referenceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    categoryId: 2,
    currentLatitude: -25.2637,
    currentLongitude: -57.5759,
    isAvailable: true,
    isOnline: true,
    averageRating: 4.8,
    totalRatings: 35,
    distance: 1.2,
  },
  {
    id: 2,
    referenceId: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    categoryId: 3,
    currentLatitude: -25.27,
    currentLongitude: -57.58,
    isAvailable: false,
    isOnline: true,
    averageRating: 4.2,
    totalRatings: 12,
    distance: 3.4,
  },
];

export const locationsHandlers = [
  http.get('/api/backend/locations/online-count', () =>
    HttpResponse.json(fakeOnlineCount),
  ),
  http.get('/api/backend/locations/nearby', () =>
    HttpResponse.json(fakeNearbyProfessionals),
  ),
];
