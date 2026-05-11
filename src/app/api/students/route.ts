import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      include: {
        class: {
          include: {
            teacher: true
          }
        },
        fees: {
          where: {
            status: 'PENDING'
          }
        },
        attendances: {
          where: {
            date: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      studentId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      religion,
      medicalInfo,
      allergies,
      emergencyContact,
      address,
      city,
      state,
      postcode,
      fatherName,
      fatherPhone,
      fatherEmail,
      fatherOccupation,
      motherName,
      motherPhone,
      motherEmail,
      motherOccupation,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianRelationship,
      classId
    } = body;

    // Check if student ID already exists
    const existingStudent = await prisma.student.findUnique({
      where: { studentId }
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student ID already exists' },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        studentId,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        nationality,
        religion,
        medicalInfo,
        allergies,
        emergencyContact,
        address,
        city,
        state,
        postcode,
        fatherName,
        fatherPhone,
        fatherEmail,
        fatherOccupation,
        motherName,
        motherPhone,
        motherEmail,
        motherOccupation,
        guardianName,
        guardianPhone,
        guardianEmail,
        guardianRelationship,
        classId,
        createdById: user.id
      },
      include: {
        class: {
          include: {
            teacher: true
          }
        }
      }
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}