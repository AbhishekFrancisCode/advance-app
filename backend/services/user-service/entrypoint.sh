#!/bin/sh
set -e

echo "🚀 Starting user-service..."

sleep 5

cd services/user-service

# Run migrations
npx prisma migrate deploy

pnpm build

exec node dist/main.js