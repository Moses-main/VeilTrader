# Multi-stage build for VeilTrader UI
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
COPY ui-package.json ./ui-package.json

# Install dependencies
RUN npm install --production

# Copy source code
COPY src ./src
COPY public ./public

# Build stage for production
FROM node:20-alpine AS production

WORKDIR /app

# Copy built files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/ui-package.json ./

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/ui/server.js"]
