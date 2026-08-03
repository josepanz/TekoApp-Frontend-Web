import { afterEach, describe, expect, it, vi } from 'vitest';
import { logger } from './logger';
import { REDACTED } from './redact';

function captureLine(
  stream: 'stdout' | 'stderr',
  emit: () => void,
): Record<string, unknown> {
  const spy = vi.spyOn(process[stream], 'write').mockImplementation(() => true);
  emit();
  const raw = spy.mock.calls[0]?.[0];
  spy.mockRestore();
  return JSON.parse(String(raw)) as Record<string, unknown>;
}

describe('logger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('emite una línea JSON con timestamp ISO, nivel, mensaje y metadata', () => {
    // Arrange
    const emit = (): void =>
      logger.info('proxy ok', { requestId: 'req-1', status: 200 });

    // Act
    const entry = captureLine('stdout', emit);

    // Assert
    expect(entry).toMatchObject({
      level: 'info',
      message: 'proxy ok',
      requestId: 'req-1',
      status: 200,
    });
    expect(typeof entry.timestamp).toBe('string');
    expect(new Date(entry.timestamp as string).toISOString()).toBe(
      entry.timestamp,
    );
  });

  it('redacta secretos en la metadata antes de serializar', () => {
    // Arrange
    const emit = (): void =>
      logger.info('login', { email: 'a@b.com', password: 'plano' });

    // Act
    const entry = captureLine('stdout', emit);

    // Assert
    expect(entry.email).toBe('a@b.com');
    expect(entry.password).toBe(REDACTED);
  });

  it('escribe warn y error a stderr y el resto a stdout', () => {
    // Arrange
    const errEntry = captureLine('stderr', () => logger.error('falló'));

    // Act
    const infoEntry = captureLine('stdout', () => logger.info('ok'));

    // Assert
    expect(errEntry.level).toBe('error');
    expect(infoEntry.level).toBe('info');
  });

  it('no lanza al loguear una referencia circular', () => {
    // Arrange
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    // Act
    const act = (): Record<string, unknown> =>
      captureLine('stderr', () => logger.warn('ciclo', circular));

    // Assert
    expect(act).not.toThrow();
    expect(act().self).toBe('[Circular]');
  });
});
