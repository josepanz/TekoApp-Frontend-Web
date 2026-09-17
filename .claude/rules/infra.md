# Infrastructure rules

- Dockerfile: multi-stage, `node:22-alpine` base, `USER node` antes del `CMD`, build con
  `output: 'standalone'` de Next.js — mismo estándar que `TekoApp-Backend`.
- Pipelines: stages = lint → test (unit) → build → docker (validate) → deploy, igual patrón que
  `TekoApp-Backend/.github/workflows/pipeline.yml`. Playwright e2e corre en un job separado, no
  bloquea el pipeline principal si el backend de test no está disponible en CI todavía.
- Secrets: nunca en el repo ni en ConfigMap — siempre en GitHub Secrets / Secret de K8s. Especial
  cuidado con `BACKEND_CLIENT_SECRET` y `BACKEND_JWT_PUBLIC_KEY` (aunque sea una clave pública, no
  hay razón para commitearla — vive en env vars igual que el resto).
- Versionado: `semantic-release` con las mismas 3 ramas que el backend (`develop`/`qa`/`master`,
  prerelease en las dos primeras) — mantiene el número de versión del frontend legible junto al
  del backend en los deploys.
- Despliegue: Docker self-hosted (K3s/ArgoCD, igual que el backend) como target primario, pero sin
  nada Vercel-only en el código — el mismo build de `output: 'standalone'` corre también en Vercel
  (conectando el repo, ignora el Dockerfile) o en cualquier host Node/AWS si hace falta cambiar de
  plataforma después.
- **PRs de promoción (`develop`→`qa`, `qa`→`master`) NUNCA van con squash-merge por default de
  GitHub** — mergear con "Merge pull request" (merge commit, ya permitido en el repo) o con
  rebase. Incidente 2026-09-17 en PR #33 (`qa`→`master`): el squash concatenó en el cuerpo del
  commit resultante los mensajes de todos los commits absorbidos, incluidos varios
  `chore(release): ... [skip ci]`. GitHub Actions salta el workflow entero cuando encuentra
  `[skip ci]` en cualquier parte del mensaje del **commit HEAD del push** (confirmado: no es algo
  configurable desde el workflow, es un chequeo de la plataforma anterior a evaluar el YAML, así
  que "que el workflow solo respete `[skip ci]` en la primera línea" no es una opción real). El
  pipeline de `master` quedó sin correr desde el 15/09 hasta que se disparó el fix manualmente.
  Además, aunque el pipeline hubiera corrido, `semantic-release` tampoco habría detectado ningún
  release: el subject del squash (título del PR) no tiene formato Conventional Commits y no había
  footer `BREAKING CHANGE:` — verificado con un dry-run local
  (`npx semantic-release --dry-run --no-ci` sobre un worktree de `origin/master`) que devolvió
  "no hay cambios relevantes, no se libera ninguna versión nueva".
  - Arreglo de fondo aplicado: `squash_merge_commit_title`/`squash_merge_commit_message` del repo
    (GitHub → Settings → Pull Requests) cambiados de `COMMIT_OR_PR_TITLE`/`COMMIT_MESSAGES` a
    `PR_TITLE`/`PR_BODY`. Así, si alguna vez se squashea por error, el commit resultante usa
    exactamente el título y la descripción del PR (bajo control humano) en vez de concatenar los
    mensajes de los commits absorbidos — nunca vuelve a arrastrar un `[skip ci]` ajeno ni un
    subject no convencional. Si el PR de promoción se abre igual, su título debe seguir el formato
    `tipo(scope): descripción` (con `!` o footer `BREAKING CHANGE:` si corresponde) porque, con
    squash, ese título es el único commit que `semantic-release` va a poder analizar en `master`.
  - Ruleset de "historia lineal" en `master`: NO existe actualmente ni a nivel de repo
    (`GET /repos/.../rulesets` devuelve `[]`) ni como branch protection clásica (`master` figura
    como "Branch not protected"). `allow_merge_commit` sigue en `true`. No hay nada que hoy exija
    squash — si en algún momento se agrega esa regla, hay que revisar de nuevo esta convención.
