# Spec: Onboarding de profesional y portafolio de trabajos (Web)

Backend: `TekoApp-Backend/openspec/specs/professional-onboarding-and-portfolio.md`.
Mobile: `TekoApp-Frontend-Mobile/openspec/specs/professional-onboarding-and-portfolio.md`.
Reportado por José 2026-09-01: un cliente recién registrado (`josepanza1@gmail.com`, prueba real)
no tiene ninguna forma de convertirse en profesional en el portal — ni formulario de postulación,
ni subida de documentos propia, ni portafolio, ni CTA de "trabajá con nosotros". El selector
"Cambiar de modo" existe pero es un label huérfano para un usuario de un solo modo (ver bug
abajo).

## Estado real relevado (2026-09-01)

- **Bug encontrado durante el relevamiento** (relacionado con lo reportado, no exactamente lo
  mismo): `src/components/layout/app-sidebar.tsx:91` renderiza
  `<SidebarGroupLabel>{t('modeSwitcher.groupLabel')}</SidebarGroupLabel>` SIEMPRE, pero
  `<ModeSwitcher>` (línea siguiente, `src/components/layout/mode-switcher.tsx:47`) devuelve `null`
  si `otherModes.length === 0` — un usuario con un solo modo disponible (el caso de cualquier
  cliente recién registrado) ve el label "Cambiar de modo" flotando sin nada debajo. Arreglar en
  Fase 0 (condicionar el grupo completo, no solo el contenido).
- Backend YA soporta auto-postulación (`POST /professionals`, sin gate de rol) y subida de
  documentos propia (`POST /professionals/me/documents`) — Web no consume ninguno de los dos hoy.
  `src/features/professional-profile/` solo tiene edición de un perfil YA existente
  (`professional-profile-form.tsx`) — nada de creación.
- `ProModeLink`/`ProfessionalGate` (`src/features/professional-profile/components/`) ya resuelven
  "si tengo perfil profesional, mostrame el link a /pro" — se reusa el mismo patrón (invertido)
  para "si NO tengo perfil, mostrame la postulación".
- No existe una landing pública separada del dashboard autenticado — `(client)/page.tsx` ES el
  home autenticado (requiere sesión). El CTA de "trabajar con nosotros" va ahí, no en una landing
  nueva (crear una landing pre-login queda fuera de alcance de esta spec).

## Objetivo

1. Arreglar el label huérfano de "Cambiar de modo" (Fase 0, trivial, sin dependencias).
2. Formulario de auto-postulación a profesional (Fase 1) — reusa `POST /professionals`, cero
   trabajo de backend.
3. Subida de documentos de compliance propia (Fase 2, depende de la Fase 1) — reusa
   `POST /professionals/me/documents`, cero trabajo de backend, mismo patrón que Mobile ya tiene.
4. CTA "¿Querés trabajar con nosotros?" en el home de cliente (Fase 3, depende de la Fase 1 para
   tener a dónde enlazar).
5. Galería de portafolio (Fase 5, depende de `TekoApp-Backend`
   `openspec/changes/0012-professional-onboarding-and-portfolio.md`, Fase 4 — modelo nuevo).

## Fuera de alcance

- Una landing pública de marketing distinta del dashboard (`(client)/page.tsx` sigue siendo el
  único "home").
- Tocar la cola de revisión de staff ya existente (`src/features/professional-documents/`,
  `src/features/professional-document-types/`) — sigue igual.

## Fase 0 — Fix: ocultar el grupo completo si no hay otro modo

- [ ] `src/components/layout/app-sidebar.tsx` — levantar el cálculo de `otherModes` (hoy solo
      dentro de `ModeSwitcher`) a un nivel que también condicione el `SidebarGroupLabel` — por
      ejemplo, un único `if` que envuelva label + switcher.
- [ ] Test: un usuario con un solo modo no ve NINGÚN rastro de "Cambiar de modo" (ni label ni
      contenido).
- [ ] Test de regresión: un usuario con 2+ modos (ej. admin + profesional) sigue viendo el label y
      el switcher funcionando igual que hoy.

## Fase 1 — Formulario de auto-postulación a profesional

