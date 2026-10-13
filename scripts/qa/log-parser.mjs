/**
 * Parser de logs de servicios para el informe QA (QA-DOC-STANDARD.md §3.7). Sin dependencias.
 * Reconoce: lineas Nest (`ERROR [Ctx]`), pino-pretty (`❌ Error | GET /x - (503)`, `res.statusCode`),
 * Next (`⨯`, `Error:`), access logs (`" 502 `), Postgres (`ERROR:`/`FATAL:`) y rechazos no manejados.
 */

const ANSI = /\u001b\[[0-9;]*m/g;
export const stripAnsi = (s) => String(s).replace(ANSI, '');

const RE = {
  error:
    /(?:^|[\s\]])(?:ERROR|FATAL)(?:[\s:[(]|$)|❌\s*Error|⨯|^\s*(?:[A-Z]\w*)?Error:/,
  fatal: /(?:^|[\s\]])FATAL(?:[\s:[(]|$)/,
  unhandled:
    /unhandled\s*(?:promise)?\s*rejection|UnhandledPromiseRejection|uncaught\s*exception|uncaughtException|unhandledRejection/i,
  warn: /(?:^|[\s\]#])WARN(?:ING)?(?:[\s:[(]|$)|⚠/i,
  // logs JSON de una linea (logger de Next): {"level":"error",...}
  jsonError: /^\s*\{.*"level"\s*:\s*"(?:error|fatal)"/,
  jsonFatal: /^\s*\{.*"level"\s*:\s*"fatal"/,
  jsonWarn: /^\s*\{.*"level"\s*:\s*"warn(?:ing)?"/,
  // pino-pretty del backend: stack: "NotFoundException: msg<backslash-n> at ..."
  stack: /^\s*stack:\s*"([A-Za-z0-9_]+):\s*([^"]*?)(?:\\n|")/,
  statusCode: /["']?statusCode["']?\s*[:=]\s*(5\d\d)\b/,
  message5xx: /\((5\d\d)\)/,
  access5xx: /["\]]\s(5\d\d)\s/,
  statusField: /["']status["']\s*:\s*(5\d\d)\b/,
};

/**
 * @param {string} text contenido crudo del log
 * @returns {{lines:number,error:number,fatal:number,fivexx:number,unhandled:number,warn:number,firstErrors:string[],fivexxLines:string[]}}
 */
/** Excepciones HTTP 4xx de Nest: errores de cliente manejados (casos negativos), no fallos del servicio. */
const HTTP_4XX =
  /^(?:BadRequest|Unauthorized|Forbidden|NotFound|MethodNotAllowed|NotAcceptable|RequestTimeout|Conflict|Gone|PayloadTooLarge|UnsupportedMediaType|UnprocessableEntity|PreconditionFailed|ImATeapot|Throttler|TooManyRequests)\w*Exception$/;

export function analyzeLog(text) {
  const lines = stripAnsi(text).split(/\r?\n/);
  const out = {
    lines: lines.filter((l) => l.trim()).length,
    error: 0,
    fatal: 0,
    fivexx: 0,
    http4xx: 0,
    groups: [],
    unhandled: 0,
    warn: 0,
    firstErrors: [],
    fivexxLines: [],
  };
  const groups = new Map();
  let pendingHeader = -1; // indice en firstErrors de un `ERROR (svc):` sin detalle todavia
  let pendingAt = -100;
  let lastStatusLine = -100;
  let lastStatusCode = '';
  const remember = (line) => {
    if (out.firstErrors.length < 10)
      out.firstErrors.push(line.trim().slice(0, 300));
  };
  lines.forEach((line, i) => {
    if (!line.trim()) return;
    let flagged = false;
    const st = line.match(RE.stack);
    if (st) {
      const [, cls, msg] = st;
      const key = `${cls}: ${msg}`;
      groups.set(key, (groups.get(key) ?? 0) + 1);
      if (HTTP_4XX.test(cls)) out.http4xx++;
      else {
        out.fivexx++;
        out.fivexxLines.push(key.slice(0, 300));
      }
      if (pendingHeader >= 0 && i - pendingAt <= 40) {
        out.firstErrors[pendingHeader] += ` ${key.slice(0, 200)}`;
      }
      pendingHeader = -1;
    }
    if (RE.fatal.test(line) || RE.jsonFatal.test(line)) out.fatal++;
    if (RE.error.test(line) || RE.jsonError.test(line)) {
      out.error++;
      flagged = true;
    }
    if (RE.unhandled.test(line)) {
      out.unhandled++;
      flagged = true;
    }
    const sc = line.match(RE.statusCode) ?? line.match(RE.statusField);
    const msg = line.match(RE.message5xx);
    const acc = line.match(RE.access5xx);
    if (sc) {
      out.fivexx++;
      lastStatusLine = i;
      lastStatusCode = sc[1];
      out.fivexxLines.push(line.trim().slice(0, 300));
      flagged = true;
    } else if (msg || acc) {
      const code = (msg ?? acc)[1];
      // pino imprime `res.statusCode` y despues el mensaje `(503)` del mismo evento: no duplicar.
      if (!(i - lastStatusLine <= 8 && code === lastStatusCode)) {
        out.fivexx++;
        out.fivexxLines.push(line.trim().slice(0, 300));
        flagged = true;
      }
    }
    if (RE.warn.test(line) || RE.jsonWarn.test(line)) out.warn++;
    if (flagged) {
      const before = out.firstErrors.length;
      remember(line);
      // `ERROR (svc):` de pino-pretty trae el detalle en lineas posteriores: se completa con el `stack`.
      if (out.firstErrors.length > before && /ERROR \(.*\):\s*$/.test(line)) {
        pendingHeader = out.firstErrors.length - 1;
        pendingAt = i;
      }
    }
  });
  out.groups = [...groups]
    .sort((a, b) => b[1] - a[1])
    .map(([key, n]) => ({ key, n }));
  return out;
}

/** Veredicto de logs: true si hay 5xx o errores no manejados (impide APROBADO sin explicacion). */
export const hasBlockingSignals = (a) => a.fivexx > 0 || a.unhandled > 0;

/** Cuantos ERROR no son una excepcion HTTP 4xx manejada. */
export const unexplainedErrors = (a) => Math.max(0, a.error - a.http4xx);

/** `key` es "Clase: mensaje" (clave de `groups`): true si la clase es una excepcion HTTP 4xx. */
export const isHttp4xxException = (key) => HTTP_4XX.test(key.split(':')[0]);
