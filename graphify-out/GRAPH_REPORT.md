# Graph Report - TekoApp-Frontend-Web  (2026-08-03)

## Corpus Check
- 364 files · ~252,459 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1635 nodes · 3984 edges · 166 communities (90 shown, 76 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 37 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `59bb3763`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- render
- button.tsx
- CLAUDE.md — Project root instructions
- user-detail-dialog.tsx
- sheet.stories.tsx
- professional-profile/hooks.ts
- payments-table.tsx
- services-table.tsx
- compilerOptions
- sidebar.tsx
- locations-explorer.tsx
- user-detail-view.tsx
- app-sidebar.tsx
- refund-payment-dialog.tsx
- dropdown-menu.tsx
- session.ts
- request-service/api.ts
- label.tsx
- new-notification-dialog.tsx
- develop Deployment manifest (deploy-tekoapp-frontend-web)
- components.json
- professionals/api.ts
- apiFetch
- login/route.ts
- promotions/api.ts
- dependencies
- role-form-dialog.tsx
- professional-services/api.ts
- types.generated.ts
- professional-ratings/api.ts
- promotion-form-dialog.tsx
- roles-permission/api.ts
- scripts
- server.ts
- client.ts
- app/layout.tsx
- package.json
- permissions-picker.tsx
- server.mjs
- @commitlint/cli
- cn
- generate-feature.mjs
- --update Incremental Re-extraction
- graphify skill definition
- graphify query CLI / Inline NetworkX Traversal
- graphify pipeline (detect -> extract -> build/cluster -> label -> export)
- Unit Tests job
- location-picker-map.tsx
- promotions-table.tsx
- PERMISSIONS mirror constants (core/auth/permissions.ts)
- transcribe_all
- generate-api-types.mjs
- Realtime ticket route (socket.io handshake)
- TDD refactor phases (Orient/Diagnosis/Characterization/Plan/Execute/Final)
- Test generation workflow (happy/loading/error/empty/edge, AAA, Spanish describe/it)
- Architecture decisions table (Next.js vs SPA, generic BFF proxy, shadcn/Base UI, W3C tokens, no monorepo, proxy.ts rename)
- Pending tasks (Storybook install, referenceId audit)
- Confidence score rubric (EXTRACTED=1.0, INFERRED discrete values, AMBIGUOUS 0.1-0.3)
- graphify clone (single/multi-repo cross-repo graph merge)
- client-only
- formatters.ts
- @commitlint/config-conventional
- cross-env
- professional-mode.ts
- devDependencies
- eslint.config.mjs
- avatar.stories.tsx
- eslint-config-prettier
- @hookform/resolvers
- husky
- jsdom
- badge.tsx
- lucide-react
- msw
- next.config.ts
- next-themes
- openapi-typescript
- react-dom
- tailwind-merge
- @tanstack/react-query
- category-form-dialog.tsx
- tw-animate-css
- @vis.gl/react-google-maps
- server
- zustand
- my-profile/api.ts
- semantic-release
- @semantic-release/git
- @semantic-release/github
- @semantic-release/npm
- style-dictionary
- tailwindcss
- @tailwindcss/postcss
- @testing-library/jest-dom
- @testing-library/react
- users/api.ts
- @types/leaflet
- @types/node
- @types/react
- @types/react-dom
- typescript
- vite-tsconfig-paths
- @vitejs/plugin-react
- vitest
- postcss.config.mjs
- deploy.sh
- prepare-standalone.mjs
- replace-version.sh
- Cómo contribuir a TekoApp-Web — guía paso a paso
- request-service-form.test.tsx
- build.mjs
- Critical rules (codegen types, RHF+zod, TanStack Query, lint/test gates)
- Next.js Agent Rules Warning
- Logout route (Set-Cookie Max-Age=0)
- components/layout/DataTable wrapper (TanStack Table + shadcn)
- Token-reduction benchmark (only if total_words > 5000)
- Neo4j export (--neo4j / --neo4j-push, Cypher, MERGE-safe)
- Hyperedge rules (3+ nodes, max 3 per chunk)
- payments/hooks.ts
- browse-professionals/api.ts
- alert.stories.tsx
- badge.stories.tsx
- language-switcher.tsx
- button.stories.tsx
- professionals.ts
- query-client.ts
- my-services/api.ts
- Accesibilidad (a11y)
- language-switcher.test.tsx
- profile-form.tsx
- data-table.stories.tsx
- tooltip.stories.tsx
- app-sidebar.stories.tsx
- user-menu.stories.tsx
- mode-switcher.stories.tsx
- separator.tsx
- Auth rules
- theme-toggle.stories.tsx
- @base-ui/react
- CLAUDE.md
- leaflet
- next-intl
- react-hook-form
- sonner
- @playwright/test
- @semantic-release/changelog
- @semantic-release/exec
- storybook
- @storybook/addon-a11y
- @storybook/addon-docs
- @storybook/addon-themes
- @storybook/nextjs-vite
- @vitest/coverage-v8
- main.ts
- preview.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `apiFetch()` - 86 edges
3. `render()` - 83 edges
4. `createTestQueryClient()` - 77 edges
5. `Button()` - 62 edges
6. `server` - 36 edges
7. `Skeleton()` - 33 edges
8. `Badge()` - 29 edges
9. `Label()` - 29 edges
10. `formatCurrency()` - 27 edges

## Surprising Connections (you probably didn't know these)
- `Tech Stack table (Next.js/shadcn/TanStack Query/Docker/K3s)` --semantically_similar_to--> `Deploy to K3s job (GitOps via ArgoCD)`  [INFERRED] [semantically similar]
  README.md → .github/workflows/pipeline.yml
- `PasswordInput()` --references--> `react`  [EXTRACTED]
  src/components/ui/password-input.tsx → package.json
- `pnpm ignoredBuiltDependencies (sharp, unrs-resolver)` --shares_data_with--> `TekoApp-Backend (NestJS/Prisma/Mongoose/Redis/Sharp)`  [INFERRED]
  pnpm-workspace.yaml → README.md
- `SidebarMenuSkeleton()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `SidebarProvider()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **BFF auth flow (proxy, login, logout, realtime ticket)** — _claude_claude_bff, _claude_claude_api_backend_proxy, claude_documentation_architecture_login_route, claude_documentation_architecture_logout_route, claude_documentation_architecture_realtime_ticket [EXTRACTED 0.90]
- **Shared MSW network-boundary mocking convention** — claude_agents_testing_agent_msw, claude_agents_tdd_refactor_msw_boundary, claude_rules_test_msw [EXTRACTED 0.90]
- **Base UI integration bug discoveries (render prop, GroupLabel ancestor)** — sessions_session_1_baseui_bugs, claude_rules_design_system_render_prop, claude_rules_design_system_group_label_bug [EXTRACTED 0.90]
- **develop K8s Deployment Stack (deployment+service+ingress+hpa)** — ci_develop_1_deployment_k8sdeployment, ci_develop_2_service_k8sservice, ci_develop_3_ingress_k8singress, ci_develop_4_hpa_k8shpa [EXTRACTED 1.00]
- **master K8s Deployment Stack (deployment+service+ingress+hpa)** — ci_master_1_deployment_k8sdeployment, ci_master_2_service_k8sservice, ci_master_3_ingress_k8singress, ci_master_4_hpa_k8shpa [EXTRACTED 1.00]
- **qa K8s Deployment Stack (deployment+service+ingress+hpa)** — ci_qa_1_deployment_k8sdeployment, ci_qa_2_service_k8sservice, ci_qa_3_ingress_k8singress, ci_qa_4_hpa_k8shpa [EXTRACTED 1.00]

## Communities (166 total, 76 thin omitted)

### Community 0 - "render"
Cohesion: 0.12
Nodes (26): renderOverview(), mockPush, mockRefresh, renderLoginForm(), renderCategoriesTable(), renderDetailView(), renderExplorer(), renderStat() (+18 more)

### Community 1 - "button.tsx"
Cohesion: 0.10
Nodes (18): DataTable(), DataTableProps, Button(), buttonVariants, Skeleton(), Card, Default, Story (+10 more)

### Community 2 - "CLAUDE.md — Project root instructions"
Cohesion: 0.05
Nodes (47): CLAUDE.md — Project root instructions, Generic backend proxy route (/api/backend/[...path]), Dedicated auth routes (login/refresh/logout), BFF architecture (Next.js as Backend-for-Frontend), Design tokens (tokens.json -> theme.generated.css), Golden rule: never call backend URL directly from client, code-reviewer agent, CRITICAL: bypassing BFF proxy breaks masking design (+39 more)

### Community 3 - "user-detail-dialog.tsx"
Cohesion: 0.13
Nodes (26): Dialog(), DialogClose(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogTitle(), DialogTrigger() (+18 more)

### Community 4 - "sheet.stories.tsx"
Cohesion: 0.19
Nodes (12): Sheet(), SheetClose(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+4 more)

### Community 5 - "professional-profile/hooks.ts"
Cohesion: 0.17
Nodes (15): getMyProfessionalProfile(), Professional, UpdateAvailabilityRequest, updateMyAvailability(), updateMyProfessionalProfile(), UpdateProfessionalProfileRequest, AvailabilityToggle(), ProModeLink() (+7 more)

### Community 6 - "payments-table.tsx"
Cohesion: 0.13
Nodes (13): PaymentStatus, CancelPaymentDialog(), CANCELLABLE_STATUSES, PaymentDetailView(), REFUNDABLE_STATUSES, STATUS_VARIANT, CANCELLABLE_STATUSES, PaymentsTable() (+5 more)

### Community 7 - "services-table.tsx"
Cohesion: 0.14
Nodes (15): getServiceById(), getServices(), GetServicesParams, Service, ServiceDetail, ServicesListResponse, ServiceStatus, ServiceDetailView() (+7 more)

### Community 8 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 9 - "sidebar.tsx"
Cohesion: 0.10
Nodes (29): react, react, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+21 more)

### Community 10 - "locations-explorer.tsx"
Cohesion: 0.12
Nodes (21): StatCard(), getNearbyProfessionals(), GetNearbyProfessionalsParams, getOnlineProfessionalsCount(), NearbyProfessional, OnlineCount, LocationsExplorer(), LocationsMap() (+13 more)

### Community 11 - "user-detail-view.tsx"
Cohesion: 0.16
Nodes (17): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), Default (+9 more)

