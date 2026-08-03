import { describe, expect, it } from 'vitest';
import {
  resolveRequestId,
  deriveSessionId,
  REQUEST_ID_HEADER,
} from './request-context';

describe('resolveRequestId', () => {
  it('reusa el x-request-id entrante si la request ya lo trae', () => {
    // Arrange
    const headers = new Headers({ [REQUEST_ID_HEADER]: 'incoming-id' });

    // Act
    const id = resolveRequestId(headers);

    // Assert
    expect(id).toBe('incoming-id');
  });

  it('genera un UUID nuevo cuando no viene el header', () => {
    // Arrange
    const headers = new Headers();

    // Act
    const id = resolveRequestId(headers);

    // Assert
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });
});

describe('deriveSessionId', () => {
  it('devuelve un hash corto estable para el mismo token sin exponer el token', () => {
    // Arrange
    const token = 'jwt.super.largo';

    // Act
    const first = deriveSessionId(token);
    const second = deriveSessionId(token);

    // Assert
    expect(first).toBe(second);
    expect(first).toHaveLength(12);
    expect(first).not.toContain(token);
  });

  it('devuelve identificadores distintos para tokens distintos', () => {
    // Arrange & Act
    const a = deriveSessionId('token-a');
    const b = deriveSessionId('token-b');

    // Assert
    expect(a).not.toBe(b);
  });

  it('omite el session-id (undefined) cuando no hay token', () => {
    // Arrange & Act & Assert
    expect(deriveSessionId(undefined)).toBeUndefined();
    expect(deriveSessionId(null)).toBeUndefined();
    expect(deriveSessionId('')).toBeUndefined();
  });
});
