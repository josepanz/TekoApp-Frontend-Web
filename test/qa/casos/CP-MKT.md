# CP-MKT — Marketplace de servicios (M4)

Oleada W2. Flujo cruzado cliente ↔ profesional (un `browser.newContext()` por rol), IDOR y contrato de transiciones/permisos de servicios y ofertas, contra el backend real de e2e (rama `test/e2e-w2-onboarding-marketplace`). Formato según `C:\workspace\QA-DOC-STANDARD.md` §2; los archivos de test llevan el encabezado de §4.

La Web actual no tiene flujo de ofertas ni pantalla de detalle de servicio del cliente: el profesional acepta directo desde `/pro/solicitudes` y el cliente ve el cambio en `/mis-servicios`. Las ofertas y los permisos por id se cubren por el BFF (`2xx`).

| ID             | Título                                                                                         | Tipo                      | Prio |
| -------------- | ---------------------------------------------------------------------------------------------- | ------------------------- | ---- |
| CP-WEB-MKT-001 | La tabla de solicitudes explica que el perfil no está aprobado cuando el backend responde 403  | unitaria (componente)     | P1   |
| CP-WEB-MKT-101 | Solicitar → aceptar → iniciar → completar, visto por ambos roles                               | e2e (backend real) + a11y | P1   |
| CP-WEB-MKT-102 | El cliente cancela un servicio pendiente y el profesional ya no lo ve                          | e2e (backend real)        | P1   |
| CP-WEB-MKT-103 | Conflicto: completar dos veces desde dos pestañas muestra el 409 explicado, sin crash          | e2e (backend real) + a11y | P1   |
| CP-WEB-MKT-104 | IDOR por UI: otro cliente no ve ni accede al servicio ajeno                                    | e2e (backend real) + a11y | P0   |
| CP-WEB-MKT-105 | pro_pendiente no puede ver ni aceptar solicitudes: mensaje claro y el resto de /pro operativo  | e2e (backend real) + a11y | P1   |
| CP-WEB-MKT-201 | Una transición inválida (aceptar/iniciar/completar repetidos) responde 409                     | e2e (API vía BFF)         | P1   |
| CP-WEB-MKT-202 | Dos aceptaciones concurrentes: solo una gana (409 la otra)                                     | e2e (API vía BFF)         | P0   |
| CP-WEB-MKT-203 | Ofertas: doble postulación 409, pro pendiente 403, solo el dueño las ve y responde             | e2e (API vía BFF)         | P1   |
| CP-WEB-MKT-204 | GET /services/:id solo para dueño, asignado o admin; el listado solo para admin o pro aprobado | e2e (API vía BFF)         | P0   |
| CP-WEB-MKT-205 | Aceptar con un pro pendiente o un cliente responde 403                                         | e2e (API vía BFF)         | P1   |
| CP-WEB-MKT-206 | Cancelar con motivo vacío responde 400 y cancelar dos veces responde 409                       | e2e (API vía BFF)         | P1   |
| CP-WEB-MKT-207 | Otro cliente no puede cancelar ni editar el servicio ajeno                                     | e2e (API vía BFF)         | P0   |
| CP-WEB-MKT-208 | Rechazar una oferta con motivo vacío responde 400 (DEF-BE-027)                                 | e2e (API vía BFF)         | P2   |

### CP-WEB-MKT-001 — La tabla de solicitudes explica que el perfil no está aprobado cuando el backend responde 403

| Campo              | Contenido                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID                 | CP-WEB-MKT-001                                                                                                                                                           |
| Título             | La tabla de solicitudes explica que el perfil no está aprobado cuando el backend responde 403                                                                            |
| Tipo / Nivel       | unitaria (componente)                                                                                                                                                    |
| Prioridad          | P1                                                                                                                                                                       |
| Trazabilidad       | DEF-WEB-006 (Corregido, 8f30d19)                                                                                                                                         |
| Precondiciones     | Vitest + Testing Library + MSW (`pnpm test`); sin backend real.                                                                                                          |
| Pasos              | 1. `GET /services` → 403.<br>2. Renderizar `PendingServicesTable`.                                                                                                       |
| Datos de prueba    | —                                                                                                                                                                        |
| Resultado esperado | Alerta "Tu perfil profesional todavía no está aprobado…" (no el error genérico de carga).                                                                                |
| Automatizado en    | `src/features/professional-requests/components/pending-services-table.test.tsx` — `CP-WEB-MKT-001 explica que el perfil no está aprobado cuando el backend responde 403` |

