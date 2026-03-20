#!/bin/sh
set -e

echo "🚀 Starting auth-service..."

cd services/auth-service

# Run migrations
npx prisma migrate deploy

pnpm build

exec node dist/main.js