import 'server-only';
import { redact } from './redact';

// Logger estructurado SERVER-ONLY. Emite una línea JSON por entrada (compatible con cualquier
// agregador — CloudWatch, Loki, Datadog, etc.; no se asume ninguno). `import 'server-only'` hace
// que el build de Next.js falle si un Client Component lo importa por accidente (mismo patrón que
// `core/auth/rsa-encrypt.ts`), garantizando que ningún secret pase por acá termine en el bundle
// del browser.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogMeta = Record<string, unknown>;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

function write(level: LogLevel, message: string, meta?: LogMeta): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    // `redact` ya garantiza serializabilidad (circular refs, funciones, secrets, etc.).
    ...(meta ? redact(meta) : {}),
  };

  let line: string;
  try {
    line = JSON.stringify(entry);
  } catch {
    // Salvaguarda final: jamás dejar que un fallo de serialización rompa el request real.
    line = JSON.stringify({
      timestamp: entry.timestamp,
      level,
      message,
      meta: '[unserializable]',
    });
  }

  // `warn`/`error` a stderr, el resto a stdout — convención estándar de los agregadores.
  const stream =
    level === 'warn' || level === 'error' ? process.stderr : process.stdout;
  stream.write(`${line}\n`);
}

export const logger = {
  debug: (message: string, meta?: LogMeta): void =>
    write('debug', message, meta),
  info: (message: string, meta?: LogMeta): void => write('info', message, meta),
  warn: (message: string, meta?: LogMeta): void => write('warn', message, meta),
  error: (message: string, meta?: LogMeta): void =>
    write('error', message, meta),
};
