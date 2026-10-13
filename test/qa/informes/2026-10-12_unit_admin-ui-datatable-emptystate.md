# Informe de ejecución — pruebas unitarias y de componente

| Campo          | Valor                                                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fecha y hora   | 2026-10-12 20:36                                                                                                                                                                                                                                              |
| Repo           | TekoApp-Frontend-Web                                                                                                                                                                                                                                          |
| Rama           | feat/admin-ui-datatable-emptystate                                                                                                                                                                                                                            |
| Commit         | 177ba23 (árbol con cambios sin commitear)                                                                                                                                                                                                                     |
| Entorno        | jsdom (local), Node v22.16.0, vitest vitest/4.1.10 win32-x64 node-v22.16.0, win32                                                                                                                                                                             |
| Comando exacto | `pnpm qa:unit` → `pnpm exec vitest run --reporter=json --outputFile=test/qa/informes/artefactos/unit.json --coverage.enabled --coverage.reporter=json-summary --coverage.reporter=html --coverage.reportsDirectory=test/qa/informes/artefactos/unit-coverage` |
| Ejecutor       | agente Claude Code (claude-sonnet-5-5)                                                                                                                                                                                                                        |

## 1. Resumen

| Pasaron | Fallaron | Omitidos | Flaky | Total | Duración |
| ------- | -------- | -------- | ----- | ----- | -------- |
| 341     | 0        | 0        | 0     | 341   | 1.9 min  |

Cobertura: v8 sobre `src/**` (config de `vitest.config.ts`): líneas 81.25% (2869/3531) · sentencias 80% (2920/3650) · funciones 74.32% (1204/1620) · ramas 70.41% (1661/2359).

Exit code del runner: 0.

## 2. Resultados por suite

### Resumen por grupo

| Grupo                                    | Archivos | Casos | Pasaron | Fallaron | Omitidos |
| ---------------------------------------- | -------- | ----- | ------- | -------- | -------- |
| otros                                    | 7        | 23    | 23      | 0        | 0        |
| src/components/data-table                | 1        | 15    | 15      | 0        | 0        |
| src/components/layout                    | 6        | 13    | 13      | 0        | 0        |
| src/components/ui                        | 1        | 4     | 4       | 0        | 0        |
| src/core                                 | 8        | 36    | 36      | 0        | 0        |
| src/features/account-deletion            | 1        | 6     | 6       | 0        | 0        |
| src/features/ai-disclosures              | 1        | 5     | 5       | 0        | 0        |
| src/features/analytics                   | 1        | 2     | 2       | 0        | 0        |
| src/features/audit-log                   | 2        | 7     | 7       | 0        | 0        |
| src/features/auth                        | 2        | 7     | 7       | 0        | 0        |
| src/features/browse-professionals        | 2        | 3     | 3       | 0        | 0        |
| src/features/categories                  | 4        | 15    | 15      | 0        | 0        |
| src/features/consent-audit               | 3        | 9     | 9       | 0        | 0        |
| src/features/contracts                   | 1        | 4     | 4       | 0        | 0        |
| src/features/countries                   | 1        | 2     | 2       | 0        | 0        |
| src/features/data-retention-policies     | 1        | 4     | 4       | 0        | 0        |
| src/features/global-search               | 1        | 7     | 7       | 0        | 0        |
| src/features/legal-document-versions     | 1        | 4     | 4       | 0        | 0        |
| src/features/locations                   | 4        | 9     | 9       | 0        | 0        |
| src/features/material-catalog            | 1        | 4     | 4       | 0        | 0        |
| src/features/my-profile                  | 2        | 4     | 4       | 0        | 0        |
| src/features/my-ratings                  | 1        | 2     | 2       | 0        | 0        |
| src/features/my-services                 | 1        | 1     | 1       | 0        | 0        |
| src/features/notifications               | 4        | 17    | 17      | 0        | 0        |
| src/features/payments                    | 4        | 26    | 26      | 0        | 0        |
| src/features/professional-application    | 2        | 5     | 5       | 0        | 0        |
| src/features/professional-document-types | 1        | 4     | 4       | 0        | 0        |
| src/features/professional-documents      | 4        | 16    | 16      | 0        | 0        |
| src/features/professional-portfolio      | 3        | 12    | 12      | 0        | 0        |
| src/features/professional-profile        | 2        | 3     | 3       | 0        | 0        |
| src/features/professional-ratings        | 1        | 2     | 2       | 0        | 0        |
| src/features/professional-requests       | 1        | 2     | 2       | 0        | 0        |
| src/features/professional-services       | 1        | 1     | 1       | 0        | 0        |
| src/features/professionals               | 4        | 16    | 16      | 0        | 0        |
| src/features/promotions                  | 3        | 9     | 9       | 0        | 0        |
| src/features/ratings                     | 1        | 12    | 12      | 0        | 0        |
| src/features/request-service             | 1        | 2     | 2       | 0        | 0        |
| src/features/roles-permission            | 4        | 10    | 10      | 0        | 0        |
| src/features/service-progress            | 1        | 4     | 4       | 0        | 0        |
| src/features/services                    | 2        | 6     | 6       | 0        | 0        |
| src/features/users                       | 3        | 8     | 8       | 0        | 0        |

