# Multi-Stage Production Dockerfile for YojnaSetu Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies and generate Prisma client
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

ENV DATABASE_URL="file:./dev.db"

RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Final Production Image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:./dev.db"

# Copy node modules and backend assets
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY backend/package*.json ./
COPY backend/src ./src

# Ensure uploads directory exists with write permissions
RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 5000

CMD ["npm", "start"]
