import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');
  const hash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@swifttaska.com' },
    update: {},
    create: { email: 'admin@swifttaska.com', name: 'System Admin', password: hash, role: 'ADMIN' },
  });

  await prisma.user.upsert({
    where: { email: 'sarah.t@swifttaska.com' },
    update: {},
    create: { email: 'sarah.t@swifttaska.com', name: 'Sarah Thompson', password: hash, role: 'TEACHER' },
  });

  console.log('✅ Demo users seeded: admin@swifttaska.com / password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
