# =============================================================================
# Multi-Stage Dockerfile for React + Vite Frontend
# =============================================================================
# Stage 1: Build the React static assets with Node 20
# Stage 2: Serve the compiled static assets with ultra-lightweight Nginx Alpine
# Result: ~25 MB production image with extreme performance and minimal attack surface
# =============================================================================

# --- Stage 1: Build Environment ---
FROM node:20-alpine AS builder

WORKDIR /app

# Layer caching: install dependencies first
COPY package*.json ./
RUN npm ci

# Copy frontend source code & build configurations
COPY . .

# Build Vite application (creates /app/dist)
# Reads VITE_API_URL from .env.production
RUN npm run build

# --- Stage 2: Production Web Server ---
FROM nginx:alpine

# Copy custom Nginx configuration with SPA routing (try_files -> index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
