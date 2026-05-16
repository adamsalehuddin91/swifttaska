import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const user = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'ADMIN',
      }
    });

    console.log('Admin user created:', user.email);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();