### CP-WEB-MKT-101 — Solicitar → aceptar → iniciar → completar, visto por ambos roles

| Campo              | Contenido                                                                                                                                                                                                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-101                                                                                                                                                                                                                                                                    |
| Título             | Solicitar → aceptar → iniciar → completar, visto por ambos roles                                                                                                                                                                                                                  |
| Tipo / Nivel       | e2e (backend real) + a11y                                                                                                                                                                                                                                                         |
| Prioridad          | P1                                                                                                                                                                                                                                                                                |
| Trazabilidad       | plan maestro M4; contrato W2 (`:id` = `referenceId`)                                                                                                                                                                                                                              |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`. `cliente_a` y `pro_aprobado` (Plomería, APPROVED); dos `browser.newContext()`. |
| Pasos              | 1. `cliente_a` solicita en `/solicitar` (categoría Plomería).<br>2. `pro_aprobado` lo ve en `/pro/solicitudes` y pulsa "Aceptar".<br>3. `cliente_a` recarga `/mis-servicios`.<br>4. El pro inicia y completa en `/pro/servicios`.<br>5. El cliente recarga.                       |
| Datos de prueba    | título `E2E MKT <runId> flujo`                                                                                                                                                                                                                                                    |
| Resultado esperado | Pendiente / Sin asignar → desaparece de solicitudes ("Servicio aceptado") → cliente ve Aceptado con "Pro Aprobado" → "Servicio iniciado" / En curso → "Servicio completado" / Completado → el cliente ve Completado y el botón "Calificar profesional" (sin calificar: W4).       |
| Automatizado en    | `e2e/real/marketplace.spec.ts` — `CP-WEB-MKT-101 solicitar -> aceptar -> iniciar -> completar, visto por ambos roles`                                                                                                                                                             |

### CP-WEB-MKT-102 — El cliente cancela un servicio pendiente y el profesional ya no lo ve

| Campo              | Contenido                                                                                                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-102                                                                                                                                                                                                   |
| Título             | El cliente cancela un servicio pendiente y el profesional ya no lo ve                                                                                                                                            |
| Tipo / Nivel       | e2e (backend real)                                                                                                                                                                                               |
| Prioridad          | P1                                                                                                                                                                                                               |
| Trazabilidad       | plan maestro M4 (cancelación)                                                                                                                                                                                    |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`.               |
| Pasos              | 1. `cliente_a` solicita un servicio; el pro lo ve en solicitudes.<br>2. El cliente pulsa "Cancelar" (confirmar deshabilitado sin motivo), escribe el motivo y confirma.<br>3. El pro recarga `/pro/solicitudes`. |
| Datos de prueba    | título `E2E MKT <runId> cancelar`, motivo "Ya no lo necesito (e2e)"                                                                                                                                              |
| Resultado esperado | "Servicio cancelado", estado Cancelado, y el servicio desaparece de las solicitudes del pro.                                                                                                                     |
| Automatizado en    | `e2e/real/marketplace.spec.ts` — `CP-WEB-MKT-102 el cliente cancela un servicio pendiente y el profesional ya no lo ve`                                                                                          |

### CP-WEB-MKT-103 — Conflicto: completar dos veces desde dos pestañas muestra el 409 explicado, sin crash

