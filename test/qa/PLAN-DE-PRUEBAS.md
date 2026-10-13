# Plan de pruebas — TekoApp-Frontend-Web

Contexto: `C:\workspace\TEKOAPP-E2E-MASTER-PLAN.md` (§3 módulos/prioridades, §6 auditoría UI/UX). Prioridades P0–P3 como allí.

## 1. Alcance

Portal web Next 16 (App Router, next-intl, TanStack Query/Table, Base UI). Incluye: componentes compartidos (`src/components`), features (`src/features/*`), núcleo (`src/core`: api-client, auth, config) y flujos de usuario cliente/profesional/staff. Fuera de alcance: lógica del backend (se prueba en su repo), rendimiento/carga, seguridad ofensiva.

Cambios de esta rama (`feat/admin-ui-datatable-emptystate`): `EmptyState`, `DataTable` extendido, migración de tablas admin, formulario de promociones dividido, combobox con búsqueda en consent-audit, mapa de ubicaciones con contrato nuevo.

## 2. Niveles de prueba

### 2.1 Unitaria y de componente

- Herramientas: Vitest 4, jsdom, Testing Library, user-event, MSW (`src/test/msw`).
- ~95 archivos `*.test.ts(x)` junto al código; timeout 10 s por test (`vitest.config.ts`).
- Se mockea la red con MSW y librerías pesadas (Google Maps) con stubs.
- Ejecución: `pnpm qa:unit` (cobertura v8 sobre `src/**`, excluyendo `src/app`, stories, `design-system` y tipos generados).
- Casos documentados: `casos/CP-UI.md`, `CP-ADMIN.md`, `CP-LOC.md`.

### 2.2 Integración de componente con red simulada

Mismos archivos que 2.1 cuando el test monta tabla/formulario completo con providers (`@/test/render`) y handlers MSW (estados cargando/vacío/error, filtros enviados al backend).

### 2.3 Accesibilidad (Storybook a11y)

`@storybook/addon-a11y` 10.5.5 sobre las stories (`pnpm storybook`). Manual/asistida; no genera informe automático todavía. Complementa los asserts ARIA de los tests (`aria-busy`, `aria-sort`, `role=alert|status`).

### 2.4 e2e Playwright contra fake-backend

- `e2e/*.spec.ts`: 14 casos en 7 specs (`casos/CP-E2E.md`). Chromium, 1 worker, locale `es-PY`.
- Backend simulado: `e2e/fake-backend/server.mjs` (estado en memoria, una sola cuenta staff). Next se sirve como build de producción.
- Ejecución: `pnpm qa:e2e`.
- Limitación: no valida el contrato real con el backend ni roles distintos.

### 2.5 e2e real contra backend (pendiente, oleada W1)

Stack compose con el backend real, usuarios fixture por rol (cliente, profesional, staff), recorrido M1..M11 del plan maestro. Aún no existe; cuando se implemente tendrá su propio `CP-*` y un informe tipo `e2e-real`.

## 3. Entornos

| Entorno        | Composición                                          | Uso              |
| -------------- | ---------------------------------------------------- | ---------------- |
| Local unit     | Node >= 22, jsdom                                    | `qa:unit`        |
| Local e2e fake | Node >= 22, Chromium, fake-backend :4000, Next :3001 | `qa:e2e`         |
| CI             | GitLab/GitHub CI (lint → typecheck → unit → e2e)     | regresión por PR |
| Real (W1)      | compose backend + Postgres + Mongo + Redis           | pendiente        |

## 4. Criterios

**Entrada:** rama compila (`pnpm check:types`), `pnpm lint` limpio, dependencias instaladas, Chromium instalado para e2e.

**Salida / veredicto del informe:**

- APROBADO: 0 fallidos, 0 omitidos sin justificar, typecheck y lint en verde.
- APROBADO CON OBSERVACIONES: 0 fallidos en casos P0/P1, con defectos P2/P3 abiertos, flakies o brechas de cobertura documentadas.
- RECHAZADO: algún caso P0/P1 falla o la suite no puede ejecutarse.

## 5. Riesgos

| Riesgo                                                             | Mitigación                                                   |
| ------------------------------------------------------------------ | ------------------------------------------------------------ |
| Fake-backend con estado en memoria: los specs se acoplan por orden | Datos fijos por flujo; no asumir tablas vacías; 1 worker     |
| Hidratación en dev provoca submits nativos                         | e2e contra build de producción                               |
| Mocks de Google Maps ocultan integración real                      | Prueba manual CP-WEB-LOC-004 y e2e real (W1)                 |
| Timeouts intermitentes por contención de CPU                       | `testTimeout` 10 s; reportar flakies en el informe           |
| Brechas sin test (p. ej. aviso de ubicación aproximada)            | Registradas en los CP- como "pendiente"                      |
| Un solo usuario en el fake-backend impide probar permisos por rol  | Cubierto por unit con permisos mockeados; roles reales en W1 |
