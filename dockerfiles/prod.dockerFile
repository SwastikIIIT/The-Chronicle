# --- Stage 1: Base ---
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# --- Stage 2: Dependencies ---
# Only install dependencies here to leverage Docker layer caching
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- Stage 3: Builder ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .  
RUN pnpm build


# --- Stage 4: Runner (Production) ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Only copy the necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next 
COPY --from=builder /app/public ./public 
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["pnpm", "start"] 