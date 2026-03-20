#!/bin/sh
set -e

echo "🚀 Starting notification-service..."

sleep 5

cd services/notification-service

# Run migrations
npx prisma migrate deploy

pnpm build

exec node dist/main.js