### Detalle por archivo de spec

#### otros

| Archivo                                 | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| --------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `src/hooks/use-debounced-value.test.ts` | —   | 2     | 2       | 0        | 0        | PASÓ   |
| `src/lib/formatters.test.ts`            | —   | 8     | 8       | 0        | 0        | PASÓ   |
| `src/lib/run-bulk-action.test.ts`       | —   | 4     | 4       | 0        | 0        | PASÓ   |
| `src/lib/trigger-file-download.test.ts` | —   | 1     | 1       | 0        | 0        | PASÓ   |
| `src/lib/utils.test.ts`                 | —   | 2     | 2       | 0        | 0        | PASÓ   |
| `src/lib/web-push.test.ts`              | —   | 2     | 2       | 0        | 0        | PASÓ   |
| `src/proxy.test.ts`                     | —   | 4     | 4       | 0        | 0        | PASÓ   |

#### src/components/data-table

| Archivo               | CP-                                                                                                                                                                 | Casos | Pasaron | Fallaron | Omitidos | Estado |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------- | -------- | -------- | ------ |
| `data-table.test.tsx` | CP-WEB-UI-001, CP-WEB-UI-002, CP-WEB-UI-003, CP-WEB-UI-004, CP-WEB-UI-005, CP-WEB-UI-006, CP-WEB-UI-007, CP-WEB-UI-008, CP-WEB-UI-009, CP-WEB-UI-010, CP-WEB-UI-011 | 15    | 15      | 0        | 0        | PASÓ   |

#### src/components/layout

| Archivo                              | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ------------------------------------ | --- | ----- | ------- | -------- | -------- | ------ |
| `app-sidebar.test.tsx`               | —   | 2     | 2       | 0        | 0        | PASÓ   |
| `brand-gradient-background.test.tsx` | —   | 1     | 1       | 0        | 0        | PASÓ   |
| `bulk-actions-bar.test.tsx`          | —   | 4     | 4       | 0        | 0        | PASÓ   |
| `language-switcher.test.tsx`         | —   | 1     | 1       | 0        | 0        | PASÓ   |
| `mode-switcher.test.tsx`             | —   | 4     | 4       | 0        | 0        | PASÓ   |
| `user-menu.test.tsx`                 | —   | 1     | 1       | 0        | 0        | PASÓ   |

#### src/components/ui

| Archivo                | CP-                                                        | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ---------------------- | ---------------------------------------------------------- | ----- | ------- | -------- | -------- | ------ |
| `empty-state.test.tsx` | CP-WEB-UI-012, CP-WEB-UI-013, CP-WEB-UI-014, CP-WEB-UI-015 | 4     | 4       | 0        | 0        | PASÓ   |

#### src/core

| Archivo                            | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ---------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `api-client/backend-proxy.test.ts` | —   | 3     | 3       | 0        | 0        | PASÓ   |
| `api-client/client.test.ts`        | —   | 5     | 5       | 0        | 0        | PASÓ   |
| `auth/permissions.test.ts`         | —   | 5     | 5       | 0        | 0        | PASÓ   |
| `auth/rsa-encrypt.test.ts`         | —   | 2     | 2       | 0        | 0        | PASÓ   |
| `auth/session.test.ts`             | —   | 6     | 6       | 0        | 0        | PASÓ   |
| `logging/logger.test.ts`           | —   | 4     | 4       | 0        | 0        | PASÓ   |
| `logging/redact.test.ts`           | —   | 6     | 6       | 0        | 0        | PASÓ   |
| `logging/request-context.test.ts`  | —   | 5     | 5       | 0        | 0        | PASÓ   |

