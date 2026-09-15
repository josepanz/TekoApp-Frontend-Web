# Spec: Plan de pruebas E2E de plataforma, por dependencia (menor a mayor)

Backend: `TekoApp-Backend/openspec/specs/e2e-test-plan.md`.
Mobile: `TekoApp-Frontend-Mobile/openspec/specs/e2e-test-plan.md`.

Pedido de José 2026-09-01: pruebas e2e sobre TODAS las funcionalidades de la plataforma, ordenadas
de menor a mayor dependencia, para ir puliendo la demo de Vercel/Render/Supabase fase por fase.
Este documento define el orden y alcance por tier para Playwright (`e2e/`) en este repo — no es
una implementación, es el mapa para ir llenando huecos reales tier por tier.

## Cómo usar este documento

- `rules/test.md` ya documenta que Playwright hoy cubre "login completo + un flujo CRUD
  representativo (users)" — confirmar el estado real de `e2e/` antes de escribir nada nuevo, no
  asumir que un tier está vacío.
- Cada tier depende de que el anterior tenga cobertura razonable — no escribir e2e de Tier 4
  (marketplace) si Tier 1 (auth) puede romperse en silencio.
- No se busca 100% de cobertura por ruta — un flujo representativo por dominio, mismo criterio ya
  vigente en `rules/test.md`.

## Tier 1 — Fundación (auth)

- [ ] Login completo (ya cubierto según `rules/test.md` — confirmar que sigue verde).
- [ ] Registro (`/register`) de punta a punta contra un backend de test — confirmar si ya está
      cubierto tras la Fase 0005 (registro/recuperación de cuenta); si no, agregarlo acá.
- [ ] Sesión expirada / 401 en medio de una navegación protegida → redirige a `/login?from=...`
      sin perder el destino.
- [ ] 5xx del backend NO debe tratarse como sesión inválida (bug ya documentado y corregido en
      `core/auth/session.ts#getSession()` — agregar un test e2e que lo confirme visualmente, no
      solo el unit test ya existente).

**Checkpoint Tier 1**: un usuario nuevo puede registrarse y loguearse de punta a punta vía
Playwright, contra un backend real de test.

## Tier 2 — Catálogos / administración base (depende de Tier 1)

- [ ] CRUD de categorías (`/admin/categories`) — confirmar que el flujo CRUD representativo
      mencionado en `rules/test.md` es este; si es otro dominio, agregar categorías como flujo
      adicional (íconos/colores son un área con bugs reales encontrados esta sesión, vale la pena
      cubrir el picker en e2e, no solo en Vitest).
- [ ] Catálogo de tipos de documento profesional (`/admin/professional-document-types`).

**Checkpoint Tier 2**: la administración de catálogos base tiene al menos un flujo e2e real.

## Tier 3 — Identidad extendida (depende de Tier 1)

- [ ] **Nuevo, tras `openspec/changes/0006-professional-onboarding-and-portfolio.md`**: un
      cliente se postula como profesional (`/postularme-como-profesional`) → aparece `PENDING` →
      un admin lo aprueba (`/admin/professionals`) → el cliente ve `/pro` disponible.
- [ ] Subida de documentos de compliance propia (Fase 2 de la spec de onboarding) → aparece en la
      cola de admin → aprobar/rechazar → el estado se refleja para el profesional.
- [ ] Portafolio (Fase 5, bloqueada por Backend): subir foto → aparece en el perfil público.

**Checkpoint Tier 3**: el flujo completo "cliente se postula → admin aprueba → opera como
profesional" corre de punta a punta en el navegador.

## Tier 4 — Marketplace core (depende de Tier 3)

- [ ] Solicitar un servicio (`/solicitar`) → aparece en `/admin/services` → cambia de estado.
- [ ] Presupuestos multi-opción — flujo representativo (armar → elegir).
- [ ] Contratos — flujo representativo (ver estado, no necesariamente firmar en e2e si requiere
      datos difíciles de simular en test).

## Tier 5 — Dinero y confianza (depende de Tier 4)

- [ ] `(client)/mis-pagos` — listado, detalle, cancelar (nunca reembolsar desde acá, ver
      `PENDING.md`).
- [ ] Propina desde `(client)/mis-pagos` — flujo representativo.
- [ ] Calificaciones — dejar una calificación, ver que respeta anonimato en la vista pública.

## Tier 6 — Cumplimiento y secundarios (paralelo a partir de Tier 1)

- [ ] Auditoría de consentimiento (`/admin/legal/consent-audit`) — flujo de lectura representativo.
- [ ] Disclosure de IA (`/admin/ai-disclosures`) — flujo de lectura representativo.

## Fuera de alcance de este documento

- Cobertura de accesibilidad automatizada (eso vive en `rules/accessibility.md`, checklist manual
  por componente) — este plan es de comportamiento funcional, no de a11y.
- Tests de carga/performance.
