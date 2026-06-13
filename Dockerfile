FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npm run build

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

CMD ["npm", "run", "start"]