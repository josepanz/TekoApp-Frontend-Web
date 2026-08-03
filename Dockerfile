# Multi-stage build — Next.js standalone output. Mismo estándar que TekoApp-Backend
# (node:22-alpine, USER node antes de CMD). Portable: el mismo build corre en Vercel/AWS también.

FROM node:22-alpine AS base
# Fijo a pnpm 10 (misma major que .github/workflows/pipeline.yml, pnpm/action-setup@v4
# version: 10) - sin esto, corepack resuelve "latest" y puede saltar a una major nueva
# con cambios de comportamiento no probados acá (ej. v11 volvio fatal el chequeo de
# build scripts no aprobados).
RUN corepack enable pnpm && corepack prepare pnpm@10.34.5 --activate

# ---- deps ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm tokens:build && pnpm build

# ---- runner ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3001
CMD ["node", "server.js"]