#### src/features/account-deletion

| Archivo                                        | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ---------------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/account-deletion-section.test.tsx` | —   | 6     | 6       | 0        | 0        | PASÓ   |

#### src/features/ai-disclosures

| Archivo                                    | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ------------------------------------------ | --- | ----- | ------- | -------- | -------- | ------ |
| `components/ai-disclosures-table.test.tsx` | —   | 5     | 5       | 0        | 0        | PASÓ   |

#### src/features/analytics

| Archivo                        | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ------------------------------ | --- | ----- | ------- | -------- | -------- | ------ |
| `components/overview.test.tsx` | —   | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/audit-log

| Archivo                                       | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| --------------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/audit-log-detail-dialog.test.tsx` | —   | 2     | 2       | 0        | 0        | PASÓ   |
| `components/audit-log-table.test.tsx`         | —   | 5     | 5       | 0        | 0        | PASÓ   |

#### src/features/auth

| Archivo                             | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ----------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/login-form.test.tsx`    | —   | 3     | 3       | 0        | 0        | PASÓ   |
| `components/register-form.test.tsx` | —   | 4     | 4       | 0        | 0        | PASÓ   |

#### src/features/browse-professionals

| Archivo                                         | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ----------------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/browse-professionals-list.test.tsx` | —   | 1     | 1       | 0        | 0        | PASÓ   |
| `components/professional-detail-card.test.tsx`  | —   | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/categories

| Archivo                                    | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ------------------------------------------ | --- | ----- | ------- | -------- | -------- | ------ |
| `components/categories-table.test.tsx`     | —   | 6     | 6       | 0        | 0        | PASÓ   |
| `components/category-detail-view.test.tsx` | —   | 2     | 2       | 0        | 0        | PASÓ   |
| `components/category-form-dialog.test.tsx` | —   | 4     | 4       | 0        | 0        | PASÓ   |
| `components/category-label.test.tsx`       | —   | 3     | 3       | 0        | 0        | PASÓ   |

#### src/features/consent-audit

| Archivo                                                  | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| -------------------------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/consent-audit-tabs.test.tsx`                 | —                | 2     | 2       | 0        | 0        | PASÓ   |
| `components/content-consent-grants-audit-table.test.tsx` | CP-WEB-ADMIN-012 | 4     | 4       | 0        | 0        | PASÓ   |
| `components/user-consents-audit-table.test.tsx`          | CP-WEB-ADMIN-011 | 3     | 3       | 0        | 0        | PASÓ   |

#### src/features/contracts

| Archivo                               | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/contracts-table.test.tsx` | CP-WEB-ADMIN-005 | 4     | 4       | 0        | 0        | PASÓ   |

#### src/features/countries

| Archivo                                | CP-                                | Casos | Pasaron | Fallaron | Omitidos | Estado |
| -------------------------------------- | ---------------------------------- | ----- | ------- | -------- | -------- | ------ |
| `components/country-combobox.test.tsx` | CP-WEB-ADMIN-009, CP-WEB-ADMIN-010 | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/data-retention-policies

| Archivo                                        | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ---------------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/retention-policies-table.test.tsx` | CP-WEB-ADMIN-005 | 4     | 4       | 0        | 0        | PASÓ   |

#### src/features/global-search

| Archivo                             | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ----------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/global-search.test.tsx` | —   | 7     | 7       | 0        | 0        | PASÓ   |

#### src/features/legal-document-versions

| Archivo                                             | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| --------------------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/legal-document-versions-table.test.tsx` | CP-WEB-ADMIN-005 | 4     | 4       | 0        | 0        | PASÓ   |

#### src/features/locations

| Archivo                                         | CP-                                            | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ----------------------------------------------- | ---------------------------------------------- | ----- | ------- | -------- | -------- | ------ |
| `components/locations-explorer.test.tsx`        | —                                              | 1     | 1       | 0        | 0        | PASÓ   |
| `components/locations-map.test.tsx`             | CP-WEB-LOC-001, CP-WEB-LOC-002, CP-WEB-LOC-003 | 3     | 3       | 0        | 0        | PASÓ   |
| `components/nearby-search-form.test.tsx`        | CP-WEB-LOC-005                                 | 3     | 3       | 0        | 0        | PASÓ   |
| `components/online-professionals-stat.test.tsx` | —                                              | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/material-catalog

| Archivo                                      | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| -------------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/material-catalog-table.test.tsx` | CP-WEB-ADMIN-005 | 4     | 4       | 0        | 0        | PASÓ   |