| Campo              | Contenido                                                                                                                                                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-103                                                                                                                                                                                                                   |
| Título             | Conflicto: completar dos veces desde dos pestañas muestra el 409 explicado, sin crash                                                                                                                                            |
| Tipo / Nivel       | e2e (backend real) + a11y                                                                                                                                                                                                        |
| Prioridad          | P1                                                                                                                                                                                                                               |
| Trazabilidad       | plan maestro M4 ("transición inválida → 409"); contrato W2 (409)                                                                                                                                                                 |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`.                               |
| Pasos              | 1. Servicio aceptado e iniciado por el pro.<br>2. Abrir una segunda pestaña (misma sesión) en `/pro/servicios` con el servicio "En curso".<br>3. En la pestaña 1: "Completar".<br>4. En la pestaña 2 (vista vieja): "Completar". |
| Datos de prueba    | título `E2E MKT <runId> conflicto`                                                                                                                                                                                               |
| Resultado esperado | La pestaña 2 muestra un toast de error con el mensaje del backend (no "Error 409" ni el genérico), la tabla sigue visible y se refetchea. El mensaje queda en la anotación `mensaje-409` del informe.                            |
| Automatizado en    | `e2e/real/marketplace.spec.ts` — `CP-WEB-MKT-103 conflicto: completar dos veces desde dos pestanas muestra el 409 explicado, sin crash`                                                                                          |

### CP-WEB-MKT-104 — IDOR por UI: otro cliente no ve ni accede al servicio ajeno

| Campo              | Contenido                                                                                                                                                                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-104                                                                                                                                                                                                                                                                                            |
| Título             | IDOR por UI: otro cliente no ve ni accede al servicio ajeno                                                                                                                                                                                                                                               |
| Tipo / Nivel       | e2e (backend real) + a11y                                                                                                                                                                                                                                                                                 |
| Prioridad          | P0                                                                                                                                                                                                                                                                                                        |
| Trazabilidad       | plan maestro M4 / matriz de error 403; contrato W2 (`GET /services/:id` y `/requests` → 403 si no es dueño, asignado o admin)                                                                                                                                                                             |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`. La Web no tiene pantalla de detalle de servicio del cliente: se verifica listado, BFF y la ruta admin. |
| Pasos              | 1. `cliente_a` crea un servicio.<br>2. `cliente_b` abre `/mis-servicios`.<br>3. `cliente_b` hace `GET /services/<ref>`, `/services/<ref>/requests` y `DELETE` por el BFF.<br>4. `cliente_b` abre `/admin/services/<ref>`.                                                                                 |
| Datos de prueba    | título `E2E MKT <runId> idor`                                                                                                                                                                                                                                                                             |
| Resultado esperado | El servicio no está en la lista de `cliente_b`; GET → 403 sin título ni dirección en el cuerpo; DELETE → 403/404; `/admin/services/<ref>` muestra la pantalla de sin acceso y ningún dato.                                                                                                                |
| Automatizado en    | `e2e/real/marketplace.spec.ts` — `CP-WEB-MKT-104 IDOR por UI: otro cliente no ve ni accede al servicio ajeno`                                                                                                                                                                                             |

### CP-WEB-MKT-105 — pro_pendiente no puede ver ni aceptar solicitudes: mensaje claro y el resto de /pro operativo

