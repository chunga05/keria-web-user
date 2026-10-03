# Multi-stage Dockerfile for Next.js (User Web - KeriaWeb)
FROM node:22-alpine AS base

# Install libc6-compat for alpine compatibility
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm@latest

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build arguments for public variables (Next.js inlines NEXT_PUBLIC_* at build time)
ARG NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
ARG NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
ARG NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-placeholder.r2.dev
ARG NEXT_PUBLIC_ENABLE_SCHEDULE=false
ARG NEXT_PUBLIC_ENABLE_WELCOME_PROJECT=false
ARG NEXT_PUBLIC_ENABLE_STREAM_DONATION=true
ARG NEXT_PUBLIC_ENABLE_HANDBOOK=false
ARG NEXT_PUBLIC_ENABLE_ACHIEVEMENTS=false
ARG NEXT_PUBLIC_ENABLE_SUPPORTING_PROJECT=false
ARG NEXT_PUBLIC_ENABLE_WISHES=true
ARG NEXT_PUBLIC_ENABLE_DEMO_FEATURE=false

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_ADMIN_URL=$NEXT_PUBLIC_ADMIN_URL
ENV NEXT_PUBLIC_R2_PUBLIC_URL=$NEXT_PUBLIC_R2_PUBLIC_URL
ENV NEXT_PUBLIC_ENABLE_SCHEDULE=$NEXT_PUBLIC_ENABLE_SCHEDULE
ENV NEXT_PUBLIC_ENABLE_WELCOME_PROJECT=$NEXT_PUBLIC_ENABLE_WELCOME_PROJECT
ENV NEXT_PUBLIC_ENABLE_STREAM_DONATION=$NEXT_PUBLIC_ENABLE_STREAM_DONATION
ENV NEXT_PUBLIC_ENABLE_HANDBOOK=$NEXT_PUBLIC_ENABLE_HANDBOOK
ENV NEXT_PUBLIC_ENABLE_ACHIEVEMENTS=$NEXT_PUBLIC_ENABLE_ACHIEVEMENTS
ENV NEXT_PUBLIC_ENABLE_SUPPORTING_PROJECT=$NEXT_PUBLIC_ENABLE_SUPPORTING_PROJECT
ENV NEXT_PUBLIC_ENABLE_WISHES=$NEXT_PUBLIC_ENABLE_WISHES
ENV NEXT_PUBLIC_ENABLE_DEMO_FEATURE=$NEXT_PUBLIC_ENABLE_DEMO_FEATURE

# Dummy placeholders for server secrets during build-time route evaluation (overridden at runtime)
ENV SUPABASE_SERVICE_ROLE_KEY=dummy-build-service-role-key
ENV JWT_SECRET=dummy-build-jwt-secret-at-least-32-chars
ENV USER_JWT_SECRET=dummy-build-user-jwt-secret-32-chars

RUN pnpm run build

# Production runner image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
