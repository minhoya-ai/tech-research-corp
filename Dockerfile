# Production Dockerfile for Aetheris AI Research Portal
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code and assets
COPY server.js ./
COPY public ./public

# Expose backend port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

# Start server
CMD ["node", "server.js"]
