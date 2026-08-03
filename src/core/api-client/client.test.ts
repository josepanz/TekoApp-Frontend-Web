import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { ApiError } from './errors';
import { apiFetch } from './client';

describe('apiFetch', () => {
  afterEach(() => server.resetHandlers());

  it('desenvuelve el campo `data` cuando el backend responde con el envelope {success, data, message}', async () => {
    // Arrange — así responde el backend real (TransformInterceptor global), a diferencia de los
    // mocks de MSW en el resto de los tests, que devuelven el DTO ya "pelado".
    server.use(
      http.get('/api/backend/categories', () =>
        HttpResponse.json({
          success: true,
          data: [{ id: 1, name: 'Plomería' }],
          message: 'Operación exitosa',
          timestamp: '2026-01-01T00:00:00.000Z',
          path: '/tekoapp-backend/api/categories',
        }),
      ),
    );

    // Act
    const result = await apiFetch('categories');

    // Assert
    expect(result).toEqual([{ id: 1, name: 'Plomería' }]);
  });

  it('deja pasar sin cambios una respuesta ya "pelada" (sin envelope)', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/categories', () =>
        HttpResponse.json([{ id: 1, name: 'Plomería' }]),
      ),
    );

    // Act
    const result = await apiFetch('categories');

    // Assert
    expect(result).toEqual([{ id: 1, name: 'Plomería' }]);
  });

  it('lanza ApiError con el mensaje del backend cuando la respuesta no es ok', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/categories', () =>
        HttpResponse.json({ message: 'No autorizado' }, { status: 401 }),
      ),
    );

    // Act & Assert
    await expect(apiFetch('categories')).rejects.toThrow(ApiError);
  });
});
