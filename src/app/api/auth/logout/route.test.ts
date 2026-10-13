/**
 * Suite: BFF `POST /api/auth/logout` - llama al backend y limpia cookies aunque falle.
 * Casos: CP-WEB-AUTH-006..008 (ver test/qa/casos/CP-AUTH.md)
 * Tipo: unitaria   Prioridad: P0
 * Precondiciones: `fetch` global y `env` mockeados; sin backend real.
 * Trazabilidad: contrato nuevo `POST /auth/logout` (204 idempotente, revoca el refresh)
 */
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/core/config/env', () => ({
  env: {
    BACKEND_API_URL: 'http://backend.test/api',
    BACKEND_CLIENT_ID: 'tekoapp-web',
    BACKEND_CLIENT_SECRET: 's3cret',
  },
}));
vi.mock('@/core/logging/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

import { POST } from './route';

function makeRequest(cookie?: string): NextRequest {
  return new NextRequest('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    headers: cookie ? { cookie } : {},
  });
}

function clearedCookies(response: Response): string[] {
  return response.headers
    .getSetCookie()
    .filter((c) => /Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(c));
}

describe('POST /api/auth/logout', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('CP-WEB-AUTH-006: llama a POST auth/logout con Basic Auth y la cookie refreshToken', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));

    const response = await POST(
      makeRequest('accessToken=at; refreshToken=rt-123; otra=x'),
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://backend.test/api/v1/auth/logout');
    expect(init.method).toBe('POST');
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe(
      `Basic ${Buffer.from('tekoapp-web:s3cret').toString('base64')}`,
    );
    expect(headers.Cookie).toBe('refreshToken=rt-123');
    expect(response.status).toBe(200);
    expect(clearedCookies(response)).toHaveLength(2);
  });

  it('CP-WEB-AUTH-007: limpia las cookies aunque el backend responda 500', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('boom', { status: 500 }),
    );
    const response = await POST(makeRequest('refreshToken=rt'));
    expect(response.status).toBe(200);
    expect(clearedCookies(response)).toHaveLength(2);
  });

  it('CP-WEB-AUTH-008: limpia las cookies aunque el backend este caido (fetch lanza)', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('ECONNREFUSED'));
    const response = await POST(makeRequest());
    expect(response.status).toBe(200);
    expect(clearedCookies(response)).toHaveLength(2);
  });
});
