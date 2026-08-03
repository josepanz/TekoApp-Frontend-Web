// Usado para alias-ear `server-only`/`client-only` en vitest.config.ts — esos paquetes tiran un
// error a propósito fuera del bundler de Next.js (chequean la condición de resolución
// "react-server", que Vitest no setea). No hay nada que testear acá, es un no-op.
export {};
