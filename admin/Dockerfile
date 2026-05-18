# ─── Stage 1: Build Admin React Application ───────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests first for better Docker layer caching
COPY package*.json ./

# Install all dependencies (including devDeps needed for build)
RUN npm ci && npm cache clean --force

# Copy full source and build
COPY . .
RUN npm run build

# ─── Stage 2: Serve with Nginx (lightweight production image) ─────────────────
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built React admin app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (SPA routing + API proxy to backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
