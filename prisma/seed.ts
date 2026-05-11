import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@swifttaska.com' },
    update: {},
    create: {
      email: 'admin@swifttaska.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created');

  // 2. Create Teachers
  const teacherUser1 = await prisma.user.upsert({
    where: { email: 'sarah.t@swifttaska.com' },
    update: {},
    create: {
      email: 'sarah.t@swifttaska.com',
      name: 'Sarah Thompson',
      password: hashedPassword,
      role: 'TEACHER',
      teacher: {
        create: {
          employeeId: 'T001',
          firstName: 'Sarah',
          lastName: 'Thompson',
          dateOfBirth: new Date('1990-05-15'),
          gender: 'FEMALE',
          nationality: 'Malaysian',
          phone: '+60123456789',
          email: 'sarah.t@swifttaska.com',
          address: '123 Teacher St',
          city: 'Kuala Lumpur',
          state: 'KL',
          postcode: '50000',
          position: 'Lead Pre-K Teacher',
          hireDate: new Date('2022-01-10'),
          createdById: admin.id,
        }
      }
    }
  });

  const teacher1 = await prisma.teacher.findUnique({ where: { employeeId: 'T001' } });
  console.log('✅ Teachers created');

  // 3. Create Classes
  const class1 = await prisma.class.create({
    data: {
      name: 'Bumblebees',
      level: 'Pre-K',
      capacity: 15,
      academicYear: '2024/2025',
      teacherId: teacher1?.id,
    }
  });

  const class2 = await prisma.class.create({
    data: {
      name: 'Ladybugs',
      level: 'Nursery',
      capacity: 10,
      academicYear: '2024/2025',
    }
  });
  console.log('✅ Classes created');

  // 4. Create Students and Parents
  for (let i = 1; i <= 5; i++) {
    await prisma.student.create({
      data: {
        studentId: `S202400${i}`,
        firstName: `Child${i}`,
        lastName: 'Doe',
        dateOfBirth: new Date(`2020-0${i}-15`),
        gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
        nationality: 'Malaysian',
        address: '456 Parent Avenue',
        city: 'Kuala Lumpur',
        state: 'KL',
        postcode: '50000',
        fatherName: 'John Doe',
        fatherPhone: '+60199998888',
        motherName: 'Jane Doe',
        motherPhone: '+60188889999',
        classId: i <= 3 ? class1.id : class2.id,
        createdById: admin.id,
        fees: {
          create: {
            type: 'TUITION',
            description: 'Monthly Tuition Fee - Next Month',
            amount: 500.00,
            dueDate: new Date(Date.now() + 86400000 * 10), // Due in 10 days
            status: 'PENDING'
          }
        }
      }
    });
  }
  console.log('✅ Students & Fees created');
  
  // 5. Create Leads
  await prisma.lead.create({
    data: {
      parentName: 'Alice Wong',
      childName: 'Lucas Wong',
      phone: '+60111222333',
      email: 'alice@example.com',
      status: 'NEW',
    }
  });
  await prisma.lead.create({
    data: {
      parentName: 'Bob Smith',
      childName: 'Emma Smith',
      phone: '+60222333444',
      email: 'bob@example.com',
      status: 'TOUR_SCHEDULED',
    }
  });
  console.log('✅ Admission Leads created');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
