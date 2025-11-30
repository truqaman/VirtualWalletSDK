# Build stage for frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Build stage for backend
FROM node:18-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Final stage - production image
FROM node:18-alpine
WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Copy production dependencies
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package*.json ./

# Copy frontend build output
COPY --from=frontend-builder /app/dist ./dist

# Copy server source code
COPY server ./server

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Set default PORT for Cloud Run (8080)
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Health check - uses PORT env var
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 8080) + '/api/wallet', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Run the app in production mode
CMD ["npm", "start"]
