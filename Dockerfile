# =============================================================================
# Dockerfile for Internship Tracking Portal - Python/Flask Backend
# =============================================================================
# Multi-stage / production-ready container definition
# Optimized for: Azure Container Apps, minimal image size, high security
# =============================================================================

# Step 1: Base Image
# We use python:3.11-slim (Debian bookworm slim).
# Why? Standard python:3.11 is ~1 GB; slim is ~150 MB.
# It contains the minimal OS and C libraries needed to run Python and OpenSSL.
FROM python:3.11-slim

# Step 2: Environment Variables
# PYTHONDONTWRITEBYTECODE=1: Disables writing .pyc files (saves image space)
# PYTHONUNBUFFERED=1: Flushes stdout/stderr directly so logs appear in real-time
#                     in Azure Log Analytics / Container Apps console without buffering
# PORT: Default listening port for the application container
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5000

# Step 3: Working Directory
WORKDIR /app

# Step 4: Layer Caching for Dependencies
# Docker builds in sequential cached layers. By copying ONLY requirements.txt
# first, Docker caches the pip install layer. If you modify your Python code later,
# Docker will reuse the cached dependency layer and rebuild in 2 seconds!
COPY requirements.txt .

# Step 5: Install Python Dependencies
# --no-cache-dir keeps the final image lightweight by omitting pip cache files
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Step 6: Copy Application Source Code
# Copies the backend files into the working directory /app
COPY backend/ /app/

# Step 7: Create Uploads Directory & Set Permissions
# The backend expects an 'uploads' directory at sibling or relative level
RUN mkdir -p /app/uploads && \
    mkdir -p /uploads

# Step 8: Security - Non-Root User
# Running containers as 'root' is a security anti-pattern in production.
# We create a dedicated system user 'appuser' with limited privileges.
RUN useradd --create-home appuser && \
    chown -R appuser:appuser /app /uploads

# Switch from root to non-root user
USER appuser

# Step 9: Expose Port
# Documents that the container process listens on port 5000
EXPOSE 5000

# Step 10: Entrypoint / Execution Command
# Use Gunicorn as the production WSGI HTTP server (Flask's built-in server is dev-only).
# -b 0.0.0.0:${PORT}: Listens on all network interfaces
# -w 2: 2 worker processes (ideal for 0.25 vCPU Azure Container Apps)
# -t 2: 2 threads per worker for handling concurrent I/O
# --timeout 60: 60s timeout for database queries
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 2 --threads 2 --timeout 60 app:app"]
