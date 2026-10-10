# Multi-stage lightweight Node.js container
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install production dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy application files
COPY server.js ./
COPY public ./public

EXPOSE 4000

USER node

CMD ["node", "server.js"]
