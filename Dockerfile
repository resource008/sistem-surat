FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# 1. Salin berkas package manager
COPY package.json package-lock.json ./

# 2. Instal semua dependensi (termasuk Prisma CLI)
RUN npm ci --legacy-peer-deps

# 3. Salin folder prisma secara spesifik agar skema wajib terbaca
COPY prisma ./prisma/

# 4. Generate Prisma Client sebelum kompilasi Next.js
RUN npx prisma generate

# 5. Salin sisa kode proyek dan build aplikasi
COPY . .
RUN npm run build

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

CMD ["npm", "run", "start"]