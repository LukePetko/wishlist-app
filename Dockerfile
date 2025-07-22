# --- Step 1: Build the app ---
FROM node:20-alpine AS builder

WORKDIR /app

# Set build-time argument
ARG DB_URL
ENV DB_URL=$DB_URL

# Install dependencies
COPY package.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the Next.js app with DB_URL available during build
RUN npm run build


# --- Step 2: Run the app ---
FROM node:20-alpine AS runner

ENV NODE_ENV=production
ENV PORT=9201

WORKDIR /app

# Set runtime env var again just in case (not strictly needed if using .env)
ARG DB_URL
ENV DB_URL=$DB_URL

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 9201

CMD ["npm", "start", "--", "-p", "9201"]

