/**
 * Suite: aterrizaje por rol despues del login.
 * Casos: CP-WEB-AUTH-116..120 (ver test/qa/casos/CP-AUTH.md)
 * Tipo: unitaria   Prioridad: P1
 * Precondiciones: funciones puras, sin mocks.
 * Trazabilidad: decision de UX del orquestador (aterrizaje por rol)
 */
import { describe, expect, it } from 'vitest';
import { isSafeReturnPath, resolvePostLoginPath } from './landing';

const COMPLIANCE = ['legal.config:manage', 'legal.consent-audit:read'];

describe('resolvePostLoginPath', () => {
  it('CP-WEB-AUTH-116 admin aterriza en /admin', () => {
    expect(
      resolvePostLoginPath({
        permissions: ['admin:all'],
        isProfessional: false,
      }),
    ).toBe('/admin');
  });

  it('CP-WEB-AUTH-117 compliance aterriza en su primera seccion permitida', () => {
    expect(
      resolvePostLoginPath({ permissions: COMPLIANCE, isProfessional: false }),
    ).toBe('/admin/legal/document-versions');
  });

  it('CP-WEB-AUTH-118 profesional aterriza en /pro y cliente en /', () => {
    expect(
      resolvePostLoginPath({ permissions: [], isProfessional: true }),
    ).toBe('/pro');
    expect(
      resolvePostLoginPath({ permissions: [], isProfessional: false }),
    ).toBe('/');
  });

  it('CP-WEB-AUTH-119 un from valido tiene prioridad sobre el rol', () => {
    expect(
      resolvePostLoginPath({
        from: '/admin/users',
        permissions: ['admin:all'],
        isProfessional: true,
      }),
    ).toBe('/admin/users');
  });

  it('CP-WEB-AUTH-120 ignora un from inseguro y usa el rol', () => {
    for (const from of [
      'https://evil.test',
      '//evil.test',
      '/login',
      '',
      null,
    ]) {
      expect(
        resolvePostLoginPath({
          from,
          permissions: ['admin:all'],
          isProfessional: false,
        }),
      ).toBe('/admin');
    }
  });

  it('staff que ademas es profesional va al backoffice', () => {
    expect(
      resolvePostLoginPath({
        permissions: ['admin:all'],
        isProfessional: true,
      }),
    ).toBe('/admin');
  });
});

describe('isSafeReturnPath', () => {
  it('acepta rutas internas y rechaza el resto', () => {
    expect(isSafeReturnPath('/solicitar?x=1')).toBe(true);
    expect(isSafeReturnPath('//x.test')).toBe(false);
    expect(isSafeReturnPath('http://x.test')).toBe(false);
    expect(isSafeReturnPath('/register')).toBe(false);
  });
});
