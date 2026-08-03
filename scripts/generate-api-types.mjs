// Genera src/core/api-client/types.generated.ts desde el Swagger (OpenAPI) de TekoApp-Backend.
// Requiere el backend corriendo localmente (o BACKEND_API_URL apuntando a un ambiente real).
// Correr con `pnpm generate:api-types`. NO editar el archivo generado a mano.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import openapiTS, { astToString } from 'openapi-typescript';

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? 'http://localhost:3000/tekoapp-backend/api';
const SWAGGER_JSON_URL = `${BACKEND_API_URL}/swagger-json`;

const OUT_FILE = fileURLToPath(
  new URL('../src/core/api-client/types.generated.ts', import.meta.url),
);

const ast = await openapiTS(new URL(SWAGGER_JSON_URL));
const contents = astToString(ast);

await mkdir(dirname(OUT_FILE), { recursive: true });
await writeFile(
  OUT_FILE,
  `// GENERADO por \`pnpm generate:api-types\` desde ${SWAGGER_JSON_URL} — no editar a mano.\n${contents}`,
);

console.log(`Tipos generados en ${OUT_FILE}`);
