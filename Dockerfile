# --- Step 1: Build the app ---
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time config (non-secrets only)
ARG S3_ENDPOINT
ARG S3_PORT

ENV S3_ENDPOINT=$S3_ENDPOINT
ENV S3_PORT=$S3_PORT

# Install deps and build
COPY package.json ./
RUN npm install
COPY . .

RUN npm run build

# --- Step 2: Runtime container ---
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV PORT=9201

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 9201
CMD ["npm", "start", "--", "-p", "9201"]
