# ─── Stage 1: Build / Install Dependencies ───────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package manifests and install ONLY production deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine

# Install wget for HEALTHCHECK
RUN apk add --no-cache wget

WORKDIR /app

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy production node_modules from deps stage
COPY --chown=appuser:appgroup --from=deps /app/node_modules ./node_modules

# Copy application source
COPY --chown=appuser:appgroup . .

# Expose backend port
EXPOSE 5000

# Health check — polls /api/health every 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]