### Community 12 - "app-sidebar.tsx"
Cohesion: 0.15
Nodes (16): AppSidebarProps, SidebarVariant, VARIANT_CONFIG, CLIENT_NAV_ITEMS, MODE_HREF, MODE_ICON, ModeSwitcher(), NAV_ITEMS (+8 more)

### Community 13 - "refund-payment-dialog.tsx"
Cohesion: 0.08
Nodes (47): AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia() (+39 more)

### Community 14 - "dropdown-menu.tsx"
Cohesion: 0.16
Nodes (17): OPTIONS, ThemeToggle(), UserMenuProps, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+9 more)

### Community 15 - "session.ts"
Cohesion: 0.12
Nodes (21): AdminLayout(), ClientLayout(), ClientHomePage(), ProLayout(), AppSidebar(), Default, Story, storybookQueryClient (+13 more)

### Community 16 - "request-service/api.ts"
Cohesion: 0.23
Nodes (10): Category, createServiceRequest, getActiveCategories(), getServiceTypes(), Service, ServiceType, RequestServiceForm(), useActiveCategoriesQuery() (+2 more)

### Community 17 - "label.tsx"
Cohesion: 0.12
Nodes (19): Input(), Default, Disabled, Invalid, Story, WithLabel, Label(), AssociatedWithInput (+11 more)

