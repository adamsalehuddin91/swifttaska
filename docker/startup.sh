#!/bin/sh
set -e

echo "🚀 SwiftTaska starting..."

echo "⏳ Running migrations..."
npx prisma migrate deploy

echo "🌱 Seeding demo users..."
node prisma/seed.mjs || echo "Seed skipped (already seeded)"

echo "✅ Starting Next.js on port 3000..."
exec node server.js
