#!/usr/bin/env node
/**
 * Generador de informes QA (estándar C:\workspace\QA-DOC-STANDARD.md §3). Sin dependencias.
 *
 * Uso:  node scripts/qa/report.mjs <unit|e2e|e2e-real>
 *   - e2e-real: Playwright contra el backend REAL de e2e (`playwright.real.config.ts`).
 *   - Ejecuta el runner (vitest o playwright) emitiendo JSON, y escribe
 *     test/qa/informes/AAAA-MM-DD_<tipo>_<rama-corta>.md
 *   - Si el informe ya existe, conserva lo escrito a mano (secciones 3, 4 y 6) en vez de pisarlo.
 *   - Variables: QA_EXECUTOR (ejecutor, default "humano").
 *   - Logs de servicios (§3.7): guarda en test/qa/informes/artefactos/<tipo>/logs/ el log de Next
 *     (`next.log`, via QA_LOGS_DIR), el del backend e2e (e2e-real: QA_BACKEND_LOG, default
 *     artefactos/backend-e2e-serve.log, solo lo escrito durante la corrida) y `docker compose logs`
 *     por contenedor (e2e-real: QA_BACKEND_DIR, default ../TekoApp-Backend). Los resume en la seccion 7.
 *   - Devuelve el exit code del runner, pero el informe se escribe siempre.
 */
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import {
  analyzeLog,
  hasBlockingSignals,
  isHttp4xxException,
  unexplainedErrors,
} from './log-parser.mjs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const INFORMES = join(ROOT, 'test', 'qa', 'informes');
const ARTEFACTOS = join(INFORMES, 'artefactos');
const CASOS = join(ROOT, 'test', 'qa', 'casos');
const type = process.argv[2];
if (!['unit', 'e2e', 'e2e-real'].includes(type)) {
  console.error('Uso: node scripts/qa/report.mjs <unit|e2e|e2e-real>');
  process.exit(2);
}

const sh = (cmd) => {
  const r = spawnSync(cmd, { shell: true, cwd: ROOT, encoding: 'utf8' });
  return (r.stdout ?? '').trim();
};
const posix = (p) => p.replace(/\\/g, '/');
const rel = (p) => posix(relative(ROOT, p));
const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
const fmtMs = (ms) =>
  ms >= 60000
    ? `${(ms / 60000).toFixed(1)} min`
    : `${(ms / 1000).toFixed(1)} s`;

mkdirSync(ARTEFACTOS, { recursive: true });
const jsonOut = join(ARTEFACTOS, `${type}.json`);

// ---------- 1. ejecutar el runner ----------
let command;
let env = { ...process.env };
if (type === 'unit') {
  const covDir = join(ARTEFACTOS, 'unit-coverage');
  command =
    `pnpm exec vitest run --reporter=json --outputFile=${rel(jsonOut)} ` +
    `--coverage.enabled --coverage.reporter=json-summary --coverage.reporter=html ` +
    `--coverage.reportsDirectory=${rel(covDir)}`;
} else {
  command =
    type === 'e2e-real'
      ? 'pnpm exec playwright test -c playwright.real.config.ts --reporter=html,json'
      : 'pnpm exec playwright test --reporter=html,json';
  env = {
    ...env,
    PLAYWRIGHT_JSON_OUTPUT_FILE: jsonOut,
    PLAYWRIGHT_HTML_REPORT: join(
      ARTEFACTOS,
      type === 'e2e-real' ? 'playwright-report-real' : 'playwright-report',
    ),
    PLAYWRIGHT_HTML_OPEN: 'never',
  };
}
// ---------- 1b. captura de logs de servicios (§3.7) ----------
const logsDir = join(ARTEFACTOS, type, 'logs');
rmSync(logsDir, { recursive: true, force: true });
mkdirSync(logsDir, { recursive: true });
env = { ...env, QA_LOGS_DIR: logsDir };
const backendLog =
  process.env.QA_BACKEND_LOG ?? join(ARTEFACTOS, 'backend-e2e-serve.log');
