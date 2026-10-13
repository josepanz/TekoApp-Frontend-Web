# CP-A11Y — Accesibilidad con axe (Web contra backend real)

Cada página visitada por los specs reales se escanea con `scanA11y` (`e2e/real/support.ts`). Las violaciones serious/critical se documentan como `DEF-WEB-NNN` y no hacen fallar el run (anotaciones `a11y`/`a11y-scan` del test, tabla en el informe). Formato según `C:\workspace\QA-DOC-STANDARD.md` §2.

### CP-WEB-A11Y-001 — Sin violaciones axe serious/critical en /admin/categories

| Campo              | Contenido                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-A11Y-001                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Título             | Sin violaciones axe serious/critical en /admin/categories                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Tipo / Nivel       | a11y (e2e backend real)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Prioridad          | P2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Trazabilidad       | plan maestro §2 (a11y con `@axe-core/playwright`), W5 criterio; CP-WEB-CAT-101 / 103                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Precondiciones     | Stack e2e del Backend arriba y Next standalone (`playwright.real.config.ts`); `@axe-core/playwright` con todas las reglas por defecto, se reportan solo impacto serious/critical.                                                                                                                                                                                                                                                                                                                                                                                                               |
| Pasos              | 1. Iniciar sesión como admin (tabla de categorías, con 3 a 25+ filas).<br>2. Navegar a `/admin/categories` y esperar a que se asiente.<br>3. Ejecutar `scanA11y(page, label)`.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Datos de prueba    | label `admin-categories*`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Resultado esperado | 0 violaciones serious/critical. DEF-WEB-003 → **Corregido** (801ac26): el badge "Visible" y el botón destructivo (Eliminar) usan los tokens `success-text` y `destructive-text` (AA ≥ 4.5:1 en claro y oscuro). Al fijar el tema de verdad (`setTheme`, localStorage; el default de la app es oscuro aunque el SO sea claro) apareció además el contraste de los tabs inactivos: `muted-foreground` oscuro pasó a `neutral.350` y el trigger de Tabs usa `text-muted-foreground` en claro. Las violaciones NO fallan el run: quedan como anotación `a11y` del test y en el informe (sección 2). |
| Automatizado en    | `e2e/real/m2-catalogos.spec.ts` — `scanA11y` dentro de CP-WEB-CAT-101 / 103                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

### CP-WEB-A11Y-002 — Sin violaciones axe serious/critical en /login

| Campo              | Contenido                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-A11Y-002                                                                                                                                                                   |
| Título             | Sin violaciones axe serious/critical en /login                                                                                                                                    |
| Tipo / Nivel       | a11y (e2e backend real)                                                                                                                                                           |
| Prioridad          | P2                                                                                                                                                                                |
| Trazabilidad       | plan maestro §2 (a11y con `@axe-core/playwright`), W5 criterio; CP-WEB-AUTH-101                                                                                                   |
| Precondiciones     | Stack e2e del Backend arriba y Next standalone (`playwright.real.config.ts`); `@axe-core/playwright` con todas las reglas por defecto, se reportan solo impacto serious/critical. |
| Pasos              | 1. Iniciar sesión como anónimo.<br>2. Navegar a `/login` y esperar a que se asiente.<br>3. Ejecutar `scanA11y(page, label)`.                                                      |
| Datos de prueba    | label `login`                                                                                                                                                                     |
| Resultado esperado | 0 violaciones serious/critical. Las violaciones NO fallan el run: quedan como anotación `a11y` del test y en el informe (sección 2).                                              |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `scanA11y` dentro de CP-WEB-AUTH-101                                                                                                                 |

### CP-WEB-A11Y-003 — Sin violaciones axe serious/critical en /register

| Campo              | Contenido                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-A11Y-003                                                                                                                                                                   |
| Título             | Sin violaciones axe serious/critical en /register                                                                                                                                 |
| Tipo / Nivel       | a11y (e2e backend real)                                                                                                                                                           |
| Prioridad          | P2                                                                                                                                                                                |
| Trazabilidad       | plan maestro §2 (a11y con `@axe-core/playwright`), W5 criterio; CP-WEB-AUTH-106                                                                                                   |
| Precondiciones     | Stack e2e del Backend arriba y Next standalone (`playwright.real.config.ts`); `@axe-core/playwright` con todas las reglas por defecto, se reportan solo impacto serious/critical. |
| Pasos              | 1. Iniciar sesión como anónimo.<br>2. Navegar a `/register` y esperar a que se asiente.<br>3. Ejecutar `scanA11y(page, label)`.                                                   |
| Datos de prueba    | label `register`                                                                                                                                                                  |
| Resultado esperado | 0 violaciones serious/critical. Las violaciones NO fallan el run: quedan como anotación `a11y` del test y en el informe (sección 2).                                              |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `scanA11y` dentro de CP-WEB-AUTH-106                                                                                                                 |

