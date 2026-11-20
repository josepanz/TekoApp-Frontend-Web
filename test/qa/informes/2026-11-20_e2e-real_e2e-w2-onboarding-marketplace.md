# Informe de ejecución — e2e Playwright contra el backend real

| Campo          | Valor                                                                                                                                                                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha y hora   | 2026-11-20 18:04                                                                                                                                                                                                                                                                             |
| Repo           | TekoApp-Frontend-Web                                                                                                                                                                                                                                                                         |
| Rama           | test/e2e-w2-onboarding-marketplace                                                                                                                                                                                                                                                           |
| Commit         | 570e0d8 (árbol con cambios sin commitear)                                                                                                                                                                                                                                                    |
| Entorno        | local: backend REAL de e2e (TekoApp-Backend `pnpm e2e:up/e2e:seed/e2e:serve`, http://localhost:3100) + build standalone de Next en 127.0.0.1:3002 (`scripts/e2e-real/serve.mjs`), Chromium (Version 1.61.1), Node v22.16.0, win32. Claves RSA y secret leídos en el arranque, no commiteados |
| Comando exacto | `pnpm qa:e2e-real` → `pnpm exec playwright test -c playwright.real.config.ts --reporter=html,json`                                                                                                                                                                                           |
| Ejecutor       | humano                                                                                                                                                                                                                                                                                       |

## 1. Resumen

| Pasaron | Fallaron | Omitidos | Flaky | Total | Duración |
| ------- | -------- | -------- | ----- | ----- | -------- |
| 53      | 0        | 0        | 0     | 53    | 7.9 min  |

Cobertura: No aplica en e2e.

Exit code del runner: 0.

## 2. Resultados por spec y caso

| Spec                                      | CP-             | Caso                                                                                                                                                                        | Estado | Duración | Reintentos |
| ----------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------- | ---------- |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-MKT-201  | M4 contrato de servicios y ofertas (via BFF) › CP-WEB-MKT-201 una transicion invalida (aceptar/iniciar/completar repetidos) responde 409                                    | PASÓ   | 2.3 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-MKT-202  | M4 contrato de servicios y ofertas (via BFF) › CP-WEB-MKT-202 dos aceptaciones concurrentes: solo una gana (409 la otra)                                                    | PASÓ   | 0.7 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-MKT-203  | M4 contrato de servicios y ofertas (via BFF) › CP-WEB-MKT-203 ofertas: doble postulacion 409, pro pendiente 403, solo el dueno las ve y responde                            | PASÓ   | 1.5 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-MKT-208  | M4 contrato de servicios y ofertas (via BFF) › CP-WEB-MKT-208 rechazar una oferta con motivo vacio responde 200 (motivo opcional, DEF-BE-027 descartado)                    | PASÓ   | 0.3 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-MKT-204  | M4 contrato de servicios y ofertas (via BFF) › CP-WEB-MKT-204 GET /services/:id solo para dueno, asignado o admin; el listado solo para admin o pro aprobado                | PASÓ   | 0.8 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-MKT-205  | M4 contrato de servicios y ofertas (via BFF) › CP-WEB-MKT-205 aceptar con un pro pendiente o un cliente responde 403                                                        | PASÓ   | 0.5 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-MKT-206  | M4 contrato de servicios y ofertas (via BFF) › CP-WEB-MKT-206 cancelar con motivo vacio responde 400 y la transicion CANCELLED -> CANCELLED responde 409                    | PASÓ   | 0.3 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-MKT-207  | M4 contrato de servicios y ofertas (via BFF) › CP-WEB-MKT-207 otro cliente no puede cancelar ni editar el servicio ajeno                                                    | PASÓ   | 0.3 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-ONB-201  | M3 contrato de profesionales (via BFF) › CP-WEB-ONB-201 un profesional PENDING no es visible a un cliente (id, reference, listado, nearby, stats, services) pero si a admin | PASÓ   | 0.2 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-ONB-202  | M3 contrato de profesionales (via BFF) › CP-WEB-ONB-202 suspender con motivo vacio responde 400 y no cambia el estado del profesional                                       | PASÓ   | 1.4 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-ONB-204  | M3 contrato de profesionales (via BFF) › CP-WEB-ONB-204 verificar a un profesional SUSPENDED responde 409 (contrato corregido, ex DEF-BE-028)                               | PASÓ   | 1.1 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-ONB-205  | M3 contrato de profesionales (via BFF) › CP-WEB-ONB-205 suspender a un profesional ya SUSPENDED responde 409 (contrato corregido, ex DEF-BE-029)                            | PASÓ   | 1.0 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-ONB-203  | M3 contrato de profesionales (via BFF) › CP-WEB-ONB-203 rechazar un documento sin motivo responde 400 y con motivo se rechaza                                               | PASÓ   | 1.8 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-IMG-201  | M3 contrato de uploads con presigned (via BFF) › CP-WEB-IMG-201 presigned-url: 403 sin permiso, 404 sin registro, TTL <= 300 s                                              | PASÓ   | 0.3 s    | 0          |
| `e2e/real/backend-contrato-w2.spec.ts`    | CP-WEB-IMG-202  | M3 contrato de uploads con presigned (via BFF) › CP-WEB-IMG-202 un documento sensible del profesional no es legible por otro cliente                                        | PASÓ   | 0.1 s    | 0          |
| `e2e/real/imagenes-presigned.spec.ts`     | CP-WEB-IMG-101  | Imagenes y documentos por presigned › CP-WEB-IMG-101 el portafolio propio y el perfil publico cargan la imagen por presigned                                                | PASÓ   | 13.5 s   | 0          |
| `e2e/real/imagenes-presigned.spec.ts`     | CP-WEB-IMG-102  | Imagenes y documentos por presigned › CP-WEB-IMG-102 ante 403 del presigned las vistas de portafolio muestran placeholder, no imagen rota                                   | PASÓ   | 12.2 s   | 0          |
| `e2e/real/imagenes-presigned.spec.ts`     | CP-WEB-IMG-102  | Imagenes y documentos por presigned › CP-WEB-IMG-102 ante 404 del presigned las vistas de portafolio muestran placeholder, no imagen rota                                   | PASÓ   | 12.1 s   | 0          |
| `e2e/real/imagenes-presigned.spec.ts`     | CP-WEB-IMG-103  | Imagenes y documentos por presigned › CP-WEB-IMG-103 la revision del admin muestra placeholder o aviso ante 403/404 del presigned                                           | PASÓ   | 17.9 s   | 0          |
| `e2e/real/imagenes-presigned.spec.ts`     | CP-WEB-IMG-104  | Imagenes y documentos por presigned › CP-WEB-IMG-104 avatar: se sube, carga por presigned y ante imagen caida muestra las iniciales                                         | PASÓ   | 4.0 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-101 | M1 Auth › CP-WEB-AUTH-101 login OK de admin aterriza en /admin y la home del modo cliente sigue accesible                                                                   | PASÓ   | 11.5 s   | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-102 | M1 Auth › CP-WEB-AUTH-102 login OK de cliente llega a la home del modo cliente                                                                                              | PASÓ   | 1.2 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-103 | M1 Auth › CP-WEB-AUTH-103 login OK de profesional aterriza en /pro                                                                                                          | PASÓ   | 5.8 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-126 | M1 Auth › CP-WEB-AUTH-126 el from (returnTo) tiene prioridad sobre el aterrizaje por rol                                                                                    | PASÓ   | 1.2 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-127 | M1 Auth › CP-WEB-AUTH-127 compliance aterriza en su primera seccion permitida (Legal)                                                                                       | PASÓ   | 1.2 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-104 | M1 Auth › CP-WEB-AUTH-104 email inexistente muestra error generico y sigue en /login (regresion bug login:false)                                                            | PASÓ   | 0.7 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-105 | M1 Auth › CP-WEB-AUTH-105 password incorrecta muestra el mismo error y sigue en /login                                                                                      | PASÓ   | 0.8 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-106 | M1 Auth › CP-WEB-AUTH-106 registro de un usuario nuevo con email unico                                                                                                      | PASÓ   | 1.7 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-107 | M1 Auth › CP-WEB-AUTH-107 logout limpia las cookies, revoca el refresh en el backend y /admin vuelve a /login                                                               | PASÓ   | 1.9 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-108 | M1 Auth › CP-WEB-AUTH-108 cliente_a en /admin ve la pantalla de sin acceso (no crash)                                                                                       | PASÓ   | 1.7 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-109 | M1 Auth › CP-WEB-AUTH-109 compliance ve las paginas legales                                                                                                                 | PASÓ   | 15.4 s   | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-129 | M1 Auth › CP-WEB-AUTH-129 compliance ve solo Legal en el sidebar y /admin lo redirige a su primera seccion                                                                  | PASÓ   | 1.5 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-A11Y-010 | M1 Auth › CP-WEB-A11Y-010 /admin/legal/consent-audit sin violaciones axe serious/critical en claro y oscuro                                                                 | PASÓ   | 10.8 s   | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-110 | M1 Auth › CP-WEB-AUTH-110 compliance no accede a las paginas de admin ajenas                                                                                                | PASÓ   | 5.4 s    | 0          |
| `e2e/real/m1-auth.spec.ts`                | CP-WEB-AUTH-111 | M1 Auth › CP-WEB-AUTH-111 la sesion sobrevive a un reload y el JWT no es visible desde JS                                                                                   | PASÓ   | 1.4 s    | 0          |
| `e2e/real/m2-catalogos.spec.ts`           | CP-WEB-CAT-101  | M2 Categorias: admin -> vista cliente › CP-WEB-CAT-101 admin crea, edita, oculta y borra una categoria y el cliente lo ve reflejado                                         | PASÓ   | 11.9 s   | 0          |
| `e2e/real/m2-catalogos.spec.ts`           | CP-WEB-CAT-102  | M2 Categorias: admin -> vista cliente › CP-WEB-CAT-102 un 400 del backend (nombre > 100 caracteres) se muestra como error del campo Nombre                                  | PASÓ   | 1.9 s    | 0          |
| `e2e/real/m2-catalogos.spec.ts`           | CP-WEB-CAT-103  | M2 Tabla admin de categorias con muchos registros › CP-WEB-CAT-103 la tabla admin de categorias pagina (no renderiza todo de una vez)                                       | PASÓ   | 6.5 s    | 0          |
| `e2e/real/m2-catalogos.spec.ts`           | CP-WEB-A11Y-009 | M2 Tabla admin de categorias con muchos registros › CP-WEB-A11Y-009 /admin/categories sin violaciones axe serious/critical en claro y oscuro                                | PASÓ   | 11.5 s   | 0          |
| `e2e/real/marketplace.spec.ts`            | CP-WEB-MKT-101  | M4 Marketplace › CP-WEB-MKT-101 solicitar -> aceptar -> iniciar -> completar, visto por ambos roles                                                                         | PASÓ   | 36.3 s   | 0          |
| `e2e/real/marketplace.spec.ts`            | CP-WEB-MKT-102  | M4 Marketplace › CP-WEB-MKT-102 el cliente cancela un servicio pendiente y el profesional ya no lo ve                                                                       | PASÓ   | 16.2 s   | 0          |
| `e2e/real/marketplace.spec.ts`            | CP-WEB-MKT-103  | M4 Marketplace › CP-WEB-MKT-103 conflicto: completar dos veces desde dos pestanas muestra el 409 explicado, sin crash                                                       | PASÓ   | 25.6 s   | 0          |
| `e2e/real/marketplace.spec.ts`            | CP-WEB-MKT-104  | M4 Marketplace › CP-WEB-MKT-104 IDOR por UI: otro cliente no ve ni accede al servicio ajeno                                                                                 | PASÓ   | 13.4 s   | 0          |
| `e2e/real/marketplace.spec.ts`            | CP-WEB-MKT-105  | M4 Marketplace › CP-WEB-MKT-105 pro_pendiente no puede ver ni aceptar solicitudes: mensaje claro                                                                            | PASÓ   | 31.1 s   | 0          |
| `e2e/real/onboarding-profesional.spec.ts` | CP-WEB-ONB-101  | M3 Onboarding profesional › CP-WEB-ONB-101 un usuario nuevo se registra y se postula como profesional                                                                       | PASÓ   | 8.1 s    | 0          |
| `e2e/real/onboarding-profesional.spec.ts` | CP-WEB-ONB-102  | M3 Onboarding profesional › CP-WEB-ONB-102 mientras esta PENDING el nuevo pro ve su estado y no puede ver solicitudes                                                       | PASÓ   | 10.6 s   | 0          |
| `e2e/real/onboarding-profesional.spec.ts` | CP-WEB-ONB-103  | M3 Onboarding profesional › CP-WEB-ONB-103 subir un documento sin consentimiento muestra el pedido de aceptacion; al aceptar se sube                                        | PASÓ   | 8.6 s    | 0          |
| `e2e/real/onboarding-profesional.spec.ts` | CP-WEB-ONB-104  | M3 Onboarding profesional › CP-WEB-ONB-104 un cliente no ve al profesional PENDING ni en el listado ni por URL directa (404 amable)                                         | PASÓ   | 10.5 s   | 0          |
| `e2e/real/onboarding-profesional.spec.ts` | CP-WEB-ONB-105  | M3 Onboarding profesional › CP-WEB-ONB-105 el admin rechaza un documento (con motivo obligatorio) y aprueba otro                                                            | PASÓ   | 17.8 s   | 0          |
| `e2e/real/onboarding-profesional.spec.ts` | CP-WEB-ONB-106  | M3 Onboarding profesional › CP-WEB-ONB-106 el admin verifica al profesional y el pro ve su estado actualizado en /pro                                                       | PASÓ   | 21.9 s   | 0          |
| `e2e/real/onboarding-profesional.spec.ts` | CP-WEB-ONB-107  | M3 Onboarding profesional › CP-WEB-ONB-107 ya aprobado, el cliente ve su perfil por URL directa y en el listado al quedar disponible                                        | PASÓ   | 16.3 s   | 0          |
| `e2e/real/onboarding-profesional.spec.ts` | CP-WEB-ONB-108  | M3 Onboarding profesional › CP-WEB-ONB-108 portafolio: el admin lo revisa y el perfil publico muestra solo lo aprobado y visible                                            | PASÓ   | 28.6 s   | 0          |
| `e2e/real/onboarding-profesional.spec.ts` | CP-WEB-ONB-109  | M3 Onboarding profesional › CP-WEB-ONB-109 el admin suspende y reactiva al pro con motivo; el historial lo registra y el pro opera de nuevo                                 | PASÓ   | 30.5 s   | 0          |

### Escaneo a11y (axe, reglas serious/critical) por página visitada

| Página                                                      | Violaciones (reglas) | Detalle (regla / impacto, nodos) |
| ----------------------------------------------------------- | -------------------- | -------------------------------- |
| `/`                                                         | 0                    | —                                |
| `/admin`                                                    | 0                    | —                                |
| `/admin/categories`                                         | 0                    | —                                |
| `/admin/legal/consent-audit`                                | 0                    | —                                |
| `/admin/legal/document-versions`                            | 0                    | —                                |
| `/admin/legal/retention-policies`                           | 0                    | —                                |
| `/admin/professional-documents`                             | 0                    | —                                |
| `/admin/professional-portfolio`                             | 0                    | —                                |
| `/admin/professionals/4120030b-5172-49fa-8e26-9f0ff63a6d6b` | 0                    | —                                |
| `/login`                                                    | 0                    | —                                |
| `/mis-servicios`                                            | 0                    | —                                |
| `/perfil`                                                   | 0                    | —                                |
| `/postularme-como-profesional`                              | 0                    | —                                |
| `/pro/mis-documentos`                                       | 0                    | —                                |
| `/pro/perfil`                                               | 0                    | —                                |
| `/pro/portafolio`                                           | 0                    | —                                |
| `/pro/servicios`                                            | 0                    | —                                |
| `/pro/solicitudes`                                          | 0                    | —                                |
| `/profesionales`                                            | 0                    | —                                |
| `/profesionales/4120030b-5172-49fa-8e26-9f0ff63a6d6b`       | 0                    | —                                |
| `/profesionales/840586d1-3b9a-4f51-8b8b-9062550e60ed`       | 0                    | —                                |
| `/register`                                                 | 0                    | —                                |
| `/solicitar`                                                | 0                    | —                                |

## 3. Defectos encontrados

Sin defectos nuevos en esta corrida. DEF-WEB-004..013 corregidos en la rama; DEF-WEB-014 reclasificado como flaky de test (el spec CP-WEB-MKT-105 navega explícito a `/pro/solicitudes` y espera visibilidad; el landing del profesional sigue en `/pro`). DEF-BE-027 descartado (motivo opcional al rechazar ofertas); DEF-BE-028..031 corregidos en el backend (rama `test/e2e-w2-onboarding-marketplace`).

## 4. Desvíos y observaciones

- Corrida retomada el 2026-11-20 tras el punto sano del 2026-10-13 (la 3/3 original quedó interrumpida). Backend en `test/e2e-w2-onboarding-marketplace` (3d77066) sobre `develop` 1.0.0-develop.19.
- Ajuste de espera en `m2-catalogos.spec.ts` (`optionNames` espera la primera opción antes de leerlas): flaky de test visto el 2026-10-13, no un defecto de producto.
- 3 corridas consecutivas de la suite completa W1+W2: 53/53, 53/53, 53/53 (9.1, 8.0 y 7.9 min), 0 flaky, 0 `test.fail()`.
- Ejecutado por Opus directamente (orquestador), sin agente.

## 5. Evidencia

- Reporte HTML de Playwright: `test/qa/informes/artefactos/playwright-report-real/index.html` (abrir con `pnpm exec playwright show-report test/qa/informes/artefactos/playwright-report-real`; ignorado por git).
- JSON crudo: `test/qa/informes/artefactos/e2e-real.json` (ignorado por git).
- Trazas/capturas de fallos: `test-results/` (ignorado por git).
- Logs de servicios: `test/qa/informes/artefactos/e2e-real/logs/` (ignorado por git; resumen en la sección 7).

## 6. Veredicto

**APROBADO.** 53/53 casos en 3 corridas consecutivas, 0 flaky, 0 defectos abiertos y logs limpios (§7: 0 ERROR, 0 5xx y 0 no manejados en backend, Next y los 5 contenedores).

## 7. Logs de servicios

| Servicio        | Líneas | ERROR/FATAL | de ellos HTTP 4xx manejados | 5xx | No manejados | WARN | Archivo                                                         |
| --------------- | ------ | ----------- | --------------------------- | --- | ------------ | ---- | --------------------------------------------------------------- |
| backend         | 245892 | 0 (FATAL 0) | 0                           | 0   | 0            | 154  | `test/qa/informes/artefactos/e2e-real/logs/backend.log`         |
| docker-mailhog  | 17304  | 0 (FATAL 0) | 0                           | 0   | 0            | 0    | `test/qa/informes/artefactos/e2e-real/logs/docker-mailhog.log`  |
| docker-minio    | 0      | 0 (FATAL 0) | 0                           | 0   | 0            | 0    | `test/qa/informes/artefactos/e2e-real/logs/docker-minio.log`    |
| docker-mongo    | 3205   | 0 (FATAL 0) | 0                           | 0   | 0            | 0    | `test/qa/informes/artefactos/e2e-real/logs/docker-mongo.log`    |
| docker-postgres | 2      | 0 (FATAL 0) | 0                           | 0   | 0            | 0    | `test/qa/informes/artefactos/e2e-real/logs/docker-postgres.log` |
| docker-redis    | 5      | 0 (FATAL 0) | 0                           | 0   | 0            | 0    | `test/qa/informes/artefactos/e2e-real/logs/docker-redis.log`    |
| next            | 1332   | 0 (FATAL 0) | 0                           | 0   | 0            | 3    | `test/qa/informes/artefactos/e2e-real/logs/next.log`            |

### Explicación de señales

_Sin señales bloqueantes._