const backendDir =
  process.env.QA_BACKEND_DIR ?? join(ROOT, '..', 'TekoApp-Backend');
const composeFile = join(backendDir, 'docker-compose.e2e.yml');
const backendOffset =
  type === 'e2e-real' && existsSync(backendLog) ? statSync(backendLog).size : 0;
const startedAt = new Date();
const run = spawnSync(command, {
  shell: true,
  cwd: ROOT,
  env,
  stdio: 'inherit',
});
if (!existsSync(jsonOut)) {
  console.error(
    `El runner no produjo ${rel(jsonOut)}; no hay informe que generar.`,
  );
  process.exit(run.status ?? 1);
}
const data = JSON.parse(readFileSync(jsonOut, 'utf8'));

if (type === 'e2e-real') {
  if (existsSync(backendLog)) {
    writeFileSync(
      join(logsDir, 'backend.log'),
      readFileSync(backendLog).subarray(backendOffset),
    );
  } else {
    console.warn(
      `Sin log del backend (${backendLog}): ¿se redirigio e2e:serve?`,
    );
  }
  if (existsSync(composeFile)) {
    const compose = `docker compose -f "${composeFile}"`;
    const services = spawnSync(`${compose} config --services`, {
      shell: true,
      encoding: 'utf8',
    })
      .stdout.split(/\r?\n/)
      .map((x) => x.trim())
      .filter(Boolean);
    for (const svc of services) {
      const r = spawnSync(
        `${compose} logs --no-color --since ${startedAt.toISOString()} ${svc}`,
        { shell: true, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 },
      );
      writeFileSync(
        join(logsDir, `docker-${svc}.log`),
        `${r.stdout ?? ''}${r.stderr ?? ''}`,
      );
    }
  }
}

