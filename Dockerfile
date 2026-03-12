# Stage 1: Build the application
FROM node:24 AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Serve the static files with BusyBox
FROM busybox:latest

# Create a non-root user
RUN addgroup -g 1001 babylon && \
    adduser -D -u 1001 -G babylon babylon

# Create directory for static files
RUN mkdir -p /home/babylon/www && \
    chown -R babylon:babylon /home/babylon

# Copy built files from builder stage
COPY --from=builder --chown=babylon:babylon /app/dist /home/babylon/www

# Switch to non-root user
USER babylon

# Set working directory
WORKDIR /home/babylon/www

# Expose port
EXPOSE 8080

# Start BusyBox httpd server
CMD ["httpd", "-f", "-v", "-p", "8080", "-h", "/home/babylon/www"]