### Community 18 - "new-notification-dialog.tsx"
Cohesion: 0.13
Nodes (20): SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectSeparator(), SelectTrigger(), SelectValue(), Default (+12 more)

### Community 19 - "develop Deployment manifest (deploy-tekoapp-frontend-web)"
Cohesion: 0.12
Nodes (22): develop Deployment manifest (deploy-tekoapp-frontend-web), develop Service manifest (service-tekoapp-frontend-web), develop Ingress manifest (dev-tekoapp.com.py), develop HorizontalPodAutoscaler (autoscale-tekoapp-frontend-web), master Deployment manifest (deploy-tekoapp-frontend-web), master Service manifest (service-tekoapp-frontend-web), master Ingress manifest (tekoapp.com.py), master HorizontalPodAutoscaler (autoscale-tekoapp-frontend-web) (+14 more)

### Community 20 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 21 - "professionals/api.ts"
Cohesion: 0.26
Nodes (12): getProfessionalByReference(), getProfessionals(), GetProfessionalsParams, ProfessionalsListResponse, suspendProfessional(), SuspendProfessionalRequest, verifyProfessional(), VerifyProfessionalRequest (+4 more)

### Community 22 - "apiFetch"
Cohesion: 0.13
Nodes (30): apiFetch(), createNotification(), CreateNotificationRequest, CreatePushSubscriptionRequest, getNotifications(), GetNotificationsParams, getUnreadCount(), getVapidPublicKey() (+22 more)

