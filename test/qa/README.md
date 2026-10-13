# QA — TekoApp-Frontend-Web

Documentación de pruebas según `C:\workspace\QA-DOC-STANDARD.md` (base ISO/IEC/IEEE 29119-3, simplificada).

## Estructura

```
test/qa/
  README.md            este índice
  PLAN-DE-PRUEBAS.md   alcance, niveles, entornos, criterios y riesgos
  casos/               especificación de casos CP-WEB-<MOD>-NNN
    CP-UI.md           DataTable y EmptyState
    CP-ADMIN.md        tablas admin, formulario de promociones, combobox de consent-audit
    CP-LOC.md          mapa admin de ubicaciones
    CP-E2E.md          los 14 casos Playwright contra el fake-backend
    CP-AUTH.md         login/logout/errores (unitarias) y M1 e2e contra el backend real
    CP-CAT.md          M2 categorías e2e contra el backend real
    CP-A11Y.md         escaneo axe por página (backend real)
  informes/            un .md por ejecución real: AAAA-MM-DD_<tipo>_<rama-corta>.md
scripts/qa/report.mjs  generador de informes (Node, sin dependencias)
```

Los tests unitarios viven junto al código (`src/**/*.test.ts(x)`) y los e2e en `e2e/`.

## Cómo correr

| Comando                                              | Qué hace                                                                                                                                                                                                       |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm qa:unit`                                       | Vitest con reporter JSON y cobertura v8 (json-summary + html), luego genera el informe `unit`.                                                                                                                 |
| `pnpm qa:e2e`                                        | Playwright (reporter html + json) contra fake-backend + build de producción, luego genera el informe `e2e`.                                                                                                    |
| `pnpm qa:e2e-real`                                   | Playwright contra el **backend real** de e2e (`playwright.real.config.ts`, `e2e/real/`) + informe `e2e-real`. Requiere el backend arriba: `pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve` en TekoApp-Backend. |
| `pnpm test` / `pnpm test:e2e` / `pnpm test:e2e:real` | Corridas "crudas" sin informe.                                                                                                                                                                                 |

Requisitos: Node >= 22, `pnpm install`, y para e2e `pnpm exec playwright install chromium`. El e2e ejecuta `pnpm build`, por lo que tarda unos minutos.

## Cómo regenerar un informe

El generador ejecuta el runner, lee el JSON y escribe el `.md`. Las secciones 1, 2 y 5 (resumen, resultados, evidencia) se generan; las secciones 3 (defectos), 4 (desvíos) y 6 (veredicto) se completan a mano y **se conservan** si se vuelve a correr el mismo día en la misma rama. Variable opcional: `QA_EXECUTOR` (ejecutor que figura en el encabezado).

Solo el `.md` se commitea. El JSON crudo, la cobertura HTML y el reporte HTML de Playwright quedan en `test/qa/informes/artefactos/` (ignorado por git).

## Convenciones

- Cada test creado o modificado lleva el encabezado de comentario del estándar §4 (suite, casos CP-, tipo, prioridad, precondiciones, trazabilidad). Los tests viejos se documentan al tocarlos; el inventario del informe cubre todos.
- Cada caso CP- tiene el campo "Automatizado en" con archivo y nombre real del test; el generador lo usa para cruzar CP- con resultados.
- Defectos: `DEF-WEB-NNN`.
