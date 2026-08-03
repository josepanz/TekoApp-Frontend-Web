// Copia los assets que `.next/standalone/server.js` necesita al lado suyo — mismo paso que
// hace el Dockerfile (public/, .next/static/) — para poder correrlo fuera de Docker (e2e local/CI).
import { cpSync, existsSync } from 'node:fs';

const copies = [
  ['public', '.next/standalone/public'],
  ['.next/static', '.next/standalone/.next/static'],
];

for (const [from, to] of copies) {
  if (existsSync(from)) {
    cpSync(from, to, { recursive: true });
  }
}

console.log('Assets de standalone copiados.');
