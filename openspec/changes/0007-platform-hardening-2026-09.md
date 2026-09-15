# Fase 0007 — Endurecimiento de plataforma (Web)

Auditoría completa y transversal: `TekoApp-Backend/openspec/specs/platform-audit-2026-09.md`.
Contrapartes: `TekoApp-Backend/openspec/changes/0013-platform-hardening-2026-09.md`,
`TekoApp-Frontend-Mobile/openspec/changes/0017-platform-hardening-2026-09.md`.

## Contexto

Auditoría pedida por José 2026-09-04 sobre los 3 repos. Todos los hallazgos fueron verificados
abriendo el archivo citado. Nota importante para quien lea esto después: **`.claude/rules/auth.md`
declara abierto un bug de `getSession()` que ya está corregido** (`core/auth/session.ts:90-95`
distingue correctamente 401 → `null` de 5xx/red → `SessionUnavailableError`). Corregir el doc es
parte de esta fase (C4) justamente para que futuras auditorías no lo vuelvan a reportar.

## Fase C — Contrato de permisos y robustez del BFF

- [ ] C1 — Agregar a `src/core/auth/permissions.ts` los 5 grupos que existen en el backend
      (`TekoApp-Backend/src/common/enum/permissions.enum.ts:62-79`) y acá no:
      `PROFESSIONAL_PORTFOLIO.REVIEW`, `PROFESSIONALS.VERIFY`, `CONTRACTS.AUDIT_VIEW`,
      `RATINGS.AUDIT_VIEW`, `PAYMENTS.AUDIT_VIEW`. Hoy `features/payments/api.ts:62` menciona
      `payments.audit:read` en un comentario porque no hay constante que referenciar — exactamente
      lo que `rules/typescript.md` prohíbe.
- [ ] C2 — Verificar si esos permisos están asignados a algún rol. Si alguno no lo está (como pasó
      con `service-progress.audit:read`, ver `openspec/decisions.md:121-129`), `/admin/payments` y
      `/admin/ratings` son pantallas visibles que dan 403 a todo el mundo → aplicar el mismo gate
      client-side que ya usa `service-progress-section.tsx:24`.
- [ ] C3 — `proxyToBackend` (`core/api-client/backend-proxy.ts:65-75`) devuelve un 502 estructurado
      (`{ message: 'backend_unreachable' }`) en vez de re-lanzar crudo. Hoy Next produce un 500
      opaco y `apiFetch` sintetiza un mensaje genérico: el caller no puede distinguir "backend
      caído" de "backend respondió mal".
- [ ] C4 — Extraer el bloque duplicado de parseo de error de `apiFetch` (`client.ts:43-55`) y
      `uploadFile` (`:77-110`) a un `parseErrorResponse(response)` compartido.
- [ ] C5 — Corregir `.claude/rules/auth.md`: el bug de `getSession()` está resuelto, el doc no.
- [ ] **Checkpoint C**: `pnpm check:types`/`lint`/`test` en verde.

## Fase E — Accesibilidad en el flujo de ingresos (CRÍTICO)

- [ ] E1 — `features/request-service/components/location-picker-map.tsx`: hoy la única forma de
      fijar lat/lng es arrastrar el marcador (`dragend`) o hacer click en el mapa. No hay handler de
      teclado ni entrada manual, y el `Input` de dirección (`request-service-form.tsx:188-198`) es
      texto libre que nunca se sincroniza. **Un usuario de solo-teclado no puede completar
      `/solicitar`** — el flujo por donde entra la demanda. Fallo WCAG 2.1.1.
      Opciones: campos manuales de lat/lng, o geocodificar la dirección escrita y mover el marcador.
- [ ] E2 — Test que cubra el camino sin mouse.
- [ ] **Checkpoint E**: gates verdes + verificación manual con teclado.

## Fase F — Dominio de contratos sin UI

- [ ] F1 — Crear `features/contracts/` (`api.ts`/`hooks.ts`/`components/`) y la ruta
      `app/admin/contracts/page.tsx`. El backend ya expone `@Controller('admin/contracts')` con
      `@Get()` gateado por `CONTRACTS.AUDIT_VIEW` (`admin-contracts.controller.ts:13,18-19`) y en
      Web **no existe ni la feature ni la ruta** — todo el dominio de contratos de servicio es
      invisible para el staff.
- [ ] F2 — Ítem de navegación + tests + handlers MSW.
- [ ] **Checkpoint F**: gates verdes.

## Fase G — Peso visual (forma y formato)

Todas las páginas comparten el esqueleto generado (`h1` + descripción + componente) a propósito; la
vida visual debe estar en el componente hijo. Referencia de lo que sí está bien:
`features/analytics/components/overview.tsx` + `stat-card.tsx`, y el hero con
`BrandGradientBackground` de `(client)/page.tsx:18-23` — las dos únicas superficies que aplican el
80/20 verde/teal con intención.

- [ ] G1 — `(client)/solicitar` (`request-service-form.tsx`): **la pantalla por donde entra el
      ingreso**. Hoy es un formulario apilado sin `Card`, sin indicador de pasos, sin acento en el
      CTA. Máxima prioridad del pase visual.
- [ ] G2 — `(client)/postularme-como-profesional` (`professional-application-form.tsx`): el embudo
      de captación de oferta, mismo tratamiento nulo.
- [ ] G3 — `pro/perfil` (`professional-profile-form.tsx`): la página más visitada por un
      profesional, sin panel de avatar/preview, sin indicador de completitud, sin agrupación en cards.
- [ ] G4 — `admin/categories` (`categories-table.tsx`): `DataTable` pelada, sin `Badge` ni color ni
      para el booleano de visibilidad.
- [ ] G5 — `admin/roles-permission/[id]` (`role-detail-view.tsx`): detalle sin jerarquía visual.
- [ ] G6 — Transversal: varias tablas muestran ids crudos en vez de nombres
      (`ratings-table.tsx:75-83` renderiza `#${userId}`) — usabilidad y nombre accesible a la vez.
- [ ] **Checkpoint G**: gates verdes + revisión visual en claro Y oscuro (regla no negociable del
      design system).

## Fase I — Sostenibilidad (specs, sin código)

- [ ] I1 — UI de borrado de cuenta (depende del endpoint que defina Backend I1).
- [ ] I2 — Faltantes de portal admin a escala: visor de auditoría, acciones masivas, export CSV,
      búsqueda global cross-entidad. Ninguno existe hoy.
- [ ] I3 — Cobertura e2e de los flujos críticos sin cubrir: pagos (reembolso/cancelación/propina),
      postulación → verificación de profesional, colas de revisión de documentos/portafolio.
      Nota: `rules/test.md` describe mal la cobertura actual (dice "login + users CRUD"; lo real es
      `login`, `admin-categories`, `client-solicitar`, `smoke`) — corregir el doc también.

## Checkpoint de salida (Web)

- [ ] Ningún permiso del backend queda sin constante tipada en Web.
- [ ] `/solicitar` se puede completar íntegramente con teclado.
- [ ] El staff puede ver contratos desde el portal.
- [ ] Las 5 pantallas de la Fase G se ven al nivel del dashboard de analytics, en ambos temas.