### CP-WEB-A11Y-004 — Sin violaciones axe serious/critical en / (home modo cliente, vista admin)

| Campo              | Contenido                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-A11Y-004                                                                                                                                                                   |
| Título             | Sin violaciones axe serious/critical en / (home modo cliente, vista admin)                                                                                                        |
| Tipo / Nivel       | a11y (e2e backend real)                                                                                                                                                           |
| Prioridad          | P2                                                                                                                                                                                |
| Trazabilidad       | plan maestro §2 (a11y con `@axe-core/playwright`), W5 criterio; CP-WEB-AUTH-101                                                                                                   |
| Precondiciones     | Stack e2e del Backend arriba y Next standalone (`playwright.real.config.ts`); `@axe-core/playwright` con todas las reglas por defecto, se reportan solo impacto serious/critical. |
| Pasos              | 1. Iniciar sesión como admin.<br>2. Navegar a `/ (home modo cliente, vista admin)` y esperar a que se asiente.<br>3. Ejecutar `scanA11y(page, label)`.                            |
| Datos de prueba    | label `home-admin`                                                                                                                                                                |
| Resultado esperado | 0 violaciones serious/critical. Las violaciones NO fallan el run: quedan como anotación `a11y` del test y en el informe (sección 2).                                              |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `scanA11y` dentro de CP-WEB-AUTH-101                                                                                                                 |

### CP-WEB-A11Y-005 — Sin violaciones axe serious/critical en /admin (dashboard)

| Campo              | Contenido                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-A11Y-005                                                                                                                                                                   |
| Título             | Sin violaciones axe serious/critical en /admin (dashboard)                                                                                                                        |
| Tipo / Nivel       | a11y (e2e backend real)                                                                                                                                                           |
| Prioridad          | P2                                                                                                                                                                                |
| Trazabilidad       | plan maestro §2 (a11y con `@axe-core/playwright`), W5 criterio; CP-WEB-AUTH-101                                                                                                   |
| Precondiciones     | Stack e2e del Backend arriba y Next standalone (`playwright.real.config.ts`); `@axe-core/playwright` con todas las reglas por defecto, se reportan solo impacto serious/critical. |
| Pasos              | 1. Iniciar sesión como admin.<br>2. Navegar a `/admin (dashboard)` y esperar a que se asiente.<br>3. Ejecutar `scanA11y(page, label)`.                                            |
| Datos de prueba    | label `admin-dashboard`                                                                                                                                                           |
| Resultado esperado | 0 violaciones serious/critical. Las violaciones NO fallan el run: quedan como anotación `a11y` del test y en el informe (sección 2).                                              |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `scanA11y` dentro de CP-WEB-AUTH-101                                                                                                                 |

### CP-WEB-A11Y-006 — Sin violaciones axe serious/critical en /pro/solicitudes (entrada del modo profesional)

| Campo              | Contenido                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-A11Y-006                                                                                                                                                                   |
| Título             | Sin violaciones axe serious/critical en /pro/solicitudes (entrada del modo profesional)                                                                                           |
| Tipo / Nivel       | a11y (e2e backend real)                                                                                                                                                           |
| Prioridad          | P2                                                                                                                                                                                |
| Trazabilidad       | plan maestro §2 (a11y con `@axe-core/playwright`), W5 criterio; CP-WEB-AUTH-103                                                                                                   |
| Precondiciones     | Stack e2e del Backend arriba y Next standalone (`playwright.real.config.ts`); `@axe-core/playwright` con todas las reglas por defecto, se reportan solo impacto serious/critical. |
| Pasos              | 1. Iniciar sesión como pro_aprobado.<br>2. Navegar a `/pro/solicitudes (entrada del modo profesional)` y esperar a que se asiente.<br>3. Ejecutar `scanA11y(page, label)`.        |
| Datos de prueba    | label `pro-home`                                                                                                                                                                  |
| Resultado esperado | 0 violaciones serious/critical. Las violaciones NO fallan el run: quedan como anotación `a11y` del test y en el informe (sección 2).                                              |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `scanA11y` dentro de CP-WEB-AUTH-103                                                                                                                 |

### CP-WEB-A11Y-007 — Sin violaciones axe serious/critical en /admin (pantalla de sin acceso)