### Community 23 - "login/route.ts"
Cohesion: 0.10
Nodes (30): fetchLoginNonce(), loginSchema, POST(), POST(), handler(), GET(), BASIC_AUTH_PATHS, requiresBasicAuth() (+22 more)

### Community 24 - "promotions/api.ts"
Cohesion: 0.15
Nodes (20): createPromotion(), CreatePromotionRequest, deletePromotion(), getPromotionById(), getPromotions(), Promotion, PromotionDetail, updatePromotion() (+12 more)

### Community 25 - "dependencies"
Cohesion: 0.11
Nodes (19): class-variance-authority, clsx, date-fns, next, dependencies, class-variance-authority, clsx, date-fns (+11 more)

### Community 26 - "role-form-dialog.tsx"
Cohesion: 0.17
Nodes (11): Default, Disabled, Invalid, Story, WithLabel, Textarea(), professionalProfileFormSchema, ProfessionalProfileFormValues (+3 more)

### Community 27 - "professional-services/api.ts"
Cohesion: 0.29
Nodes (11): completeService(), getMyServices(), GetMyServicesParams, Service, ServiceStatus, startService(), MyServicesTable(), useCompleteServiceMutation() (+3 more)

### Community 28 - "types.generated.ts"
Cohesion: 0.15
Nodes (12): components, $defs, paths, webhooks, DashboardStats, CreateRatingRequest, rateProfessional(), Rating (+4 more)

### Community 29 - "professional-ratings/api.ts"
Cohesion: 0.27
Nodes (9): CreateProfessionalToClientRatingRequest, getMyReviews(), GetMyReviewsParams, rateClient(), Rating, ReviewsListResponse, RateClientDialog(), useMyReviewsQuery() (+1 more)

### Community 30 - "promotion-form-dialog.tsx"
Cohesion: 0.22
Nodes (9): buildDefaultValues(), toCreatePromotionRequest(), toDateInputValue(), toIsoDateTime(), TYPE_OPTIONS, PROMOTION_TYPES, PromotionFormInput, promotionFormSchema (+1 more)

### Community 31 - "roles-permission/api.ts"
Cohesion: 0.13
Nodes (19): createRole(), CreateRoleRequest, getRoleById(), getRoles(), Role, RoleListResponse, RoleWithPermissions, updateRole() (+11 more)

### Community 32 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, build, build-storybook, check:types, dev, format, generate:api-types, generate:feature (+10 more)

### Community 33 - "server.ts"
Cohesion: 0.16
Nodes (10): renderDetailView(), renderPaymentsTable(), Rating, renderRatingsTable(), authHandlers, handlers, fakePayments, paymentsHandlers (+2 more)

### Community 34 - "client.ts"
Cohesion: 0.20
Nodes (9): BackendEnvelope, ApiError, LoginResult, acceptService(), getPendingServices(), GetPendingServicesParams, Service, ServicesListResponse (+1 more)

