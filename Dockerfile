# === STAGE 1: Base Image ===
FROM node:22-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./

# === STAGE 2: Dependencies ===
FROM base AS deps
RUN npm ci --legacy-peer-deps

# === STAGE 3: Builder (Kompilasi Kode) ===
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generate Prisma Client sebelum melakukan build Next.js
RUN npx prisma generate
RUN npm run build

# === STAGE 4: Production Runner (Lingkungan Staging/Prod) ===
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3001

# Salin hasil kompilasi produksi murni
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

EXPOSE 3001

# Perintah jalannya langsung menggunakan server produksi murni Next.js
CMD ["npm", "run", "start"]