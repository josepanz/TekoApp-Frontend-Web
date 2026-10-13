/**
 * Suite: helper `applyApiFieldErrors` (400 `errors[]` -> errores de campo de react-hook-form) y
 * parseo de `errors[]`/`retryAfter` en `extractErrorInfo`.
 * Casos: CP-WEB-AUTH-009..011 (ver test/qa/casos/CP-AUTH.md)
 * Tipo: unitaria   Prioridad: P1
 * Precondiciones: ninguna (funciones puras)
 * Trazabilidad: contrato nuevo del backend (400 con `errors[]`, 429 con `retryAfter`)
 */
import { describe, expect, it, vi } from 'vitest';
import { extractErrorInfo } from './client';
import { ApiError } from './errors';
import { applyApiFieldErrors } from './form-errors';

const body400 = {
  success: false,
  error: {
    code: 400,
    message: 'Múltiples errores de validación',
    error: 'Bad Request',
    errors: [
      {
        field: 'email',
        value: 'x',
        constraints: { isEmail: 'email must be an email' },
      },
      { field: 'campoAjeno', value: 1, constraints: { min: 'min' } },
    ],
  },
};

describe('extractErrorInfo', () => {
  it('CP-WEB-AUTH-009: extrae fieldErrors del 400 y retryAfter del 429', () => {
    expect(extractErrorInfo(body400, 'x').fieldErrors).toEqual([
      { field: 'email', message: 'email must be an email' },
      { field: 'campoAjeno', message: 'min' },
    ]);
    const info = extractErrorInfo(
      { success: false, error: { code: 429, message: 'm', retryAfter: 30 } },
      'x',
    );
    expect(info.retryAfter).toBe(30);
  });
});

describe('applyApiFieldErrors', () => {
  it('CP-WEB-AUTH-010: aplica solo los campos conocidos del formulario', () => {
    const setError = vi.fn();
    const error = new ApiError(400, 'm', body400, undefined, undefined, [
      { field: 'email', message: 'email must be an email' },
      { field: 'campoAjeno', message: 'min' },
    ]);

    expect(applyApiFieldErrors(error, setError, ['email', 'password'])).toBe(
      true,
    );
    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'email must be an email',
    });
  });

  it('CP-WEB-AUTH-011: ignora errores que no son 400 o no son ApiError', () => {
    const setError = vi.fn();
    expect(applyApiFieldErrors(new Error('x'), setError, ['email'])).toBe(
      false,
    );
    expect(
      applyApiFieldErrors(
        new ApiError(500, 'm', null, undefined, undefined, [
          { field: 'email', message: 'x' },
        ]),
        setError,
        ['email'],
      ),
    ).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });
});