| Campo              | Contenido                                                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-105                                                                                                                                                                                                      |
| Título             | pro_pendiente no puede ver ni aceptar solicitudes: mensaje claro y el resto de /pro operativo                                                                                                                       |
| Tipo / Nivel       | e2e (backend real) + a11y                                                                                                                                                                                           |
| Prioridad          | P1                                                                                                                                                                                                                  |
| Trazabilidad       | contrato W2 ("aceptar u ofertar exige un pro APPROVED → 403"); DEF-WEB-005 y DEF-WEB-006 (Corregidos)                                                                                                               |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`.                  |
| Pasos              | 1. `cliente_a` crea un servicio.<br>2. `pro_pendiente` abre `/pro/solicitudes`, `/pro/servicios`, `/pro/perfil`, `/pro/mis-documentos` y `/pro/portafolio`.<br>3. Intenta `POST /services/<ref>/accept` por el BFF. |
| Datos de prueba    | título `E2E MKT <runId> pendiente`                                                                                                                                                                                  |
| Resultado esperado | En todas las páginas hay banner de "pendiente de aprobación" y ninguna cae en "sin acceso"; solicitudes explica que no puede ver ni aceptar y no hay botones "Aceptar"; el accept por API responde 403.             |
| Automatizado en    | `e2e/real/marketplace.spec.ts` — `CP-WEB-MKT-105 pro_pendiente no puede ver ni aceptar solicitudes: mensaje claro`                                                                                                  |

### CP-WEB-MKT-201 — Una transición inválida (aceptar/iniciar/completar repetidos) responde 409

| Campo              | Contenido                                                                                                                                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-201                                                                                                                                                                                                                                       |
| Título             | Una transición inválida (aceptar/iniciar/completar repetidos) responde 409                                                                                                                                                                           |
| Tipo / Nivel       | e2e (API vía BFF)                                                                                                                                                                                                                                    |
| Prioridad          | P1                                                                                                                                                                                                                                                   |
| Trazabilidad       | contrato W2 "transiciones inválidas de servicios → 409 (antes 400)"                                                                                                                                                                                  |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`.                                                   |
| Pasos              | 1. `cliente_a` crea un servicio.<br>2. El pro ajeno intenta completar un PENDING.<br>3. Aceptar, aceptar de nuevo, completar sin iniciar, iniciar, iniciar de nuevo, completar y completar de nuevo.<br>4. El cliente intenta cancelar el COMPLETED. |
| Datos de prueba    | —                                                                                                                                                                                                                                                    |
| Resultado esperado | Pro no asignado sobre PENDING: 403. Aceptar 201 y repetido 409; completar un ACCEPTED 409; iniciar 201 y repetido 409; completar 201 y repetido 409; cancelar un COMPLETED 409.                                                                      |
| Automatizado en    | `e2e/real/backend-contrato-w2.spec.ts` — `CP-WEB-MKT-201 una transicion invalida (aceptar/iniciar/completar repetidos) responde 409`                                                                                                                 |

### CP-WEB-MKT-202 — Dos aceptaciones concurrentes: solo una gana (409 la otra)

| Campo              | Contenido                                                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-202                                                                                                                                                                                     |
| Título             | Dos aceptaciones concurrentes: solo una gana (409 la otra)                                                                                                                                         |
| Tipo / Nivel       | e2e (API vía BFF)                                                                                                                                                                                  |
| Prioridad          | P0                                                                                                                                                                                                 |
| Trazabilidad       | plan maestro M4 ("dos aceptaciones concurrentes → solo una gana (409)")                                                                                                                            |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Crear un servicio.<br>2. Lanzar dos `POST /services/<ref>/accept` en paralelo del mismo pro.                                                                                                    |
| Datos de prueba    | —                                                                                                                                                                                                  |
| Resultado esperado | Los estados son exactamente [201, 409].                                                                                                                                                            |
| Automatizado en    | `e2e/real/backend-contrato-w2.spec.ts` — `CP-WEB-MKT-202 dos aceptaciones concurrentes: solo una gana (409 la otra)`                                                                               |

### CP-WEB-MKT-203 — Ofertas: doble postulación 409, pro pendiente 403, solo el dueño las ve y responde

