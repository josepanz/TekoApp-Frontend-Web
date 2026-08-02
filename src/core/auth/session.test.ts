import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockCookiesGet = vi.fn();
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: mockCookiesGet })),
}));

vi.mock('@/core/config/env', () => ({
  env: { BACKEND_API_URL: 'http://backend.test' },
}));

vi.mock('@/core/api-client/backend-paths', () => ({
  resolveBackendPath: (path: string) => path,
}));

import { getSession, SessionUnavailableError } from './session';

describe('getSession', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCookiesGet.mockReturnValue(undefined);
  });

  it('retorna null cuando no hay cookie de accessToken', async () => {
    // Arrange
    mockCookiesGet.mockReturnValue(undefined);

    // Act
    const result = await getSession();

    // Assert
    expect(result).toBeNull();
  });

  it('retorna null cuando el backend responde 401 (sesión expirada)', async () => {
    // Arrange
    mockCookiesGet.mockReturnValue({ value: 'token-123' });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 401 }),
    );

    // Act
    const result = await getSession();

    // Assert
    expect(result).toBeNull();
  });

  it('lanza SessionUnavailableError cuando el backend responde 500 — nunca lo trata como sesión inexistente', async () => {
    // Arrange
    mockCookiesGet.mockReturnValue({ value: 'token-123' });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    );

    // Act & Assert
    await expect(getSession()).rejects.toThrow(SessionUnavailableError);
  });

  it('lanza SessionUnavailableError cuando falla la conexión (backend caído)', async () => {
    // Arrange
    mockCookiesGet.mockReturnValue({ value: 'token-123' });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('ECONNREFUSED')),
    );

    // Act & Assert
    await expect(getSession()).rejects.toThrow(SessionUnavailableError);
  });

  it('retorna la sesión mapeada cuando el backend responde 200 con el scope', async () => {
    // Arrange
    mockCookiesGet.mockReturnValue({ value: 'token-123' });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            user: {
              id: 'ref-1',
              email: 'user@test.com',
              firstName: 'Ana',
              lastName: 'Gómez',
              status: 'ACTIVE',
              profileStatus: 'COMPLETE',
              accessLevelId: 1,
            },
            roles: [{ name: 'ADMIN' }],
            permissions: [{ name: 'admin:all' }],
          },
        }),
      }),
    );

    // Act
    const result = await getSession();

    // Assert
    expect(result).toEqual({
      referenceId: 'ref-1',
      email: 'user@test.com',
      firstName: 'Ana',
      lastName: 'Gómez',
      avatarUrl: null,
      accessLevelId: 1,
      userStatus: 'ACTIVE',
      profileStatus: 'COMPLETE',
      permissions: ['admin:all'],
      roles: ['ADMIN'],
    });
  });
});