- [ ] Nuevo `src/features/professional-application/` (o extender `professional-profile` si se
      prefiere no duplicar carpeta — decisión a tomar al implementar, no bloqueante): `api.ts`
      (`POST /professionals`), `hooks.ts` (`useApplyAsProfessionalMutation`), `schemas.ts`
      (categoría, descripción, tarifas, años de experiencia, skills — mismos campos que ya pide
      Mobile en `professional_onboarding_screen.dart`, mantener paridad de campos entre
      plataformas).
- [ ] `components/professional-application-form.tsx` — `react-hook-form` + `zod`.
- [ ] Página nueva, ej. `src/app/(client)/postularme-como-profesional/page.tsx` (autenticada,
      dentro del layout de cliente).
- [ ] Gate: si `GET /professionals/me` ya devuelve un perfil, redirigir a `/pro` en vez de mostrar
      el formulario (mismo criterio que `ProfessionalGate`).
- [ ] Mensaje de éxito: perfil creado en estado `PENDING`, explicar que un admin debe aprobarlo
      antes de poder operar como profesional (evitar que el usuario piense que ya puede recibir
      solicitudes).
- [ ] Tests (Vitest + Testing Library) + handler MSW nuevo (`POST /professionals`).
- [ ] `pnpm lint`, `pnpm check:types`, `pnpm test` en 0 errores/warnings.

## Fase 2 — Subida de documentos de compliance (propia)

- [ ] Extender `src/features/professional-documents/` (hoy solo tiene la vista de staff) con un
      componente de subida para el propio profesional: `components/my-documents-upload.tsx` —
      lista los `ProfessionalDocumentTypes` requeridos/opcionales para su categoría
      (`GET /professional-document-types` filtrado), permite subir un archivo por tipo
      (`POST /professionals/me/documents`), muestra estado (`PENDING`/`APPROVED`/`REJECTED`) y el
      motivo de rechazo si aplica.
- [ ] Página nueva, ej. `src/app/pro/mis-documentos/page.tsx` (dentro del layout `/pro`, ya
      protegido por `ProfessionalGate`).
- [ ] Link desde `/pro` (dashboard profesional) a esta pantalla.
- [ ] Tests + MSW handlers nuevos.

## Fase 3 — CTA "¿Querés trabajar con nosotros?" en el home de cliente

- [ ] `src/app/(client)/page.tsx` — card/banner visible solo si `GET /professionals/me` da 404
      (mismo gate que `ProModeLink`, invertido), con copy real ("¿Querés trabajar con nosotros?
      Postulate como profesional") y link a `/postularme-como-profesional` (Fase 1).
- [ ] Mismo patrón visual que el link "¿No tenés cuenta? Registrate" del login — texto + link,
      nada intrusivo, no un modal ni un banner que tape contenido.
- [ ] Claves i18n nuevas (es/en).
- [ ] Test: el banner no aparece si el usuario ya es profesional.

## Fase 5 — Galería de portafolio (depende de Backend Fase 4)

**No arrancar hasta que `TekoApp-Backend/openspec/changes/0012-professional-onboarding-and-
portfolio.md` Fase 4 esté implementada y el contrato de
`GET/POST/PATCH/DELETE /professionals/me/portfolio` esté confirmado.**

- [ ] `src/features/professional-portfolio/` — `api.ts`/`hooks.ts`/`schemas.ts`.
- [ ] `components/portfolio-upload-form.tsx` — subir foto + caption opcional, dentro de
      `/pro/perfil` (o una pestaña nueva si esa página ya está cargada — evaluar al implementar).
- [ ] `components/portfolio-gallery.tsx` — grilla reordenable (drag simple o botones subir/bajar,
      lo que sea menos trabajo), toggle de visibilidad, borrar.
- [ ] Mostrar el portafolio visible en cualquier vista pública del profesional que ya exista
      (confirmar contra el código real, antes de asumir, si `(client)/profesionales/[referenceId]`
      ya muestra un perfil con ese contenido).
- [ ] Tests + MSW handlers + story de Storybook para `PortfolioGallery` (componente de UI nuevo).

## Checkpoint de salida (Web)

- [ ] "Cambiar de modo" nunca aparece huérfano para un usuario de un solo modo.
- [ ] Un cliente se postula como profesional desde el portal sin ayuda de nadie.
- [ ] Un profesional pendiente sube sus documentos de compliance desde el portal.
- [ ] El home de cliente muestra el CTA de reclutamiento solo a quien no es profesional todavía.
- [ ] Un profesional arma su portafolio y se ve en su perfil público (tras Backend Fase 4).