| Campo              | Contenido                                                                                                                                                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-203                                                                                                                                                                                                                                                               |
| Título             | Ofertas: doble postulación 409, pro pendiente 403, solo el dueño las ve y responde                                                                                                                                                                                           |
| Tipo / Nivel       | e2e (API vía BFF)                                                                                                                                                                                                                                                            |
| Prioridad          | P1                                                                                                                                                                                                                                                                           |
| Trazabilidad       | contrato W2 ("doble postulación → 409", "ofertar exige pro APPROVED", `:requestId` = `ServiceRequests.referenceId`, "GET /services/:id/requests → 403 si no es dueño o admin")                                                                                               |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`. La Web aún no tiene pantalla de ofertas: se cubre el contrato por el BFF. |
| Pasos              | 1. `pro_aprobado` ofrece sobre un servicio PENDING (201) y repite (409).<br>2. `pro_pendiente` ofrece.<br>3. `cliente_a` lee las ofertas; `cliente_b` las lee y las responde.<br>4. `cliente_a` acepta la oferta y la responde otra vez.                                     |
| Datos de prueba    | oferta `{proposedPrice:120000, message}`                                                                                                                                                                                                                                     |
| Resultado esperado | Doble postulación 409; pro pendiente 403; dueño lee 200; `cliente_b` 403 al leer y al responder; el dueño acepta 200 y responder de nuevo 409.                                                                                                                               |
| Automatizado en    | `e2e/real/backend-contrato-w2.spec.ts` — `CP-WEB-MKT-203 ofertas: doble postulacion 409, pro pendiente 403, solo el dueno las ve y responde`                                                                                                                                 |

### CP-WEB-MKT-204 — GET /services/:id solo para dueño, asignado o admin; el listado solo para admin o pro aprobado

| Campo              | Contenido                                                                                                                                                                                                                                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-204                                                                                                                                                                                                                                                       |
| Título             | GET /services/:id solo para dueño, asignado o admin; el listado solo para admin o pro aprobado                                                                                                                                                                       |
| Tipo / Nivel       | e2e (API vía BFF)                                                                                                                                                                                                                                                    |
| Prioridad          | P0                                                                                                                                                                                                                                                                   |
| Trazabilidad       | contrato W2 (403 en `GET /services/:id`; `GET /services` y `/services/nearby` solo admin o pro aprobado)                                                                                                                                                             |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`.                                                                   |
| Pasos              | 1. Crear un servicio como `cliente_a`.<br>2. `GET /services/<ref>` como dueño, admin, `cliente_b`, `pro_aprobado` (PENDING) y `pro_pendiente`.<br>3. El pro acepta y vuelve a leerlo.<br>4. `GET /services` y `/services/nearby` como cliente, pro aprobado y admin. |
| Datos de prueba    | —                                                                                                                                                                                                                                                                    |
| Resultado esperado | Dueño y admin 200; `cliente_b` 403; pro aprobado 200 mientras está PENDING (intencional: necesita verlo para ofertar) y como asignado; `pro_pendiente` 403; listado y nearby: cliente 403, pro aprobado y admin 200.                                                 |
| Automatizado en    | `e2e/real/backend-contrato-w2.spec.ts` — `CP-WEB-MKT-204 GET /services/:id solo para dueno, asignado o admin; el listado solo para admin o pro aprobado`                                                                                                             |

### CP-WEB-MKT-205 — Aceptar con un pro pendiente o un cliente responde 403

| Campo              | Contenido                                                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-205                                                                                                                                                                                     |
| Título             | Aceptar con un pro pendiente o un cliente responde 403                                                                                                                                             |
| Tipo / Nivel       | e2e (API vía BFF)                                                                                                                                                                                  |
| Prioridad          | P1                                                                                                                                                                                                 |
| Trazabilidad       | contrato W2 ("aceptar u ofertar exige un pro APPROVED y activo")                                                                                                                                   |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Crear un servicio.<br>2. `pro_pendiente` y `cliente_b` hacen `POST /services/<ref>/accept`.<br>3. `pro_pendiente` pide `GET /services?status=PENDING`.                                          |
| Datos de prueba    | —                                                                                                                                                                                                  |
| Resultado esperado | 403 en las tres.                                                                                                                                                                                   |
| Automatizado en    | `e2e/real/backend-contrato-w2.spec.ts` — `CP-WEB-MKT-205 aceptar con un pro pendiente o un cliente responde 403`                                                                                   |

### CP-WEB-MKT-206 — Cancelar con motivo vacío responde 400 y cancelar dos veces responde 409

