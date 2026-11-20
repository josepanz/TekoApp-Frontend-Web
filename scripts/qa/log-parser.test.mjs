import { describe, expect, it } from 'vitest';
import {
  analyzeLog,
  hasBlockingSignals,
  stripAnsi,
  unexplainedErrors,
} from './log-parser.mjs';

describe('analyzeLog', () => {
  it('quita colores ANSI', () => {
    expect(stripAnsi('\u001b[35mtype\u001b[39m: "Warn"')).toBe('type: "Warn"');
  });

  it('un log limpio no tiene señales', () => {
    const a = analyzeLog(
      '[Nest] 1  - LOG [NestFactory] Starting\nready on :3002\n',
    );
    expect(a).toMatchObject({
      error: 0,
      fatal: 0,
      fivexx: 0,
      unhandled: 0,
      warn: 0,
    });
    expect(hasBlockingSignals(a)).toBe(false);
  });

  it('cuenta ERROR/FATAL y WARN de Nest y Postgres', () => {
    const a = analyzeLog(
      [
        '[Nest] 1  - 13/10/2026     WARN [Fcm] FCM deshabilitado',
        '[Nest] 1  - 13/10/2026    ERROR [Svc] boom',
        '2026-10-13 FATAL:  password authentication failed',
        'ERROR:  duplicate key value',
      ].join('\n'),
    );
    expect(a.warn).toBe(1);
    expect(a.error).toBe(3);
    expect(a.fatal).toBe(1);
    expect(a.firstErrors).toHaveLength(3);
    expect(hasBlockingSignals(a)).toBe(false);
  });

  it('cuenta un 5xx de pino una sola vez aunque aparezca en dos lineas', () => {
    const a = analyzeLog(
      [
        '    \u001b[35mres\u001b[39m: {',
        '      "statusCode": 503',
        '    }',
        '    message: "❌ Error | GET /api/healthcheck - (503) | Trace ID: x"',
      ].join('\n'),
    );
    expect(a.fivexx).toBe(1);
    expect(a.error).toBe(1);
    expect(hasBlockingSignals(a)).toBe(true);
  });

  it('un mensaje (500) sin statusCode previo cuenta como 5xx', () => {
    expect(analyzeLog('❌ Error | POST /x - (500) | Trace ID: y').fivexx).toBe(
      1,
    );
  });

  it('detecta access logs 5xx y no confunde 4xx', () => {
    expect(analyzeLog('GET /x HTTP/1.1" 502 12').fivexx).toBe(1);
    expect(
      analyzeLog('GET /x HTTP/1.1" 404 12\n"statusCode": 409').fivexx,
    ).toBe(0);
  });

  it('detecta rechazos no manejados y errores de Next', () => {
    const a = analyzeLog(
      [
        '⨯ Error: fallo en render',
        'UnhandledPromiseRejection: x',
        'unhandledRejection',
      ].join('\n'),
    );
    expect(a.unhandled).toBe(2);
    expect(a.error).toBeGreaterThanOrEqual(1);
    expect(hasBlockingSignals(a)).toBe(true);
  });

  it('limita a 10 las primeras lineas de error', () => {
    const a = analyzeLog(
      Array.from({ length: 25 }, (_, i) => `ERROR e${i}`).join('\n'),
    );
    expect(a.error).toBe(25);
    expect(a.firstErrors).toHaveLength(10);
  });

  it('reconoce logs JSON de una linea (logger de Next)', () => {
    const a = analyzeLog(
      [
        '{"level":"info","message":"Intento de login"}',
        '{"level":"warn","message":"lento"}',
        '{"level":"error","message":"fallo","status":502}',
      ].join('\n'),
    );
    expect(a.error).toBe(1);
    expect(a.warn).toBe(1);
    expect(a.fivexx).toBe(1);
  });

  it('separa excepciones HTTP 4xx (esperadas) de excepciones internas (5xx)', () => {
    const entry = (cls, msg) =>
      [
        '[13:12:08.939] ERROR (App):',
        '    type: "Audit"',
        `    stack: "${cls}: ${msg}\\n    at X (a.ts:1:1)"`,
      ].join('\n');
    const a = analyzeLog(
      [
        entry('ConflictException', 'Ya enviaste una oferta'),
        entry('ConflictException', 'Ya enviaste una oferta'),
        entry('ForbiddenException', 'Sin acceso'),
        entry('TypeError', 'x is undefined'),
      ].join('\n'),
    );
    expect(a.error).toBe(4);
    expect(a.http4xx).toBe(3);
    expect(a.fivexx).toBe(1);
    expect(a.groups[0]).toEqual({
      key: 'ConflictException: Ya enviaste una oferta',
      n: 2,
    });
    expect(a.firstErrors[0]).toContain(
      'ConflictException: Ya enviaste una oferta',
    );
    expect(unexplainedErrors(a)).toBe(1);
  });
});
