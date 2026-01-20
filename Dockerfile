FROM node:20-slim

# Install OpenSSL and other dependencies
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install dependencies (including dev dependencies for tsx)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy shared types
COPY shared/ ../shared/

# Copy backend source code
COPY backend/ ./

# Expose port
EXPOSE 3003

ENV PORT=3003
ENV NODE_ENV=production

# Start the server directly with tsx (skip TypeScript compilation)
CMD ["npx", "tsx", "src/server.ts"]
