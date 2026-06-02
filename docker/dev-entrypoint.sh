#!/bin/sh
set -e

echo "[entrypoint] Generating Prisma client..."
npx prisma generate

echo "[entrypoint] Syncing database schema..."
npx prisma db push

if [ "$SEED_ON_START" = "true" ]; then
  echo "[entrypoint] Seeding development data..."
  npm run seed
fi

echo "[entrypoint] Starting Next.js development server..."
exec npm run dev