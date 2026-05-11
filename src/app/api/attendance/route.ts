import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const date = searchParams.get('date');
    const studentId = searchParams.get('studentId');

    const whereClause: Prisma.AttendanceWhereInput = {};

    if (classId) whereClause.classId = classId;
    if (studentId) whereClause.studentId = studentId;
    if (date) {
      const targetDate = new Date(date);
      whereClause.date = {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lt: new Date(targetDate.setHours(23, 59, 59, 999))
      };
    }

    const attendances = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        takenBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      },
      orderBy: [
        { date: 'desc' },
        { student: { firstName: 'asc' } }
      ]
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
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
      where: { email: session.user.email },
      include: { teacher: true }
    });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { attendanceRecords } = body; // Array of attendance records

    if (!Array.isArray(attendanceRecords)) {
      return NextResponse.json(
        { error: 'attendanceRecords must be an array' },
        { status: 400 }
      );
    }

    // Get teacher ID
    let teacherId = user.teacher?.id;
    if (user.role === 'ADMIN' && !teacherId) {
      // If admin doesn't have teacher profile, use the first available teacher
      const firstTeacher = await prisma.teacher.findFirst();
      teacherId = firstTeacher?.id;
    }

    if (!teacherId) {
      return NextResponse.json(
        { error: 'No teacher found for attendance recording' },
        { status: 400 }
      );
    }

    const createdAttendances = await Promise.all(
      attendanceRecords.map(async (record: { studentId: string; classId: string; date: string; status: string; notes?: string }) => {
        const { studentId, classId, date, status, notes } = record;

        // Check if attendance already exists for this student and date
        const existingAttendance = await prisma.attendance.findUnique({
          where: {
            studentId_date: {
              studentId,
              date: new Date(date)
            }
          }
        });

        if (existingAttendance) {
          // Update existing attendance
          return prisma.attendance.update({
            where: { id: existingAttendance.id },
            data: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              status: status as any,
              notes,
              takenById: teacherId!
            },
            include: {
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  studentId: true
                }
              },
              class: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        } else {
          // Create new attendance
          return prisma.attendance.create({
            data: {
              studentId,
              classId,
              date: new Date(date),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              status: status as any,
              notes,
              takenById: teacherId!
            },
            include: {
              student: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  studentId: true
                }
              },
              class: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        }
      })
    );

    return NextResponse.json(createdAttendances, { status: 201 });
  } catch (error) {
    console.error('Error creating attendance:', error);
    return NextResponse.json(
      { error: 'Failed to create attendance' },
      { status: 500 }
    );
  }
}