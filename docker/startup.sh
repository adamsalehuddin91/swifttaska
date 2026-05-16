#!/bin/sh
set -e

echo "🚀 SwiftTaska starting..."

echo "⏳ Running migrations..."
node /app/node_modules/prisma/build/index.js migrate deploy

echo "🌱 Seeding demo users..."
node /app/prisma/seed.mjs || echo "Seed skipped (already seeded)"

echo "✅ Starting Next.js on port 3000..."
exec node server.js
