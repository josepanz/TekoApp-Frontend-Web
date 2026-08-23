# OpenSpec en TekoApp-Frontend-Web — cómo trabajar acá

Replica el patrón SDD ya validado en `TekoApp-Frontend-Mobile/openspec/` (ver ese `README.md` para
la justificación completa) y en `TekoApp-Backend/openspec/` — se crea acá el 2026-08-23 porque este
repo tampoco tenía una convención de spec previa a la implementación
(`.claude/documentation/architecture.md` documenta arquitectura ya construida, no diseño previo).

## Alcance de esta carpeta

Cubre únicamente las superficies de **backoffice/staff** de las 6 features grandes pedidas
2026-08-22 (ver `TekoApp-Frontend-Mobile/openspec/decisions.md`). No las 6 features tienen una
superficie de staff nueva — `work-progress-log` (bitácora de trabajo) y, dependiendo de qué se
decida, `service-contracts` (contratos) se resuelven extendiendo pantallas de admin ya existentes
en vez de una spec dedicada acá; ver la nota de alcance en las specs de backend correspondientes
(`TekoApp-Backend/openspec/specs/work-progress-log.md`).

## Estructura

```
openspec/
├── README.md    ← este archivo
├── project.md    ← arquitectura real de este repo (referencia .claude/CLAUDE.md, no lo duplica)
├── decisions.md  ← decisiones de arquitectura específicas de estas 4 superficies (ADR-style)
├── specs/        ← el contrato de cada pantalla/flujo nuevo de staff
│   ├── professional-documents.md
│   ├── material-catalog.md
│   ├── ai-content-disclosure-admin.md
│   └── data-and-media-consent-admin.md
└── changes/      ← el plan de implementación en fases, con tasks y checkpoint de salida
    ├── 0001-professional-documents-verification.md
    ├── 0002-budget-catalog-management.md
    ├── 0003-ai-content-disclosure-admin.md
    └── 0004-consent-and-data-protection-admin.md
```

Cada spec asume el patrón ya establecido del repo: `src/features/<dominio>/` (`api.ts`, `hooks.ts`,
`schemas.ts`, `components/`) + `src/app/admin/<dominio>/page.tsx`, generable con
`pnpm generate:feature <nombre> --paginated` como punto de partida (ver
`.claude/rules/typescript.md`), tipos desde `pnpm generate:api-types` una vez el backend exponga
los endpoints de `TekoApp-Backend/openspec/specs/`.
