# CP-CAT — Catálogos: categorías (M2)

Oleada W1. Admin crea/edita/oculta/borra categorías y se verifica el efecto en la vista cliente, contra el backend real. Formato según `C:\workspace\QA-DOC-STANDARD.md` §2.

### CP-WEB-CAT-101 — El CRUD de categorías del admin se refleja en la vista cliente

| Campo              | Contenido                                                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID                 | CP-WEB-CAT-101                                                                                                                                                                                                                                                                 |
| Título             | El CRUD de categorías del admin se refleja en la vista cliente                                                                                                                                                                                                                 |
| Tipo / Nivel       | e2e (backend real)                                                                                                                                                                                                                                                             |
| Prioridad          | P0                                                                                                                                                                                                                                                                             |
| Trazabilidad       | plan maestro M2 Catálogos; oleada W1                                                                                                                                                                                                                                           |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`.                                                                                                                                   |
| Pasos              | 1. Admin: crear categoría única por corrida.<br>2. Cliente (otro contexto) abre `/solicitar` y abre el selector de categoría.<br>3. Admin: editar el nombre; el cliente recarga.<br>4. Admin: ocultar (switch); el cliente recarga.<br>5. Admin: eliminar; el cliente recarga. |
| Datos de prueba    | `E2E-<runId>`, `E2E-<runId>-editada`                                                                                                                                                                                                                                           |
| Resultado esperado | Creada: aparece en la tabla y en el selector del cliente. Editada: solo el nombre nuevo. Oculta: desaparece para el cliente. Eliminada: desaparece de la tabla.                                                                                                                |
| Automatizado en    | `e2e/real/m2-catalogos.spec.ts` — `CP-WEB-CAT-101 ...`                                                                                                                                                                                                                         |

### CP-WEB-CAT-102 — Un 400 del backend se muestra como error del campo Nombre

| Campo              | Contenido                                                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-CAT-102                                                                                                                               |
| Título             | Un 400 del backend se muestra como error del campo Nombre                                                                                    |
| Tipo / Nivel       | e2e (backend real)                                                                                                                           |
| Prioridad          | P1                                                                                                                                           |
| Trazabilidad       | plan maestro M2 Catálogos; oleada W1; contrato 400 con `errors[]`                                                                            |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`. |
| Pasos              | 1. Admin: Nueva categoría con nombre de 101 caracteres.<br>2. Crear categoría.                                                               |
| Datos de prueba    | `x` × 101                                                                                                                                    |
| Resultado esperado | El diálogo sigue abierto y bajo el campo Nombre se ve el mensaje del backend ("name must be shorter than or equal to 100 characters").       |
| Automatizado en    | `e2e/real/m2-catalogos.spec.ts` — `CP-WEB-CAT-102 ...`                                                                                       |

### CP-WEB-CAT-103 — La tabla admin de categorías pagina (DEF-WEB-002)

| Campo              | Contenido                                                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                 | CP-WEB-CAT-103                                                                                                                                                                                                      |
| Título             | La tabla admin de categorías pagina (DEF-WEB-002)                                                                                                                                                                   |
| Tipo / Nivel       | e2e (backend real)                                                                                                                                                                                                  |
| Prioridad          | P2                                                                                                                                                                                                                  |
| Trazabilidad       | plan maestro M2 Catálogos; oleada W1; DEF-WEB-002                                                                                                                                                                   |
| Precondiciones     | Stack e2e del Backend arriba (`pnpm e2e:up && pnpm e2e:seed && pnpm e2e:serve`) y Next standalone levantado por `playwright.real.config.ts`. 25 categorías creadas por API en `beforeAll` y borradas en `afterAll`. |
| Pasos              | 1. Admin: abrir `/admin/categories`.<br>2. Contar filas renderizadas y buscar el control "Página siguiente".                                                                                                        |
| Datos de prueba    | 25 categorías `E2E-<runId>-pNN`                                                                                                                                                                                     |
| Resultado esperado | ≤ 20 filas por página y control de paginación. **Hoy falla**: `GET /categories/all` devuelve todas (ignora `page`/`pageSize`) y la tabla las renderiza todas, sin paginación. Marcado `test.fail()` (DEF-WEB-002).  |
| Automatizado en    | `e2e/real/m2-catalogos.spec.ts` — `CP-WEB-CAT-103 DEF-WEB-002 ...`                                                                                                                                                  |
