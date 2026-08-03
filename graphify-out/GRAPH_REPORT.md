# Graph Report - .  (2026-07-21)

## Corpus Check
- 287 files · ~87,531 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1219 nodes · 2728 edges · 128 communities (62 shown, 66 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `apiFetch()` - 70 edges
3. `createTestQueryClient()` - 53 edges
4. `Button()` - 38 edges
5. `server` - 27 edges
6. `Skeleton()` - 24 edges
7. `components` - 20 edges
8. `Label()` - 18 edges
9. `ApiError` - 18 edges
10. `Badge()` - 17 edges

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

## Communities (128 total, 66 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (60): renderOverview(), mockPush, mockRefresh, renderLoginForm(), renderList(), Category, renderCategoriesTable(), CategoryFormDialogProps (+52 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (48): DataTable(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+40 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (47): CLAUDE.md — Project root instructions, Generic backend proxy route (/api/backend/[...path]), Dedicated auth routes (login/refresh/logout), BFF architecture (Next.js as Backend-for-Frontend), Design tokens (tokens.json -> theme.generated.css), Golden rule: never call backend URL directly from client, code-reviewer agent, CRITICAL: bypassing BFF proxy breaks masking design (+39 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (24): Dialog(), DialogContent(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle(), DialogTrigger(), Switch() (+16 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (28): DataTableProps, Alert(), AlertAction(), AlertDescription(), AlertTitle(), alertVariants, Avatar(), AvatarBadge() (+20 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (23): getMyProfessionalProfile(), Professional, UpdateAvailabilityRequest, updateMyAvailability(), updateMyProfessionalProfile(), UpdateProfessionalProfileRequest, AvailabilityToggle(), ProModeLink() (+15 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (23): cancelPayment(), getPayments(), GetPaymentsParams, Payment, PaymentStatus, refundPayment(), RefundPaymentDto, CancelPaymentDialog() (+15 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (17): getDashboardStats(), Overview(), useDashboardStatsQuery(), getServices(), GetServicesParams, ServiceStatus, columns, ServicesTable() (+9 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (24): react, react, Separator(), Sidebar(), SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarInput() (+16 more)

### Community 10 - "Community 10"
Cohesion: 0.14
Nodes (17): StatCard(), getNearbyProfessionals(), GetNearbyProfessionalsParams, getOnlineProfessionalsCount(), NearbyProfessional, OnlineCount, LocationsExplorer(), renderExplorer() (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (17): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), StatCardProps (+9 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (21): AppSidebarProps, SidebarVariant, VARIANT_CONFIG, CLIENT_NAV_ITEMS, MODE_HREF, MODE_ICON, MODE_LABEL, ModeSwitcher() (+13 more)

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (19): createCategory(), CreateCategoryDto, deleteCategory(), getCategories(), toggleCategoryVisibility(), updateCategory(), UpdateCategoryDto, CategoriesTable() (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.13
Nodes (17): OPTIONS, ThemeToggle(), getInitials(), UserMenu(), UserMenuProps, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent() (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (16): AdminLayout(), ClientLayout(), ClientHomePage(), ProLayout(), AppSidebar(), Topbar(), TopbarProps, SidebarInset() (+8 more)

### Community 16 - "Community 16"
Cohesion: 0.16
Nodes (14): apiFetch(), BackendEnvelope, ApiError, SessionScope, Category, createServiceRequest, getActiveCategories(), getServiceTypes() (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (11): Checkbox(), Input(), Label(), PasswordInput(), NearbySearchForm(), NearbySearchFormProps, DEFAULT_SEARCH_CENTER, nearbySearchSchema (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.13
Nodes (18): SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger() (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.12
Nodes (22): develop Deployment manifest (deploy-tekoapp-frontend-web), develop Service manifest (service-tekoapp-frontend-web), develop Ingress manifest (dev-tekoapp.com.py), develop HorizontalPodAutoscaler (autoscale-tekoapp-frontend-web), master Deployment manifest (deploy-tekoapp-frontend-web), master Service manifest (service-tekoapp-frontend-web), master Ingress manifest (tekoapp.com.py), master HorizontalPodAutoscaler (autoscale-tekoapp-frontend-web) (+14 more)

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 21 - "Community 21"
Cohesion: 0.16
Nodes (16): getProfessionals(), GetProfessionalsParams, ProfessionalsListResponse, suspendProfessional(), SuspendProfessionalRequest, verifyProfessional(), VerifyProfessionalRequest, columns (+8 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (16): createNotification(), CreateNotificationRequest, getNotifications(), GetNotificationsParams, markNotificationAsRead(), Notification, NotificationStatus, NotificationType (+8 more)

### Community 23 - "Community 23"
Cohesion: 0.19
Nodes (13): loginSchema, POST(), handler(), BASIC_AUTH_PATHS, requiresBasicAuth(), resolveBackendPath(), V1_DOMAINS, proxyToBackend() (+5 more)

### Community 24 - "Community 24"
Cohesion: 0.17
Nodes (17): createPromotion(), CreatePromotionRequest, deletePromotion(), getPromotions(), Promotion, updatePromotion(), UpdatePromotionRequest, PromotionFormDialogProps (+9 more)

### Community 25 - "Community 25"
Cohesion: 0.11
Nodes (19): @base-ui/react, class-variance-authority, leaflet, next, dependencies, @base-ui/react, class-variance-authority, leaflet (+11 more)

### Community 26 - "Community 26"
Cohesion: 0.20
Nodes (12): Button(), buttonVariants, DialogDescription(), Role, EMPTY_VALUES, RoleFormDialog(), RoleFormDialogProps, renderDialog() (+4 more)

### Community 27 - "Community 27"
Cohesion: 0.23
Nodes (13): completeService(), getMyServices(), GetMyServicesParams, Service, ServiceStatus, startService(), MyServicesTable(), STATUS_LABEL (+5 more)

### Community 28 - "Community 28"
Cohesion: 0.14
Nodes (13): components, $defs, operations, paths, webhooks, DashboardStats, CreateRatingRequest, rateProfessional() (+5 more)

### Community 29 - "Community 29"
Cohesion: 0.19
Nodes (12): CreateProfessionalToClientRatingRequest, getMyReviews(), GetMyReviewsParams, rateClient(), Rating, ReviewsListResponse, RateClientDialog(), columns (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.18
Nodes (10): buildDefaultValues(), PromotionFormDialog(), toCreatePromotionRequest(), toDateInputValue(), toIsoDateTime(), TYPE_OPTIONS, PROMOTION_TYPES, PromotionFormInput (+2 more)

### Community 31 - "Community 31"
Cohesion: 0.23
Nodes (12): createRole(), CreateRoleRequest, getRoles(), RoleListResponse, updateRole(), UpdateRoleRequest, getErrorMessage(), useCreateRoleMutation() (+4 more)

### Community 32 - "Community 32"
Cohesion: 0.13
Nodes (15): scripts, build, check:types, dev, format, generate:api-types, lint, postbuild (+7 more)

### Community 33 - "Community 33"
Cohesion: 0.21
Nodes (10): deleteRating(), getRatings(), Rating, RatingsListResponse, RatingActionsCell(), RATINGS_QUERY_KEY, useDeleteRatingMutation(), useRatingsQuery() (+2 more)

### Community 34 - "Community 34"
Cohesion: 0.23
Nodes (7): isBackendEnvelope(), login(), LoginResult, LoginForm(), useLoginMutation(), LoginFormValues, loginSchema

### Community 35 - "Community 35"
Cohesion: 0.19
Nodes (8): geistMono, geistSans, metadata, sora, Toaster(), TooltipProvider(), QueryProvider(), ThemeProvider()

### Community 36 - "Community 36"
Cohesion: 0.17
Nodes (11): author, commitlint, extends, description, engines, node, license, name (+3 more)

### Community 37 - "Community 37"
Cohesion: 0.21
Nodes (9): PERMISSIONS, buildGroups(), collectLeaves(), { groups: PERMISSION_GROUPS, loose: LOOSE_PERMISSIONS }, PermissionCheckboxItemProps, PermissionGroup, PermissionLeaf, PermissionsPicker() (+1 more)

### Community 38 - "Community 38"
Cohesion: 0.18
Nodes (7): categories, clientServices, FAKE_ACCESS_TOKEN, FAKE_DASHBOARD_STATS, FAKE_SERVICE_TYPES, FAKE_USERS_PAGE, server

### Community 39 - "Community 39"
Cohesion: 0.22
Nodes (9): @commitlint/cli, devDependencies, @commitlint/cli, @playwright/test, @semantic-release/changelog, @semantic-release/exec, @playwright/test, @semantic-release/changelog (+1 more)

### Community 40 - "Community 40"
Cohesion: 0.22
Nodes (7): Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink(), PaginationLinkProps, PaginationNext(), PaginationPrevious()

### Community 41 - "Community 41"
Cohesion: 0.39
Nodes (6): CHANNEL_LABEL, TYPE_LABEL, NewNotificationFormValues, newNotificationSchema, NOTIFICATION_CHANNEL_OPTIONS, NOTIFICATION_TYPE_OPTIONS

### Community 42 - "Community 42"
Cohesion: 0.29
Nodes (5): Native CLAUDE.md Integration (graphify claude install), Post-commit Graph Rebuild Hook, build_merge(), --cluster-only Re-clustering, --update Incremental Re-extraction

### Community 43 - "Community 43"
Cohesion: 0.33
Nodes (6): graphify reference: add-watch, /graphify add URL ingestion (video/tweet/arxiv/pdf/image/webpage), graphify reference: exports and benchmark, graphify reference: extraction subagent prompt spec, graphify reference: GitHub clone and cross-repo merge, graphify skill definition

### Community 44 - "Community 44"
Cohesion: 0.40
Nodes (6): BFS Traversal Mode, DFS Traversal Mode, /graphify explain (single node explanation), graphify query CLI / Inline NetworkX Traversal, /graphify path (shortest path between concepts), graphify save-result feedback loop

### Community 45 - "Community 45"
Cohesion: 0.40
Nodes (5): --watch background watcher (debounce, code vs doc handling), MCP stdio server (query_graph, get_node, get_neighbors, etc.), Semantic extraction subagent dispatch (general-purpose, parallel chunks), graphify pipeline (detect -> extract -> build/cluster -> label -> export), graphify query fast path (BFS/DFS over existing graph.json)

### Community 46 - "Community 46"
Cohesion: 0.50
Nodes (4): Docker Build (validate) job, Playwright e2e (disabled via if:false), Lint & Format job, Unit Tests job

### Community 48 - "Community 48"
Cohesion: 0.67
Nodes (3): config, proxy(), PUBLIC_PATHS

### Community 49 - "Community 49"
Cohesion: 1.00
Nodes (3): PERMISSIONS mirror constants (core/auth/permissions.ts), Permissions mirroring (core/auth/permissions.ts mirrors backend PERMISSIONS enum), Permissions constants mirror rule (core/auth/permissions.ts)

### Community 50 - "Community 50"
Cohesion: 0.67
Nodes (3): transcribe_all(), GRAPHIFY_WHISPER_MODEL config, Whisper Domain-hint Prompt Composition

## Knowledge Gaps
- **318 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+313 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **66 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 9` to `Community 25`, `Community 17`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 25` to `Community 36`, `Community 68`, `Community 72`, `Community 9`, `Community 75`, `Community 77`, `Community 78`, `Community 79`, `Community 80`, `Community 81`, `Community 82`, `Community 83`, `Community 84`, `Community 59`, `Community 60`, `Community 63`?**
  _High betweenness centrality (0.177) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 4` to `Community 1`, `Community 3`, `Community 40`, `Community 9`, `Community 10`, `Community 11`, `Community 12`, `Community 14`, `Community 15`, `Community 17`, `Community 18`, `Community 26`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _318 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.050284031138228484 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06202435312024353 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05411764705882353 - nodes in this community are weakly interconnected._