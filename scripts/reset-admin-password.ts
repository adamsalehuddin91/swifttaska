import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    // Find admin user
    const admin = await prisma.user.findFirst({
      where: {
        email: 'adamsalehuddin91@gmail.com'
      }
    });

    if (!admin) {
      console.log('❌ Admin user not found!');
      return;
    }

    // Reset to default password
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hashedPassword }
    });

    console.log('✅ Admin password reset successfully!');
    console.log('');
    console.log('📧 Email: adamsalehuddin91@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('');
    console.log('⚠️  Please change this password after logging in!');

  } catch (error) {
    console.error('❌ Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
