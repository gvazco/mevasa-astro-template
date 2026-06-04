FROM node:22-alpine AS build

WORKDIR /app

# Build args — Coolify las pasa desde las env vars de la UI
ARG PUBLIC_ASSETS
ARG API_ITEMS
ARG HOME_URL

# PUBLIC_ASSETS se inlinea en el bundle en build-time
ENV PUBLIC_ASSETS=$PUBLIC_ASSETS

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ----------

FROM node:22-alpine

WORKDIR /app

# Usuario no-root (Coolify best practice)
RUN addgroup --system app && adduser --system --ingroup app app

ENV HOST=0.0.0.0
ENV PORT=4321

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Healthcheck para Coolify
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:${PORT}/ || exit 1

EXPOSE 4321

USER app

CMD ["node", "./dist/server/entry.mjs"]
