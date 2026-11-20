#!/usr/bin/env node
/**
 * Wrapper de procesos para capturar logs (QA-DOC-STANDARD.md §3.7).
 * Uso: node scripts/qa/tee.mjs <nombre> <comando...>
 * Si `QA_LOGS_DIR` esta definido, copia stdout+stderr del comando a `<QA_LOGS_DIR>/<nombre>.log`
 * (ademas de mostrarlos); si no, es un passthrough.
 */
import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/** Abre `<QA_LOGS_DIR>/<name>.log` para escritura, o null si no hay captura activa. */
export function openLog(name) {
  const dir = process.env.QA_LOGS_DIR;
  if (!dir) return null;
  mkdirSync(dir, { recursive: true });
  return createWriteStream(join(dir, `${name}.log`), { flags: 'a' });
}

/** Lanza `child` (ChildProcess con stdout/stderr en pipe) y vuelca su salida al log y a la consola. */
export function teeChild(child, log) {
  child.stdout?.on('data', (d) => {
    process.stdout.write(d);
    log?.write(d);
  });
  child.stderr?.on('data', (d) => {
    process.stderr.write(d);
    log?.write(d);
  });
}

if (process.argv[1]?.endsWith('tee.mjs')) {
  const [name, ...cmd] = process.argv.slice(2);
  if (!name || cmd.length === 0) {
    console.error('Uso: node scripts/qa/tee.mjs <nombre> <comando...>');
    process.exit(2);
  }
  const log = openLog(name);
  const child = spawn(cmd.join(' '), {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  teeChild(child, log);
  for (const sig of ['SIGINT', 'SIGTERM'])
    process.on(sig, () => child.kill(sig));
  child.on('exit', (code) => {
    log?.end();
    process.exit(code ?? 0);
  });
}
