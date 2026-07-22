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
