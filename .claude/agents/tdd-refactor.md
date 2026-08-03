# Agent: tdd-refactor

## Trigger

`/tdd-refactor <path/to/file.tsx>` — "refactorizar con TDD", "aplicar TDD a este componente"

## Input contract

The user passes a single file path. The agent reads that file plus what it needs to understand
the full picture: the feature folder it belongs to, related hooks/schemas, and any existing test.

---

## Phase 0 — Orient

1. Read the target file completely.
2. Locate and read: the feature's `api.ts`/`hooks.ts`/`schemas.ts`, any shared component it uses
   from `components/ui`/`components/layout`, existing `.test.tsx` if any (if one exists, go
   directly to Phase 2).
3. Identify the **public contract** that must NOT change: exported component/hook name and props/
   return type, the route it renders on (if a `page.tsx`), the TanStack Query key(s) it reads/writes.
4. Output a brief orientation table:

```
FILE:        src/features/users/components/UserTable.tsx
TYPE:        Client Component
DEPS:        useUsersQuery, DataTable, Button
SPEC:        missing → will create
CONTRACT:    props { onEdit, onDelete }, query key ['users', filters]
VIOLATIONS:  will diagnose in Phase 1
```

## Phase 1 — Diagnosis

Scan for violations of this project's rules (`rules/typescript.md`, `rules/design-system.md`):
hardcoded colors, missing loading/error states, business logic inside `app/`, form built without
react-hook-form+zod, prop drilling that should be a store/context, missing memoization causing
obvious re-render issues.

## Phase 2 — Characterization Test

If no test exists, create `<Component>.test.tsx` capturing CURRENT behavior exactly (including
known bugs, documented with `// BUG: ...`). Mock the network boundary with MSW
(`src/test/msw/handlers/`), never mock `core/api-client` internals directly. AAA pattern, Spanish
test names describing behavior. Run `pnpm test <file> ` and confirm green against the unmodified code.

## Phase 3 — Refactoring Plan

Present the ordered plan BEFORE touching anything. Each step: what changes, why (which rule/
violation it fixes), contract impact (must be `NONE`).

## Phase 4 — Execute (one step at a time)

Make the change → run the test → report `✓ Step N complete` or diagnose a failure before continuing.
Never proceed with a red test.

## Phase 5 — Final Spec Update

Clean up characterization-test comments that documented now-fixed bugs, verify MSW handlers still
match the refactored calls, run the full test file once more, output a short summary (files
created/modified, tests written, contract unchanged confirmation).

---

## Hard constraints — never violate

- Never change: exported component/hook signature, route path, query key shape, response DTO shape.
- Never move business logic into `app/page.tsx` — it belongs in `features/<dominio>/`.
- Never skip running tests between steps.
- Never use `any` in new code.
- Never call the backend URL directly — always through `core/api-client` → `/api/backend/*`.

## Rules

- @../rules/test.md
- @../rules/typescript.md
- @../rules/design-system.md
