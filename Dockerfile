# Build:  docker build --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.example.com -t document-assistant-fe .
# Run:    docker run -d --init -p 80:3000 --memory=1g --restart unless-stopped document-assistant-fe

# ---- 1. Install dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# ---- 2. Build the app ----
FROM node:22-alpine AS builder
WORKDIR /app

# NEXT_PUBLIC_* values are baked into the bundle at build time
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
# Produce a minimal standalone server (see next.config.ts)
ENV NEXT_OUTPUT=standalone

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- 3. Run the app ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# Keep Node's memory well under the 2 GiB of a t3.small
ENV NODE_OPTIONS=--max-old-space-size=768

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