#### src/features/my-profile

| Archivo                             | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ----------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/avatar-upload.test.tsx` | —   | 2     | 2       | 0        | 0        | PASÓ   |
| `components/profile-form.test.tsx`  | —   | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/my-ratings

| Archivo                                    | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ------------------------------------------ | --- | ----- | ------- | -------- | -------- | ------ |
| `components/my-rating-stats-card.test.tsx` | —   | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/my-services

| Archivo                                        | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ---------------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/my-client-services-table.test.tsx` | —   | 1     | 1       | 0        | 0        | PASÓ   |

#### src/features/notifications

| Archivo                                        | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ---------------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/new-notification-dialog.test.tsx`  | —                | 2     | 2       | 0        | 0        | PASÓ   |
| `components/notification-bell.test.tsx`        | —                | 4     | 4       | 0        | 0        | PASÓ   |
| `components/notifications-table.test.tsx`      | CP-WEB-ADMIN-005 | 6     | 6       | 0        | 0        | PASÓ   |
| `components/push-subscription-toggle.test.tsx` | —                | 5     | 5       | 0        | 0        | PASÓ   |

#### src/features/payments

| Archivo                                      | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| -------------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/my-payment-detail-view.test.tsx` | —                | 6     | 6       | 0        | 0        | PASÓ   |
| `components/my-payments-table.test.tsx`      | —                | 6     | 6       | 0        | 0        | PASÓ   |
| `components/payment-detail-view.test.tsx`    | —                | 4     | 4       | 0        | 0        | PASÓ   |
| `components/payments-table.test.tsx`         | CP-WEB-ADMIN-005 | 10    | 10      | 0        | 0        | PASÓ   |

#### src/features/professional-application

| Archivo                                             | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| --------------------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/professional-application-form.test.tsx` | —   | 3     | 3       | 0        | 0        | PASÓ   |
| `components/recruit-professional-cta.test.tsx`      | —   | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/professional-document-types

| Archivo                                                 | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ------------------------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/professional-document-types-table.test.tsx` | CP-WEB-ADMIN-005 | 4     | 4       | 0        | 0        | PASÓ   |

#### src/features/professional-documents

| Archivo                                                  | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| -------------------------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/document-review-dialog.test.tsx`             | —                | 5     | 5       | 0        | 0        | PASÓ   |
| `components/my-documents-upload.test.tsx`                | —                | 3     | 3       | 0        | 0        | PASÓ   |
| `components/professional-documents-history-tab.test.tsx` | —                | 4     | 4       | 0        | 0        | PASÓ   |
| `components/review-queue-table.test.tsx`                 | CP-WEB-ADMIN-005 | 4     | 4       | 0        | 0        | PASÓ   |

#### src/features/professional-portfolio

| Archivo                                            | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| -------------------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/my-portfolio-manager.test.tsx`         | —                | 3     | 3       | 0        | 0        | PASÓ   |
| `components/portfolio-review-queue-table.test.tsx` | CP-WEB-ADMIN-005 | 7     | 7       | 0        | 0        | PASÓ   |
| `components/public-portfolio-gallery.test.tsx`     | —                | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/professional-profile

| Archivo                                         | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ----------------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/professional-gate.test.tsx`         | —   | 2     | 2       | 0        | 0        | PASÓ   |
| `components/professional-profile-form.test.tsx` | —   | 1     | 1       | 0        | 0        | PASÓ   |

#### src/features/professional-ratings

| Archivo                                              | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ---------------------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/professional-rating-stats-card.test.tsx` | —   | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/professional-requests

| Archivo                                      | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| -------------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/pending-services-table.test.tsx` | —   | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/professional-services

| Archivo                                 | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| --------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/my-services-table.test.tsx` | —   | 1     | 1       | 0        | 0        | PASÓ   |

#### src/features/professionals

| Archivo                                           | CP-                                | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ------------------------------------------------- | ---------------------------------- | ----- | ------- | -------- | -------- | ------ |
| `components/professional-detail-view.test.tsx`    | —                                  | 2     | 2       | 0        | 0        | PASÓ   |
| `components/professionals-table.test.tsx`         | CP-WEB-ADMIN-003, CP-WEB-ADMIN-004 | 10    | 10      | 0        | 0        | PASÓ   |
| `components/suspend-professional-dialog.test.tsx` | —                                  | 2     | 2       | 0        | 0        | PASÓ   |
| `components/verify-professional-dialog.test.tsx`  | —                                  | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/promotions