| Campo              | Contenido                                                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-206                                                                                                                                                                                     |
| Título             | Cancelar con motivo vacío responde 400 y cancelar dos veces responde 409                                                                                                                           |
| Tipo / Nivel       | e2e (API vía BFF)                                                                                                                                                                                  |
| Prioridad          | P1                                                                                                                                                                                                 |
| Trazabilidad       | contrato W2 ("motivo vacío → 400", "transición inválida → 409")                                                                                                                                    |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Crear un servicio.<br>2. `DELETE /services/<ref>` con `reason:""`.<br>3. Cancelar con motivo y volver a cancelar.                                                                               |
| Datos de prueba    | —                                                                                                                                                                                                  |
| Resultado esperado | 400; luego 200; luego 409.                                                                                                                                                                         |
| Automatizado en    | `e2e/real/backend-contrato-w2.spec.ts` — `CP-WEB-MKT-206 cancelar con motivo vacio responde 400 y la transicion CANCELLED -> CANCELLED responde 409`                                               |

### CP-WEB-MKT-207 — Otro cliente no puede cancelar ni editar el servicio ajeno

| Campo              | Contenido                                                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-207                                                                                                                                                                                     |
| Título             | Otro cliente no puede cancelar ni editar el servicio ajeno                                                                                                                                         |
| Tipo / Nivel       | e2e (API vía BFF)                                                                                                                                                                                  |
| Prioridad          | P0                                                                                                                                                                                                 |
| Trazabilidad       | plan maestro M4 / IDOR                                                                                                                                                                             |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. `cliente_a` crea un servicio.<br>2. `cliente_b`: `DELETE` y `PUT /services/<ref>`.                                                                                                              |
| Datos de prueba    | —                                                                                                                                                                                                  |
| Resultado esperado | 403 en ambos.                                                                                                                                                                                      |
| Automatizado en    | `e2e/real/backend-contrato-w2.spec.ts` — `CP-WEB-MKT-207 otro cliente no puede cancelar ni editar el servicio ajeno`                                                                               |

### CP-WEB-MKT-208 — Rechazar una oferta con motivo vacío responde 400 (DEF-BE-027)

| Campo              | Contenido                                                                                                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-MKT-208                                                                                                                                                                                                                                     |
| Título             | Rechazar una oferta con motivo vacío responde 400 (DEF-BE-027)                                                                                                                                                                                     |
| Tipo / Nivel       | e2e (API vía BFF)                                                                                                                                                                                                                                  |
| Prioridad          | P2                                                                                                                                                                                                                                                 |
| Trazabilidad       | DEF-BE-027 (abierto, backend); contrato W2 "motivo vacío de rechazo → 400"                                                                                                                                                                         |
| Precondiciones     | Stack e2e del Backend arriba y sembrado (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`, rama `test/e2e-w2-onboarding-marketplace`) y Next standalone levantado por `playwright.real.config.ts`. `test.fail()` mientras el defecto siga abierto. |
| Pasos              | 1. `pro_aprobado` ofrece sobre un servicio PENDING.<br>2. `cliente_a`: `PUT /services/<ref>/requests/<requestRef>` con `{status:"REJECTED", reason:""}`.                                                                                           |
| Datos de prueba    | —                                                                                                                                                                                                                                                  |
| Resultado esperado | Esperado: 400. Real: 200 (el DTO deja `reason` opcional y no lo persiste). Si el contrato de motivo obligatorio no aplica a ofertas, descartar.                                                                                                    |
| Automatizado en    | `e2e/real/backend-contrato-w2.spec.ts` — `CP-WEB-MKT-208 rechazar una oferta con motivo vacio responde 400 (DEF-BE-027)`                                                                                                                           |

## Defectos asociados

| Defecto                                                                                        | Estado              |
| ---------------------------------------------------------------------------------------------- | ------------------- |
| DEF-WEB-005 (media): el profesional no ve el estado de su postulación                          | Corregido (ff84793) |
| DEF-WEB-006 (alta): el 403 de solicitudes a un profesional no aprobado tumba toda el área /pro | Corregido (8f30d19) |
| DEF-BE-027 (baja): rechazar una oferta con motivo vacío responde 200                           | Abierto (backend)   |
