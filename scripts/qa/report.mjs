#!/usr/bin/env node
/**
 * Generador de informes QA (estándar C:\workspace\QA-DOC-STANDARD.md §3). Sin dependencias.
 *
 * Uso:  node scripts/qa/report.mjs <unit|e2e>
 *   - Ejecuta el runner (vitest o playwright) emitiendo JSON, y escribe
 *     test/qa/informes/AAAA-MM-DD_<tipo>_<rama-corta>.md
 *   - Si el informe ya existe, conserva lo escrito a mano (secciones 3, 4 y 6) en vez de pisarlo.
 *   - Variables: QA_EXECUTOR (ejecutor, default "humano").
 *   - Devuelve el exit code del runner, pero el informe se escribe siempre.
 */
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const INFORMES = join(ROOT, 'test', 'qa', 'informes');
const ARTEFACTOS = join(INFORMES, 'artefactos');
const CASOS = join(ROOT, 'test', 'qa', 'casos');
const type = process.argv[2];
if (!['unit', 'e2e'].includes(type)) {
  console.error('Uso: node scripts/qa/report.mjs <unit|e2e>');
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
  command = 'pnpm exec playwright test --reporter=html,json';
  env = {
    ...env,
    PLAYWRIGHT_JSON_OUTPUT_FILE: jsonOut,
    PLAYWRIGHT_HTML_REPORT: join(ARTEFACTOS, 'playwright-report'),
    PLAYWRIGHT_HTML_OPEN: 'never',
  };
}
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
      const file = posix(join('e2e', spec.file ?? suite.file));
      let entry = files.find((x) => x.file === file);
      if (!entry) files.push((entry = { file, tests: [] }));
      const t = spec.tests?.[0];
      const results = t?.results ?? [];
      const last = results[results.length - 1];
      const status =
        t?.status === 'skipped'
          ? 'skipped'
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
      const cp = cpByTest.get(`${f.file}::${t.raw}`) ?? '—';
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
    : `local: fake-backend (\`e2e/fake-backend/server.mjs\`, puerto 4000) + build de producción de Next en 127.0.0.1:3001, Chromium (${pw}), Node ${process.version}, ${process.platform}. No es el backend real`;
const evidencia =
  type === 'unit'
    ? `- JSON crudo de vitest: \`${rel(jsonOut)}\` (ignorado por git, regenerable).\n- Cobertura HTML: \`${rel(join(ARTEFACTOS, 'unit-coverage', 'index.html'))}\` (ignorado por git).`
    : `- Reporte HTML de Playwright: \`${rel(join(ARTEFACTOS, 'playwright-report', 'index.html'))}\` (abrir con \`pnpm exec playwright show-report ${rel(join(ARTEFACTOS, 'playwright-report'))}\`; ignorado por git).\n- JSON crudo: \`${rel(jsonOut)}\` (ignorado por git).\n- Trazas/capturas de fallos: \`test-results/\` (ignorado por git).`;

// Preservar lo escrito a mano si el informe ya existe.
const manual = {
  3: '_Completar a mano: ID `DEF-WEB-NNN`, severidad, caso que lo detectó, repro y estado. Si no hay, escribir "Ninguno"._',
  4: '_Completar a mano: flakies, timeouts, entorno y omitidos con su motivo._',
  6: '_Completar a mano: APROBADO / APROBADO CON OBSERVACIONES / RECHAZADO, con su criterio._',
};
if (existsSync(outFile)) {
  const prev = readFileSync(outFile, 'utf8');
  for (const n of [3, 4, 6]) {
    const m = prev.match(
      new RegExp(`## ${n}\\. [^\\n]*\\n\\n([\\s\\S]*?)(?=\\n## \\d\\. |$)`),
    );
    if (m && m[1].trim() && !m[1].includes('Completar a mano'))
      manual[n] = m[1].trim();
  }
}

const md = `# Informe de ejecución — ${type === 'unit' ? 'pruebas unitarias y de componente' : 'e2e Playwright (fake-backend)'}

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

Exit code del runner: ${run.status}.

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
`;
writeFileSync(outFile, md);
console.log(`Informe escrito: ${rel(outFile)}`);
process.exit(run.status ?? 0);