// ---------- 2. mapa archivo/test -> CP- desde casos/*.md ----------
const cpByTest = new Map(); // "archivo::nombre" -> ID
const cpByFile = new Map(); // archivo -> Set(ID)
if (existsSync(CASOS)) {
  for (const f of readdirSync(CASOS).filter((n) => n.endsWith('.md'))) {
    let current = null;
    for (const line of readFileSync(join(CASOS, f), 'utf8').split(/\r?\n/)) {
      const h = line.match(/^###\s+(CP-[A-Z]+-[A-Z0-9]+-\d+)/);
      if (h) current = h[1];
      if (current && /Automatizado en/.test(line)) {
        const spans = [...line.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
        const files = spans.filter((s) => /\.(test|spec)\.tsx?$/.test(s));
        const names = spans.filter((s) => !/\.(test|spec)\.tsx?$/.test(s));
        for (const file of files) {
          if (!cpByFile.has(file)) cpByFile.set(file, new Set());
          cpByFile.get(file).add(current);
          for (const n of names) cpByTest.set(`${file}::${n}`, current);
        }
      }
    }
  }
}

// ---------- 3. normalizar resultados ----------
const icon = {
  defect: 'DEFECTO (fallo esperado)',
  passed: 'PASÓ',
  failed: 'FALLÓ',
  skipped: 'OMITIDO',
  flaky: 'FLAKY',
};
let duration;
let files; // [{file, tests:[{name,status,ms,error}]}]
if (type === 'unit') {
  files = data.testResults.map((tr) => ({
    file: posix(relative(ROOT, tr.name)),
    tests: tr.assertionResults.map((a) => ({
      name: a.fullName ?? a.title,
      status:
        a.status === 'passed'
          ? 'passed'
          : a.status === 'failed'
            ? 'failed'
            : 'skipped',
      ms: a.duration ?? 0,
      error: (a.failureMessages ?? []).join(' ').slice(0, 300),
    })),
  }));
  // Suites que no cargaron (error de import) no traen assertionResults: se cuentan como fallo.
  for (const tr of data.testResults) {
    if (tr.status === 'failed' && tr.assertionResults.length === 0) {
      const f = files.find((x) => x.file === posix(relative(ROOT, tr.name)));
      f.tests.push({
        name: '(la suite no pudo ejecutarse)',
        status: 'failed',
        ms: 0,
        error: String(tr.message ?? '').slice(0, 300),
      });
    }
  }
  duration =
    Math.max(0, ...data.testResults.map((t) => t.endTime)) - data.startTime;
} else {
  files = [];
  const walk = (suite, titles) => {
    for (const spec of suite.specs ?? []) {
      const file = posix(
        join(type === 'e2e-real' ? 'e2e/real' : 'e2e', spec.file ?? suite.file),
      );
      let entry = files.find((x) => x.file === file);
      if (!entry) files.push((entry = { file, tests: [] }));
      const t = spec.tests?.[0];
      const results = t?.results ?? [];
      const last = results[results.length - 1];
      const expectedFail = t?.expectedStatus === 'failed';
      const status =
        t?.status === 'skipped'
          ? 'skipped'
          : expectedFail && t?.status === 'expected'
            ? 'defect'
            : t?.status === 'flaky'
              ? 'flaky'
              : spec.ok
                ? 'passed'
                : 'failed';
      entry.tests.push({
        name: [...titles, spec.title].join(' › '),
        raw: spec.title,
        status,
        ms: results.reduce((s, r) => s + (r.duration ?? 0), 0),
        error:
          last?.error?.message
            ?.replace(/\u001b\[[0-9;]*m/g, '')
            .slice(0, 300) ?? '',
        retries: Math.max(0, results.length - 1),
        annotations: (t?.annotations ?? []).filter(
          (a) => a.type === 'a11y' || a.type === 'a11y-scan',
        ),
      });
    }
    for (const s of suite.suites ?? []) walk(s, [...titles, s.title]);
  };
  for (const s of data.suites ?? []) walk(s, []);
  duration = data.stats?.duration ?? 0;
}
const all = files.flatMap((f) => f.tests);
const totals = {
  passed: all.filter((t) => t.status === 'passed').length,
  failed: all.filter((t) => t.status === 'failed').length,
  skipped: all.filter((t) => t.status === 'skipped').length,
  defect: all.filter((t) => t.status === 'defect').length,
  flaky: all.filter((t) => t.status === 'flaky').length,
};

// ---------- 4. cobertura (solo unit) ----------
let coverageMd = 'No aplica en e2e.';
if (type === 'unit') {
  const sumFile = join(ARTEFACTOS, 'unit-coverage', 'coverage-summary.json');
  if (existsSync(sumFile)) {
    const t = JSON.parse(readFileSync(sumFile, 'utf8')).total;
    const f = (k) => `${t[k].pct}% (${t[k].covered}/${t[k].total})`;
    coverageMd = `v8 sobre \`src/**\` (config de \`vitest.config.ts\`): líneas ${f('lines')} · sentencias ${f('statements')} · funciones ${f('functions')} · ramas ${f('branches')}.`;
  } else {
    coverageMd =
      'Sin cobertura: la corrida no produjo `coverage-summary.json` (¿falló el provider v8?).';
  }
}

// ---------- 5. cuerpo del informe ----------
const group = (file) => {
  let m;
  if ((m = file.match(/^src\/features\/([^/]+)\//)))
    return `src/features/${m[1]}`;
  if ((m = file.match(/^src\/components\/([^/]+)\//)))
    return `src/components/${m[1]}`;
  if (file.startsWith('src/core/')) return 'src/core';
  return 'otros';
};
const count = (ts) => ({
  n: ts.length,
  p: ts.filter((t) => t.status === 'passed').length,
  f: ts.filter((t) => t.status === 'failed').length,
  s: ts.filter((t) => t.status === 'skipped').length,
});

let results = '';
if (type === 'unit') {
  const groups = new Map();
  for (const f of files) {
    const g = group(f.file);
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(f);
  }
  const sorted = [...groups].sort(([a], [b]) => a.localeCompare(b));
  results +=
    '### Resumen por grupo\n\n| Grupo | Archivos | Casos | Pasaron | Fallaron | Omitidos |\n|---|---|---|---|---|---|\n';
  for (const [g, fs] of sorted) {
    const c = count(fs.flatMap((f) => f.tests));
    results += `| ${g} | ${fs.length} | ${c.n} | ${c.p} | ${c.f} | ${c.s} |\n`;
  }
  results += '\n### Detalle por archivo de spec\n';
  for (const [g, fs] of sorted) {
    results += `\n#### ${g}\n\n| Archivo | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |\n|---|---|---|---|---|---|---|\n`;
    for (const f of fs.sort((a, b) => a.file.localeCompare(b.file))) {
      const c = count(f.tests);
      const cps = [...(cpByFile.get(f.file) ?? [])].join(', ') || '—';
      results += `| \`${f.file.replace(g + '/', '')}\` | ${cps} | ${c.n} | ${c.p} | ${c.f} | ${c.s} | ${c.f ? icon.failed : icon.passed} |\n`;
    }
  }
  const failing = files.flatMap((f) =>
    f.tests
      .filter((t) => t.status === 'failed')
      .map((t) => ({ ...t, file: f.file })),
  );
  if (failing.length) {
    results +=
      '\n#### Casos fallidos\n\n| Archivo | Caso | Mensaje |\n|---|---|---|\n';
    for (const t of failing)
      results += `| \`${t.file}\` | ${esc(t.name)} | ${esc(t.error)} |\n`;
  }
} else {
  results +=
    '| Spec | CP- | Caso | Estado | Duración | Reintentos |\n|---|---|---|---|---|---|\n';
  for (const f of files) {
    for (const t of f.tests) {
      const cp =
        cpByTest.get(`${f.file}::${t.raw}`) ??
        t.raw.match(/CP-WEB-[A-Z0-9]+-\d+/)?.[0] ??
        '—';
      results += `| \`${f.file}\` | ${cp} | ${esc(t.name)} | ${icon[t.status]} | ${fmtMs(t.ms)} | ${t.retries} |\n`;
    }
  }
  const failing = files.flatMap((f) =>
    f.tests
      .filter((t) => t.status === 'failed')
      .map((t) => ({ ...t, file: f.file })),
  );
  if (failing.length) {
    results +=
      '\n#### Casos fallidos\n\n| Spec | Caso | Mensaje |\n|---|---|---|\n';
    for (const t of failing)
      results += `| \`${t.file}\` | ${esc(t.name)} | ${esc(t.error)} |\n`;
  }
}

// ---------- 5b. violaciones a11y (anotaciones `a11y` de scanA11y) ----------
if (type === 'e2e-real') {
  const scanned = new Map(); // pagina -> reglas con violaciones (Map regla|impacto -> nodos)
  for (const f of files)
    for (const t of f.tests)
      for (const a of t.annotations ?? []) {
        const parts = String(a.description)
          .split('|')
          .map((x) => x.trim());
        if (a.type === 'a11y-scan') {
          if (!scanned.has(parts[1])) scanned.set(parts[1], new Map());
        } else {
          const [, path, rule, impact, nodes] = parts; // parts[5] = selector del 1er nodo
          if (!scanned.has(path)) scanned.set(path, new Map());
          const rules = scanned.get(path);
          const k = `${rule}|${impact}`;
          rules.set(k, Math.max(rules.get(k) ?? 0, Number(nodes)));
        }
      }
  results +=
    '\n### Escaneo a11y (axe, reglas serious/critical) por página visitada\n\n';
  if (scanned.size === 0) {
    results += 'Sin escaneos.\n';
  } else {
    results +=
      '| Página | Violaciones (reglas) | Detalle (regla / impacto, nodos) |\n|---|---|---|\n';
    for (const [path, rules] of [...scanned].sort(([x], [y]) =>
      x.localeCompare(y),
    )) {
      const det =
        [...rules]
          .map(([k, n]) => `${k.replace('|', ' / ')} x${n}`)
          .join('; ') || '—';
      results += `| \`${path}\` | ${rules.size} | ${det} |\n`;
    }
  }
}

// ---------- 5c. resumen de logs de servicios ----------
const logAnalyses = existsSync(logsDir)
  ? readdirSync(logsDir)
      .filter((n) => n.endsWith('.log'))
      .sort()
      .map((n) => ({
        service: n.replace(/\.log$/, ''),
        file: rel(join(logsDir, n)),
        a: analyzeLog(readFileSync(join(logsDir, n), 'utf8')),
      }))
  : [];
const blocking = logAnalyses.filter((l) => hasBlockingSignals(l.a));
let logsMd = '';
if (type === 'unit') {
  logsMd =
    'No aplica: las pruebas unitarias corren en jsdom y no levantan servicios.\n';
} else if (logAnalyses.length === 0) {
  logsMd = 'Sin logs capturados en esta corrida.\n';
} else {
  logsMd +=
    '| Servicio | Líneas | ERROR/FATAL | de ellos HTTP 4xx manejados | 5xx | No manejados | WARN | Archivo |\n|---|---|---|---|---|---|---|---|\n';
  for (const { service, file, a } of logAnalyses)
    logsMd += `| ${service} | ${a.lines} | ${a.error} (FATAL ${a.fatal}) | ${a.http4xx} | ${a.fivexx} | ${a.unhandled} | ${a.warn} | \`${file}\` |\n`;
  for (const { service, a } of logAnalyses) {
    if (a.groups.length) {
      logsMd += `\n**${service}** — errores agrupados por excepción (top 15):\n\n| Excepción: mensaje | Veces | Tipo |\n|---|---|---|\n`;
      for (const g of a.groups.slice(0, 15))
        logsMd += `| ${esc(g.key)} | ${g.n} | ${isHttp4xxException(g.key) ? '4xx manejado' : 'INTERNO (5xx)'} |\n`;
    }
    if (a.firstErrors.length === 0) continue;
    logsMd += `\n**${service}** — primeras ${a.firstErrors.length} líneas de error:\n\n\`\`\`text\n${a.firstErrors.join('\n')}\n\`\`\`\n`;
  }
  const unexplained = logAnalyses.filter((l) => unexplainedErrors(l.a) > 0);
  if (unexplained.length) {
    logsMd += `\nERROR que no son una excepción HTTP 4xx manejada: ${unexplained.map((l) => `${l.service} (${unexplainedErrors(l.a)})`).join(', ')}. Revisarlos a mano.\n`;
  }
  if (blocking.length) {
    logsMd += `\n**Señales bloqueantes** (5xx o errores no manejados) en: ${blocking.map((l) => l.service).join(', ')}. Con todos los tests en verde esto impide el veredicto APROBADO salvo que cada una quede explicada abajo y mapeada a un CP negativo esperado (o registrada como DEF).\n`;
  }
}

// ---------- 6. encabezado + secciones ----------
const branch = sh('git rev-parse --abbrev-ref HEAD');
const short =
  branch.split('/').slice(1).join('-') || branch.replace(/\//g, '-');
const d = startedAt;
const pad = (n) => String(n).padStart(2, '0');
const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const outFile = join(INFORMES, `${date}_${type}_${short}.md`);
const pw = sh('pnpm exec playwright --version');
const vt = sh('pnpm exec vitest --version');
const dirty = sh('git status --porcelain -- . ":(exclude)test/qa/informes"')
  ? ' (árbol con cambios sin commitear)'
  : '';
const entorno =
  type === 'unit'
    ? `jsdom (local), Node ${process.version}, vitest ${vt}, ${process.platform}`
    : type === 'e2e-real'
      ? `local: backend REAL de e2e (TekoApp-Backend \`pnpm e2e:up/e2e:seed/e2e:serve\`, http://localhost:3100) + build standalone de Next en 127.0.0.1:3002 (\`scripts/e2e-real/serve.mjs\`), Chromium (${pw}), Node ${process.version}, ${process.platform}. Claves RSA y secret leídos en el arranque, no commiteados`
      : `local: fake-backend (\`e2e/fake-backend/server.mjs\`, puerto 4000) + build de producción de Next en 127.0.0.1:3001, Chromium (${pw}), Node ${process.version}, ${process.platform}. No es el backend real`;
const reportDir =
  type === 'e2e-real' ? 'playwright-report-real' : 'playwright-report';
const evidencia =
  type === 'unit'
    ? `- JSON crudo de vitest: \`${rel(jsonOut)}\` (ignorado por git, regenerable).\n- Cobertura HTML: \`${rel(join(ARTEFACTOS, 'unit-coverage', 'index.html'))}\` (ignorado por git).`
    : `- Reporte HTML de Playwright: \`${rel(join(ARTEFACTOS, reportDir, 'index.html'))}\` (abrir con \`pnpm exec playwright show-report ${rel(join(ARTEFACTOS, reportDir))}\`; ignorado por git).\n- JSON crudo: \`${rel(jsonOut)}\` (ignorado por git).\n- Trazas/capturas de fallos: \`test-results/\` (ignorado por git).
- Logs de servicios: \`${rel(logsDir)}/\` (ignorado por git; resumen en la sección 7).`;

// Preservar lo escrito a mano si el informe ya existe.
const manual = {
  3: '_Completar a mano: ID `DEF-WEB-NNN`, severidad, caso que lo detectó, repro y estado. Si no hay, escribir "Ninguno"._',
  4: '_Completar a mano: flakies, timeouts, entorno y omitidos con su motivo._',
  6: '_Completar a mano: APROBADO / APROBADO CON OBSERVACIONES / RECHAZADO, con su criterio._',
  7: blocking.length
    ? '_SIN EXPLICAR: completar a mano cada 5xx / error no manejado con su CP negativo esperado o su DEF. Mientras tanto el veredicto no puede ser APROBADO._'
    : '_Sin señales bloqueantes._',
};
if (existsSync(outFile)) {
  const prev = readFileSync(outFile, 'utf8');
  const mm = prev.match(
    /### Explicación de señales\n\n([\s\S]*?)(?=\n## \d\. |$)/,
  );
  if (mm && mm[1].trim() && !/SIN EXPLICAR|Sin señales bloqueantes/.test(mm[1]))
    manual[7] = mm[1].trim();
  for (const n of [3, 4, 6]) {
    const m = prev.match(
      new RegExp(`## ${n}\\. [^\\n]*\\n\\n([\\s\\S]*?)(?=\\n## \\d\\. |$)`),
    );
    if (m && m[1].trim() && !m[1].includes('Completar a mano'))
      manual[n] = m[1].trim();
  }
}

const md = `# Informe de ejecución — ${type === 'unit' ? 'pruebas unitarias y de componente' : type === 'e2e-real' ? 'e2e Playwright contra el backend real' : 'e2e Playwright (fake-backend)'}

| Campo | Valor |
|---|---|
| Fecha y hora | ${date} ${time} |
| Repo | TekoApp-Frontend-Web |
| Rama | ${branch} |
| Commit | ${sh('git rev-parse --short HEAD')}${dirty} |
| Entorno | ${entorno} |
| Comando exacto | \`pnpm qa:${type}\` → \`${command}\` |
| Ejecutor | ${process.env.QA_EXECUTOR ?? 'humano'} |

## 1. Resumen

| Pasaron | Fallaron | Omitidos | Flaky | Total | Duración |
|---|---|---|---|---|---|
| ${totals.passed} | ${totals.failed} | ${totals.skipped} | ${totals.flaky} | ${all.length} | ${fmtMs(duration)} |

Cobertura: ${coverageMd}

${
  totals.defect
    ? `Casos con defecto conocido (\`test.fail()\`, fallo esperado, no cuentan como fallo del run): ${totals.defect}.

`
    : ''
}Exit code del runner: ${run.status}.

## 2. Resultados por ${type === 'unit' ? 'suite' : 'spec y caso'}

${results}
## 3. Defectos encontrados

${manual[3]}

## 4. Desvíos y observaciones

${manual[4]}

## 5. Evidencia

${evidencia}

## 6. Veredicto

${manual[6]}

## 7. Logs de servicios

${logsMd}
### Explicación de señales

${manual[7]}
`;
writeFileSync(outFile, md);
console.log(`Informe escrito: ${rel(outFile)}`);
process.exit(run.status ?? 0);
