// Redacción de secretos para logging estructurado. Es una utilidad PURA (sin `server-only`,
// sin secrets, sin I/O): recibe metadata arbitraria y devuelve un clon garantizado-serializable
// con los valores de claves sensibles reemplazados por `[REDACTED]`.
//
// Un logger NUNCA debe tirar una excepción que rompa el request que está intentando loguear, así
// que esta función tolera: referencias circulares, funciones, symbols, bigint, Error y Date —
// nada de eso hace fallar `JSON.stringify` después de pasar por acá.

export const REDACTED = '[REDACTED]';

// Claves cuyo valor se redacta completo (case-insensitive, por substring). La lista cubre los
// nombres reales que aparecen hoy en `app/api/**` y `core/api-client/**` (`password`,
// `encryptedPassword`, `nonce`, header `authorization`, `cookie`, `clientSecret`/`secretKey`,
// `accessToken`/`refreshToken`) más variantes genéricas. `encryptedpassword` matchea por incluir
// `password`; `accesstoken`/`refreshtoken` por incluir `token`; `clientsecret`/`secretkey` por
// incluir `secret`.
const SENSITIVE_KEY_PATTERN =
  /(password|passwd|secret|token|nonce|authorization|cookie|credential|apikey)/i;

export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERN.test(key);
}

function sanitize(value: unknown, seen: WeakSet<object>): unknown {
  if (value === null || value === undefined) return value;

  const type = typeof value;
  if (type === 'string' || type === 'number' || type === 'boolean') {
    return value;
  }
  if (type === 'bigint') return `${(value as bigint).toString()}n`;
  if (type === 'function') return '[Function]';
  if (type === 'symbol') return (value as symbol).toString();

  // A partir de acá `value` es un objeto.
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  if (value instanceof Date) return value.toISOString();

  const obj = value as object;
  // Path-based cycle detection: se agrega al entrar y se quita al salir, así una referencia
  // COMPARTIDA (DAG) se serializa entera y solo una referencia CIRCULAR real se corta.
  if (seen.has(obj)) return '[Circular]';
  seen.add(obj);

  let result: unknown;
  if (Array.isArray(value)) {
    result = value.map((item) => sanitize(item, seen));
  } else {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      out[key] = isSensitiveKey(key) ? REDACTED : sanitize(val, seen);
    }
    result = out;
  }

  seen.delete(obj);
  return result;
}

/**
 * Devuelve un clon de `meta` seguro para serializar: valores de claves sensibles redactados,
 * referencias circulares cortadas, tipos no serializables convertidos a string. Nunca lanza.
 */
export function redact(meta: Record<string, unknown>): Record<string, unknown> {
  return sanitize(meta, new WeakSet()) as Record<string, unknown>;
}
