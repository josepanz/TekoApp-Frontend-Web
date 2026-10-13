/**
 * Suite: login contra el BFF (`/api/auth/login`) - manejo de 401 y de 200 con `login:false`.
 * Casos: CP-WEB-AUTH-001..004 (ver test/qa/casos/CP-AUTH.md)
 * Tipo: unitaria   Prioridad: P0
 * Precondiciones: MSW (`server.use`) simula las respuestas del BFF; sin backend real.
 * Trazabilidad: bug conocido W1 (login:false se trataba como exito y redirigia)
 */
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '@/test/msw/server';
import { ApiError } from '@/core/api-client/errors';
import {
  INVALID_CREDENTIALS_MESSAGE,
  REQUIRED_NEW_PASSWORD_MESSAGE,
  login,
} from './api';

const values = { email: 'a@b.com', password: 'x', rememberMe: false };

function stubLogin(status: number, body: Record<string, unknown>) {
  server.use(
    http.post('/api/auth/login', () => HttpResponse.json(body, { status })),
  );
}

async function catchError(): Promise<ApiError> {
  try {
    await login(values);
  } catch (error) {
    return error as ApiError;
  }
  throw new Error('login() debia rechazar');
}

describe('login()', () => {
  it('CP-WEB-AUTH-001: 401 INVALID_CREDENTIALS -> mensaje generico, rechaza', async () => {
    stubLogin(401, {
      success: false,
      error: {
        code: 401,
        message: 'detalle interno',
        error: 'Unauthorized',
        errorCode: 'INVALID_CREDENTIALS',
      },
    });
    const error = await catchError();
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(401);
    expect(error.message).toBe(INVALID_CREDENTIALS_MESSAGE);
  });

  it('CP-WEB-AUTH-002: 200 login:false + requiredNewPassword -> error REQUIRED_NEW_PASSWORD', async () => {
    stubLogin(200, {
      success: true,
      data: { login: false, requiredNewPassword: true },
    });
    const error = await catchError();
    expect(error.errorCode).toBe('REQUIRED_NEW_PASSWORD');
    expect(error.message).toBe(REQUIRED_NEW_PASSWORD_MESSAGE);
  });

  it('CP-WEB-AUTH-003: 200 con cualquier otro login:false -> error, no exito', async () => {
    stubLogin(200, { success: true, data: { login: false } });
    const error = await catchError();
    expect(error.errorCode).toBe('LOGIN_FAILED');
  });

  it('CP-WEB-AUTH-004: 200 login:true resuelve con el resultado', async () => {
    stubLogin(200, { success: true, data: { login: true } });
    await expect(login(values)).resolves.toMatchObject({ login: true });
  });
});
