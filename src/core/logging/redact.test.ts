import { describe, expect, it } from 'vitest';
import { redact, REDACTED } from './redact';

describe('redact', () => {
  it('redacta valores de claves sensibles conocidas dejando el resto intacto', () => {
    // Arrange
    const meta = {
      email: 'user@example.com',
      password: 'super-secreto',
      encryptedPassword: 'abc123==',
      status: 200,
    };

    // Act
    const result = redact(meta);

    // Assert
    expect(result).toEqual({
      email: 'user@example.com',
      password: REDACTED,
      encryptedPassword: REDACTED,
      status: 200,
    });
  });

  it('redacta de forma case-insensitive todas las variantes de token/secret/authorization/cookie/nonce', () => {
    // Arrange
    const meta = {
      accessToken: 'a',
      refreshToken: 'b',
      Authorization: 'Bearer xyz',
      Cookie: 'accessToken=xxx',
      NONCE: 'n1',
      clientSecret: 's',
      secretKey: 'k',
    };

    // Act
    const result = redact(meta);

    // Assert
    expect(Object.values(result)).toEqual([
      REDACTED,
      REDACTED,
      REDACTED,
      REDACTED,
      REDACTED,
      REDACTED,
      REDACTED,
    ]);
  });

  it('redacta recursivamente en objetos y arrays anidados', () => {
    // Arrange
    const meta = {
      user: { name: 'Ana', credentials: { token: 'jwt-real' } },
      requests: [{ authorization: 'Basic zzz' }, { path: '/users' }],
    };

    // Act
    const result = redact(meta) as {
      user: { name: string; credentials: string };
      requests: { authorization?: string; path?: string }[];
    };

    // Assert
    expect(result.user.name).toBe('Ana');
    expect(result.user.credentials).toBe(REDACTED);
    expect(result.requests[0].authorization).toBe(REDACTED);
    expect(result.requests[1].path).toBe('/users');
  });

  it('no explota ante referencias circulares y marca el ciclo', () => {
    // Arrange
    const meta: Record<string, unknown> = { name: 'root' };
    meta.self = meta;

    // Act
    const act = (): Record<string, unknown> => redact(meta);

    // Assert
    expect(act).not.toThrow();
    expect(act()).toEqual({ name: 'root', self: '[Circular]' });
  });

  it('serializa valores no serializables (funciones, symbols, bigint, Error, Date) sin lanzar', () => {
    // Arrange
    const meta = {
      fn: () => 42,
      sym: Symbol('x'),
      big: BigInt(10),
      when: new Date('2026-01-01T00:00:00.000Z'),
      err: new Error('boom'),
    };

    // Act
    const result = redact(meta) as Record<string, unknown>;

    // Assert
    expect(result.fn).toBe('[Function]');
    expect(result.sym).toBe('Symbol(x)');
    expect(result.big).toBe('10n');
    expect(result.when).toBe('2026-01-01T00:00:00.000Z');
    expect(result.err).toMatchObject({ name: 'Error', message: 'boom' });
    expect(() => JSON.stringify(result)).not.toThrow();
  });

  it('no marca como circular una referencia compartida no circular (DAG)', () => {
    // Arrange
    const shared = { path: '/shared' };
    const meta = { a: shared, b: shared };

    // Act
    const result = redact(meta);

    // Assert
    expect(result).toEqual({ a: { path: '/shared' }, b: { path: '/shared' } });
  });
});