| Archivo                                     | CP-                                                  | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ------------------------------------------- | ---------------------------------------------------- | ----- | ------- | -------- | -------- | ------ |
| `components/promotion-detail-view.test.tsx` | —                                                    | 2     | 2       | 0        | 0        | PASÓ   |
| `components/promotion-form-dialog.test.tsx` | CP-WEB-ADMIN-006, CP-WEB-ADMIN-007, CP-WEB-ADMIN-008 | 3     | 3       | 0        | 0        | PASÓ   |
| `components/promotions-table.test.tsx`      | CP-WEB-ADMIN-002                                     | 4     | 4       | 0        | 0        | PASÓ   |

#### src/features/ratings

| Archivo                             | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ----------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/ratings-table.test.tsx` | CP-WEB-ADMIN-005 | 12    | 12      | 0        | 0        | PASÓ   |

#### src/features/request-service

| Archivo                                    | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ------------------------------------------ | --- | ----- | ------- | -------- | -------- | ------ |
| `components/request-service-form.test.tsx` | —   | 2     | 2       | 0        | 0        | PASÓ   |

#### src/features/roles-permission

| Archivo                                  | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ---------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/permissions-picker.test.tsx` | —                | 3     | 3       | 0        | 0        | PASÓ   |
| `components/role-detail-view.test.tsx`   | —                | 2     | 2       | 0        | 0        | PASÓ   |
| `components/role-form-dialog.test.tsx`   | —                | 2     | 2       | 0        | 0        | PASÓ   |
| `components/roles-table.test.tsx`        | CP-WEB-ADMIN-005 | 3     | 3       | 0        | 0        | PASÓ   |

#### src/features/service-progress

| Archivo                                        | CP- | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ---------------------------------------------- | --- | ----- | ------- | -------- | -------- | ------ |
| `components/service-progress-section.test.tsx` | —   | 4     | 4       | 0        | 0        | PASÓ   |

#### src/features/services

| Archivo                                   | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ----------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/service-detail-view.test.tsx` | —                | 2     | 2       | 0        | 0        | PASÓ   |
| `components/services-table.test.tsx`      | CP-WEB-ADMIN-005 | 4     | 4       | 0        | 0        | PASÓ   |

#### src/features/users

| Archivo                                  | CP-              | Casos | Pasaron | Fallaron | Omitidos | Estado |
| ---------------------------------------- | ---------------- | ----- | ------- | -------- | -------- | ------ |
| `components/user-detail-dialog.test.tsx` | —                | 2     | 2       | 0        | 0        | PASÓ   |
| `components/user-detail-view.test.tsx`   | —                | 2     | 2       | 0        | 0        | PASÓ   |
| `components/users-table.test.tsx`        | CP-WEB-ADMIN-001 | 4     | 4       | 0        | 0        | PASÓ   |

## 3. Defectos encontrados

Ninguno. Ningún caso falló.

## 4. Desvíos y observaciones

- Sin flakies ni omitidos; el timeout de 10 s de `vitest.config.ts` no se alcanzó en ningún test.
- Aviso de tooling: vitest sugiere reemplazar el plugin `vite-tsconfig-paths` por `resolve.tsconfigPaths`; sin impacto en resultados.
- Brecha de cobertura de casos: el aviso de ubicación aproximada del mapa (CP-WEB-LOC-004) no tiene test automatizado; queda como caso manual.
- Los CP- del informe solo cubren los archivos tocados en esta rama; el resto de los archivos figura con "—" (se documentan al tocarlos, estándar §4).
- Las filas CP- de las tablas admin (CP-WEB-ADMIN-005) agrupan varios archivos; el cruce automático se hace por archivo citado en "Automatizado en".

## 5. Evidencia

- JSON crudo de vitest: `test/qa/informes/artefactos/unit.json` (ignorado por git, regenerable).
- Cobertura HTML: `test/qa/informes/artefactos/unit-coverage/index.html` (ignorado por git).

## 6. Veredicto

**APROBADO.** Criterio del plan: 0 fallidos, 0 omitidos, cobertura v8 informada (líneas 81%). Lint y typecheck en verde (ver commit).
