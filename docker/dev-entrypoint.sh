#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

echo "Syncing database schema..."
npx prisma db push

if [ "$SEED_ON_START" = "true" ]; then
  echo "Seeding development data..."
  npm run seed
fi

echo "Starting Next.js development server..."
npm run dev
