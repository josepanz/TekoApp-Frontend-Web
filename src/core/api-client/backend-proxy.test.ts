import { NextRequest } from 'next/server';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const { loggerErrorMock, loggerInfoMock } = vi.hoisted(() => ({
  loggerErrorMock: vi.fn(),
  loggerInfoMock: vi.fn(),
}));

vi.mock('@/core/config/env', () => ({
  env: { BACKEND_API_URL: 'http://backend.test' },
}));

vi.mock('@/core/logging/logger', () => ({
  logger: {
    error: loggerErrorMock,
    info: loggerInfoMock,
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('@/core/api-client/backend-paths', () => ({
  resolveBackendPath: (path: string) => path,
  requiresBasicAuth: () => false,
}));

import { proxyToBackend } from './backend-proxy';

function makeRequest(path: string): NextRequest {
  return new NextRequest(
    new URL(`/api/backend/${path}`, 'http://localhost:3000'),
  );
}

describe('proxyToBackend', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    loggerErrorMock.mockClear();
    loggerInfoMock.mockClear();
  });

  it('devuelve 502 con un cuerpo estructurado cuando el backend no responde (caido, DNS, timeout)', async () => {
    // Arrange
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('ECONNREFUSED')),
    );
    const request = makeRequest('professionals');

    // Act
    const response = await proxyToBackend(request, 'professionals');
    const body = await response.json();

    // Assert
    expect(response.status).toBe(502);
    expect(body).toEqual({ message: 'backend_unreachable' });
  });

  it('logea el detalle real del error antes de devolver el 502 generico', async () => {
    // Arrange
    const connectionError = new Error('ECONNREFUSED');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(connectionError));
    const request = makeRequest('professionals');

    // Act
    await proxyToBackend(request, 'professionals');

    // Assert
    expect(loggerErrorMock).toHaveBeenCalledWith(
      'Fallo de conexión con el backend en el proxy',
      expect.objectContaining({ err: connectionError, path: 'professionals' }),
    );
  });

  it('reenvia la respuesta del backend sin cambios cuando este responde (aunque sea un error)', async () => {
    // Arrange
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'No autorizado' }), {
          status: 401,
          headers: { 'content-type': 'application/json' },
        }),
      ),
    );
    const request = makeRequest('professionals');

    // Act
    const response = await proxyToBackend(request, 'professionals');

    // Assert
    expect(response.status).toBe(401);
    expect(loggerErrorMock).not.toHaveBeenCalled();
  });
});
