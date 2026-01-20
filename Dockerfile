FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy backend source code
COPY backend/ ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3003

ENV PORT=3003

# Start the server
CMD ["npm", "run", "start"]