| Campo              | Contenido                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-A11Y-007                                                                                                                                                                   |
| Título             | Sin violaciones axe serious/critical en /admin (pantalla de sin acceso)                                                                                                           |
| Tipo / Nivel       | a11y (e2e backend real)                                                                                                                                                           |
| Prioridad          | P2                                                                                                                                                                                |
| Trazabilidad       | plan maestro §2 (a11y con `@axe-core/playwright`), W5 criterio; CP-WEB-AUTH-108                                                                                                   |
| Precondiciones     | Stack e2e del Backend arriba y Next standalone (`playwright.real.config.ts`); `@axe-core/playwright` con todas las reglas por defecto, se reportan solo impacto serious/critical. |
| Pasos              | 1. Iniciar sesión como cliente_a.<br>2. Navegar a `/admin (pantalla de sin acceso)` y esperar a que se asiente.<br>3. Ejecutar `scanA11y(page, label)`.                           |
| Datos de prueba    | label `sin-acceso`                                                                                                                                                                |
| Resultado esperado | 0 violaciones serious/critical. Las violaciones NO fallan el run: quedan como anotación `a11y` del test y en el informe (sección 2).                                              |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `scanA11y` dentro de CP-WEB-AUTH-108                                                                                                                 |

### CP-WEB-A11Y-008 — Sin violaciones axe serious/critical en /admin/legal/consent-audit

| Campo              | Contenido                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-A11Y-008                                                                                                                                                                                   |
| Título             | Sin violaciones axe serious/critical en /admin/legal/consent-audit                                                                                                                                |
| Tipo / Nivel       | a11y (e2e backend real)                                                                                                                                                                           |
| Prioridad          | P2                                                                                                                                                                                                |
| Trazabilidad       | plan maestro §2 (a11y con `@axe-core/playwright`), W5 criterio; CP-WEB-AUTH-109                                                                                                                   |
| Precondiciones     | Stack e2e del Backend arriba y Next standalone (`playwright.real.config.ts`); `@axe-core/playwright` con todas las reglas por defecto, se reportan solo impacto serious/critical.                 |
| Pasos              | 1. Iniciar sesión como compliance (aterriza en Legal).<br>2. Navegar a `/admin/legal/consent-audit` y esperar a que se asiente.<br>3. Ejecutar `scanA11y(page, label)`.                           |
| Datos de prueba    | label `compliance/admin/legal/consent-audit`                                                                                                                                                      |
| Resultado esperado | 0 violaciones serious/critical con la página legal cargada (DEF-WEB-001 corregido, 3d32892). Las violaciones NO fallan el run: quedan como anotación `a11y` del test y en el informe (sección 2). |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `scanA11y` dentro de CP-WEB-AUTH-109                                                                                                                                 |

### CP-WEB-A11Y-009 — /admin/categories sin violaciones axe serious/critical en claro y oscuro

| Campo              | Contenido                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| ID                 | CP-WEB-A11Y-009                                                                                                                            |
| Título             | /admin/categories sin violaciones axe serious/critical en claro y oscuro                                                                   |
| Tipo / Nivel       | a11y (e2e backend real)                                                                                                                    |
| Prioridad          | P2                                                                                                                                         |
| Trazabilidad       | DEF-WEB-003 → Corregido (801ac26)                                                                                                          |
| Precondiciones     | Backend real arriba; 25+ categorías (badges Visible y botones Eliminar renderizados).                                                      |
| Pasos              | 1. Iniciar sesión como admin.<br>2. Fijar el tema claro (`setTheme`) y abrir `/admin/categories`; escanear.<br>3. Repetir con tema oscuro. |
| Datos de prueba    | admin                                                                                                                                      |
| Resultado esperado | `scanA11y` devuelve 0 en ambos esquemas (assert duro, no solo anotación).                                                                  |
| Automatizado en    | `e2e/real/m2-catalogos.spec.ts` — `CP-WEB-A11Y-009 ...`                                                                                    |

### CP-WEB-A11Y-010 — /admin/legal/consent-audit sin violaciones axe serious/critical en claro y oscuro

| Campo              | Contenido                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-A11Y-010                                                                                                                     |
| Título             | /admin/legal/consent-audit sin violaciones axe serious/critical en claro y oscuro                                                   |
| Tipo / Nivel       | a11y (e2e backend real)                                                                                                             |
| Prioridad          | P2                                                                                                                                  |
| Trazabilidad       | DEF-WEB-001 (3d32892); hallazgo nuevo corregido en 801ac26 (tabs inactivos, color-contrast 4.45:1 en oscuro)                        |
| Precondiciones     | Backend real arriba; fixture compliance.                                                                                            |
| Pasos              | 1. Iniciar sesión como compliance.<br>2. Fijar tema claro y abrir `/admin/legal/consent-audit`; escanear.<br>3. Repetir con oscuro. |
| Datos de prueba    | compliance                                                                                                                          |
| Resultado esperado | `scanA11y` devuelve 0 en ambos temas (assert duro).                                                                                 |
| Automatizado en    | `e2e/real/m1-auth.spec.ts` — `CP-WEB-A11Y-010 ...`                                                                                  |

## Estado de defectos

| Defecto                   | Estado              |
| ------------------------- | ------------------- |
| DEF-WEB-003 (media, a11y) | Corregido (801ac26) |
