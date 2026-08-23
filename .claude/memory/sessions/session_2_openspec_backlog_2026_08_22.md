# Sesión 2 — 2026-08-23 — openspec nuevo para el backlog 2026-08-22

## Qué se hizo

Sesión trabajada principalmente desde `TekoApp-Frontend-Mobile`, tocando este repo solo para
documentar (NO implementar) la parte de backoffice/admin de 6 features grandes pedidas por José:
documentos/antecedentes del profesional, bitácora de trabajo, presupuestos multi-opción, contratos
desde presupuesto, disclosure de IA, protección de datos/imágenes.

Este repo no tenía la convención `openspec/` (SDD) que ya usa `TekoApp-Frontend-Mobile` — se creó
por primera vez acá (`README.md`, `project.md`, `decisions.md`, `specs/`, `changes/0001`-`0004`).
Solo se documentaron las 4 features que tienen una superficie real de backoffice en Web
(verificación de documentos del profesional, gestión del catálogo de materiales/presupuestos,
disclosure de IA admin, consentimiento/protección de datos admin) — bitácora de trabajo y
contratos quedaron sin spec propia acá (ver "Decisiones pendientes" abajo).

## Decisiones pendientes para José (flaggeadas por el agente que escribió las specs, no resueltas)

- Bitácora de trabajo (ítem 7 del backlog) y contratos (ítem 9): sin spec de Web dedicada — el
  default propuesto es extender la vista de detalle de `admin/services` ya existente en vez de una
  pantalla nueva. Confirmar antes de implementar.
- "Firma digital" de contratos (ítem 9): explícitamente NO es una firma electrónica calificada —
  el texto de cara al usuario sobre esto necesita el visto bueno de José.
- `openspec/decisions.md` ítem 3: si los permisos nuevos de compliance/legal necesitan un rol de
  staff dedicado.

## Estado al cierre

Solo cambios de documentación (`openspec/`) — sin tocar código de producción. PR pendiente de
push/PR/merge al momento de escribir esto.

## Pendiente para la próxima sesión

- Resolver las 3 decisiones pendientes de arriba con José antes de implementar cualquiera de las
  4 features documentadas.
- Implementar cuando se priorice — ver `openspec/changes/0001`-`0004`.