### Community 35 - "app/layout.tsx"
Cohesion: 0.19
Nodes (8): geistMono, metadata, poppins, Default, Story, Toaster(), QueryProvider(), ThemeProvider()

### Community 36 - "package.json"
Cohesion: 0.17
Nodes (11): author, commitlint, extends, description, engines, node, license, name (+3 more)

### Community 37 - "permissions-picker.tsx"
Cohesion: 0.12
Nodes (16): Checkbox(), Checked, Default, Disabled, Invalid, Story, WithLabel, PERMISSIONS (+8 more)

### Community 38 - "server.mjs"
Cohesion: 0.18
Nodes (7): categories, clientServices, FAKE_ACCESS_TOKEN, FAKE_DASHBOARD_STATS, FAKE_SERVICE_TYPES, FAKE_USERS_PAGE, server

### Community 40 - "cn"
Cohesion: 0.12
Nodes (27): AlertDialogOverlay(), DialogOverlay(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationItem(), PaginationLink(), PaginationLinkProps (+19 more)

### Community 41 - "generate-feature.mjs"
Cohesion: 0.10
Nodes (24): apiTemplate(), camelize(), files, flags, force, formDialogTemplate(), header(), hooksTemplate() (+16 more)

### Community 42 - "--update Incremental Re-extraction"
Cohesion: 0.29
Nodes (5): Native CLAUDE.md Integration (graphify claude install), Post-commit Graph Rebuild Hook, build_merge(), --cluster-only Re-clustering, --update Incremental Re-extraction

### Community 43 - "graphify skill definition"
Cohesion: 0.33
Nodes (6): graphify reference: add-watch, /graphify add URL ingestion (video/tweet/arxiv/pdf/image/webpage), graphify reference: exports and benchmark, graphify reference: extraction subagent prompt spec, graphify reference: GitHub clone and cross-repo merge, graphify skill definition

### Community 44 - "graphify query CLI / Inline NetworkX Traversal"
Cohesion: 0.40
Nodes (6): BFS Traversal Mode, DFS Traversal Mode, /graphify explain (single node explanation), graphify query CLI / Inline NetworkX Traversal, /graphify path (shortest path between concepts), graphify save-result feedback loop

### Community 45 - "graphify pipeline (detect -> extract -> build/cluster -> label -> export)"
Cohesion: 0.40
Nodes (5): --watch background watcher (debounce, code vs doc handling), MCP stdio server (query_graph, get_node, get_neighbors, etc.), Semantic extraction subagent dispatch (general-purpose, parallel chunks), graphify pipeline (detect -> extract -> build/cluster -> label -> export), graphify query fast path (BFS/DFS over existing graph.json)

### Community 46 - "Unit Tests job"
Cohesion: 0.50
Nodes (4): Docker Build (validate) job, Playwright e2e (disabled via if:false), Lint & Format job, Unit Tests job

### Community 48 - "promotions-table.tsx"
Cohesion: 0.15
Nodes (14): CategoryDetailView(), STATUS_VARIANT, NotificationsTable(), truncateMessage(), TYPE_VARIANT, Review, ReviewsTable(), formatDiscount() (+6 more)

### Community 49 - "PERMISSIONS mirror constants (core/auth/permissions.ts)"
Cohesion: 1.00
Nodes (3): PERMISSIONS mirror constants (core/auth/permissions.ts), Permissions mirroring (core/auth/permissions.ts mirrors backend PERMISSIONS enum), Permissions constants mirror rule (core/auth/permissions.ts)

### Community 50 - "transcribe_all"
Cohesion: 0.67
Nodes (3): transcribe_all(), GRAPHIFY_WHISPER_MODEL config, Whisper Domain-hint Prompt Composition

### Community 60 - "formatters.ts"
Cohesion: 0.16
Nodes (15): getDashboardStats(), Overview(), useDashboardStatsQuery(), formatDiscount(), PromotionDetailView(), STATUS_VARIANT, currencyFormatters, dateFormatters (+7 more)

### Community 63 - "professional-mode.ts"
Cohesion: 0.13
Nodes (13): mockReplace, renderGate(), renderForm(), renderTable(), renderTable(), renderDetailView(), renderServicesTable(), fakeMyServices (+5 more)

### Community 64 - "devDependencies"
Cohesion: 0.18
Nodes (11): eslint, eslint-config-next, lint-staged, devDependencies, eslint, eslint-config-next, lint-staged, prettier (+3 more)

### Community 66 - "avatar.stories.tsx"
Cohesion: 0.18
Nodes (15): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Fallback, Group (+7 more)

### Community 71 - "badge.tsx"
Cohesion: 0.18
Nodes (10): Badge(), badgeVariants, getVerificationVariant(), ProfessionalDetailView(), STATUS_VARIANT, getVerificationVariant(), ProfessionalsTable(), STATUS_VARIANT (+2 more)

### Community 80 - "category-form-dialog.tsx"
Cohesion: 0.17
Nodes (11): Checked, Default, Disabled, Small, Story, WithLabel, Switch(), Category (+3 more)

### Community 83 - "server"
Cohesion: 0.17
Nodes (8): renderDialog(), renderBell(), renderNotificationsTable(), buildNotification(), fakeNotifications, notificationsHandlers, server, ResizeObserverMock

### Community 85 - "my-profile/api.ts"
Cohesion: 0.23
Nodes (10): uploadFile(), FileInfoResponse, MeResponse, updateMe(), UpdateMeDto, uploadAvatar(), getErrorMessage(), useUpdateMeMutation() (+2 more)

### Community 95 - "users/api.ts"
Cohesion: 0.22
Nodes (11): getUserByReference(), getUsers(), GetUsersParams, updateUserByReference(), UpdateUserDto, UsersListResponse, getErrorMessage(), useUpdateUserMutation() (+3 more)

### Community 108 - "Cómo contribuir a TekoApp-Web — guía paso a paso"
Cohesion: 0.14
Nodes (13): 0. Los 3 conceptos que hay que tener claros antes de tocar nada, 1. Ajustar una feature que ya existe, 2. Crear una feature nueva de cero, 3. Textos e idiomas (i18n), 4. Diseño — nunca un color/tamaño "a mano", 5. Dónde vive cada tipo de documentación, 6. Checklist antes de dar una tarea por terminada, Cómo contribuir a TekoApp-Web — guía paso a paso (+5 more)

### Community 110 - "request-service-form.test.tsx"
Cohesion: 0.18
Nodes (10): renderList(), renderTable(), mockPush, renderForm(), clientModeHandlers, fakeActiveCategories, fakeClientServices, fakeProfessionalsList (+2 more)

### Community 128 - "payments/hooks.ts"
Cohesion: 0.27
Nodes (12): cancelPayment(), getPaymentById(), getPayments(), GetPaymentsParams, Payment, refundPayment(), RefundPaymentDto, getErrorMessage() (+4 more)

### Community 129 - "browse-professionals/api.ts"
Cohesion: 0.22
Nodes (9): operations, browseProfessionals(), BrowseProfessionalsParams, getProfessionalByReference(), Professional, ProfessionalsListResponse, BrowseProfessionalsList(), useBrowseProfessionalsQuery() (+1 more)

### Community 130 - "alert.stories.tsx"
Cohesion: 0.21
Nodes (11): Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants, Default, Destructive, Info (+3 more)

### Community 131 - "badge.stories.tsx"
Cohesion: 0.15
Nodes (12): AllVariants, Default, Destructive, Ghost, Info, Link, Outline, Secondary (+4 more)

### Community 132 - "language-switcher.tsx"
Cohesion: 0.36
Nodes (7): AppLocale, isAppLocale(), locales, negotiateLocale(), setLocale(), AppConfig, next-intl

### Community 133 - "button.stories.tsx"
Cohesion: 0.17
Nodes (11): AllVariants, Default, Destructive, Disabled, Ghost, IconOnly, Link, Outline (+3 more)

### Community 134 - "professionals.ts"
Cohesion: 0.26
Nodes (7): renderDetailView(), renderProfessionalsTable(), renderDialog(), renderDialog(), buildProfessional(), fakeProfessionalsPage1, professionalsHandlers

### Community 135 - "query-client.ts"
Cohesion: 0.29
Nodes (5): CategoryStats, renderDialog(), buildCategory(), categoriesHandlers, fakeCategories

### Community 136 - "my-services/api.ts"
Cohesion: 0.29
Nodes (9): cancelService(), CancelServiceRequest, getMyClientServices(), GetMyClientServicesParams, Service, ServiceStatus, CancelServiceDialog(), useCancelServiceMutation() (+1 more)

### Community 137 - "Accesibilidad (a11y)"
Cohesion: 0.20
Nodes (9): Accesibilidad (a11y), Checklist pre-cierre (correr antes de dar por terminado un componente/pantalla), Contraste de color, Controles solo-ícono, El estado no depende solo del color, Foco de teclado visible, Labels de formularios, Movimiento y animación (+1 more)

### Community 138 - "language-switcher.test.tsx"
Cohesion: 0.20
Nodes (6): LanguageSwitcher(), Default, Story, mockRefresh, mockSetLocale, LoginForm()

### Community 139 - "profile-form.tsx"
Cohesion: 0.29
Nodes (7): metadata, PerfilPage(), SessionUser, ProfileForm(), ProfileFormProps, profileFormSchema, ProfileFormValues

### Community 140 - "data-table.stories.tsx"
Cohesion: 0.22
Nodes (8): columns, data, Default, Empty, Professional, statusVariant, Story, WithPagination

### Community 141 - "tooltip.stories.tsx"
Cohesion: 0.33
Nodes (7): Default, Sides, Story, Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 142 - "app-sidebar.stories.tsx"
Cohesion: 0.33
Nodes (6): Admin, Client, makeClient(), Professional, Shell(), Story

### Community 143 - "user-menu.stories.tsx"
Cohesion: 0.29
Nodes (5): getInitials(), Default, SingleName, Story, UserMenu()

### Community 144 - "mode-switcher.stories.tsx"
Cohesion: 0.40
Nodes (5): FromAdmin, FromClient, makeClient(), Shell(), Story

### Community 145 - "separator.tsx"
Cohesion: 0.40
Nodes (4): Separator(), Horizontal, Story, Vertical

### Community 146 - "Auth rules"
Cohesion: 0.50
Nodes (3): Auth rules, Clasificación de errores — nunca tratar 401 y 5xx igual, Rama protegida — guardrail explícito

## Knowledge Gaps
- **495 isolated node(s):** `config`, `preview`, `$schema`, `style`, `rsc` (+490 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **76 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`, `@hookform/resolvers`, `lucide-react`, `sidebar.tsx`, `next-themes`, `react-dom`, `tailwind-merge`, `@tanstack/react-query`, `tw-animate-css`, `@vis.gl/react-google-maps`, `@base-ui/react`, `zustand`, `leaflet`, `next-intl`, `react-hook-form`, `sonner`, `client-only`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `react` connect `sidebar.tsx` to `dependencies`, `label.tsx`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `button.tsx`, `alert.stories.tsx`, `user-detail-dialog.tsx`, `sheet.stories.tsx`, `sidebar.tsx`, `locations-explorer.tsx`, `user-detail-view.tsx`, `app-sidebar.tsx`, `refund-payment-dialog.tsx`, `dropdown-menu.tsx`, `session.ts`, `tooltip.stories.tsx`, `label.tsx`, `new-notification-dialog.tsx`, `separator.tsx`, `role-form-dialog.tsx`, `permissions-picker.tsx`, `avatar.stories.tsx`, `badge.tsx`, `category-form-dialog.tsx`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **What connects `config`, `preview`, `$schema` to the rest of the system?**
  _495 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `render` be split into smaller, more focused modules?**
  _Cohesion score 0.11945031712473574 - nodes in this community are weakly interconnected._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09716599190283401 - nodes in this community are weakly interconnected._
- **Should `CLAUDE.md — Project root instructions` be split into smaller, more focused modules?**
  _Cohesion score 0.05411764705882353 - nodes in this community are weakly interconnected._