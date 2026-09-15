# Fase 0006 — Onboarding de profesional y portafolio de trabajos

Spec de diseño, NO implementada todavía. Contrato completo:
`openspec/specs/professional-onboarding-and-portfolio.md`. Las Fases 0-3 no tienen dependencia de
backend (los endpoints ya existen); la Fase 5 depende de
`TekoApp-Backend/openspec/changes/0012-professional-onboarding-and-portfolio.md` (Fase 4, modelo
de portafolio nuevo).

## Antes de empezar

Leer `openspec/specs/professional-onboarding-and-portfolio.md` completo, en particular "Estado
real relevado" — confirma que `POST /professionals` y `POST /professionals/me/documents` ya
existen y funcionan, así que las Fases 1-2 son trabajo 100% de Web, no bloqueadas por nada.

## Objetivo

Cerrar el bug de "Cambiar de modo" huérfano, dar a un cliente la posibilidad real de postularse
como profesional desde el portal, y agregar el CTA de reclutamiento que hoy no existe en ningún
lado.

## Tareas

- [ ] **Fase 0**: fix del label huérfano en `app-sidebar.tsx`/`mode-switcher.tsx`.
- [ ] **Fase 1**: formulario de auto-postulación (`POST /professionals`).
- [ ] **Fase 2**: subida de documentos de compliance propia (`POST /professionals/me/documents`).
- [ ] **Fase 3**: CTA en el home de cliente.
- [ ] **Fase 5** (bloqueada por Backend): galería de portafolio.
- [ ] `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings en cada fase antes de
      pasar a la siguiente.

## Checkpoint de salida

Ver "Checkpoint de salida (Web)" en `openspec/specs/professional-onboarding-and-portfolio.md`.
