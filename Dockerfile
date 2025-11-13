# syntax=docker/dockerfile:1

# Stage 1: Install all dependencies including dev dependencies for building
FROM node:20-alpine AS deps

# Ensure reproducible environment and faster installs
WORKDIR /app

# Copy package manifests separately to leverage Docker layer caching
COPY package.json package-lock.json* ./

# Install exact dependency tree as locked in package-lock
RUN npm ci

# Stage 2: Build the Next.js application
FROM node:20-alpine AS builder
WORKDIR /app

# Reuse installed dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application source code for building
# Adjust the list below to include any additional top-level files your app needs
COPY next.config.js .
COPY tsconfig.json .
COPY tailwind.config.* ./
COPY postcss.config.* ./
COPY package.json package-lock.json* ./
COPY public ./public
COPY src ./src

# Build the production-ready Next.js output
RUN npm run build

# Stage 3: Install only production dependencies and run the app
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only the files needed at runtime
COPY package.json package-lock.json* ./

# Install only production dependencies for a smaller final image
RUN npm ci --omit=dev

# Copy the built Next.js app from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# If you generate a standalone output (next.config.js -> output: 'standalone'), uncomment:
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["npm", "run", "start"]
