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

  it('lanza ApiError con el mensaje del backend cuando la respuesta no es ok (DTO pelado, MSW/fake-backend)', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/categories', () =>
        HttpResponse.json({ message: 'No autorizado' }, { status: 401 }),
      ),
    );

    // Act
    const error = await apiFetch('categories').catch((err: unknown) => err);

    // Assert
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).message).toBe('No autorizado');
    expect((error as ApiError).status).toBe(401);
  });

  it('lee message/errorCode/details del envelope REAL de error del backend, no del genérico', async () => {
    // Arrange — así responde `HttpExceptionFilter` (TekoApp-Backend): nunca `message` en la
    // raíz del body, siempre anidado en `error.message`.
    server.use(
      http.get('/api/backend/categories', () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              code: 409,
              message: 'No se puede eliminar la cuenta',
              error: 'Conflict',
              errorCode: 'DELETION_BLOCKED',
              details: { blockers: [{ type: 'ACTIVE_SERVICE', count: 1 }] },
              timestamp: '2026-01-01T00:00:00.000Z',
              path: '/tekoapp-backend/api/v1/categories',
            },
          },
          { status: 409 },
        ),
      ),
    );

    // Act
    const error = await apiFetch('categories').catch((err: unknown) => err);

    // Assert: el mensaje real llega a la UI en vez del fallback genérico
    // `Error 409 en categories`.
    expect(error).toBeInstanceOf(ApiError);
    const apiError = error as ApiError;
    expect(apiError.message).toBe('No se puede eliminar la cuenta');
    expect(apiError.errorCode).toBe('DELETION_BLOCKED');
    expect(apiError.details).toEqual({
      blockers: [{ type: 'ACTIVE_SERVICE', count: 1 }],
    });
  });

  it('cae al mensaje genérico solo si el body no calza con ninguna de las 2 formas conocidas', async () => {
    // Arrange
    server.use(
      http.get('/api/backend/categories', () =>
        HttpResponse.json({ unexpected: 'shape' }, { status: 500 }),
      ),
    );

    // Act
    const error = await apiFetch('categories').catch((err: unknown) => err);

    // Assert
    expect((error as ApiError).message).toBe('Error 500 en categories');
    expect((error as ApiError).errorCode).toBeUndefined();
  });
});
