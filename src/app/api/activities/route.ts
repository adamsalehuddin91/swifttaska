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
    const type = searchParams.get('type');
    const upcoming = searchParams.get('upcoming');

    const whereClause: Prisma.ActivityWhereInput = {};

    if (classId) whereClause.classId = classId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (type) whereClause.type = type as any;
    if (upcoming === 'true') {
      whereClause.date = {
        gte: new Date()
      };
    }

    const activities = await prisma.activity.findMany({
      where: whereClause,
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        },
        participants: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentId: true
              }
            }
          }
        },
        _count: {
          select: {
            participants: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
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

    // Get teacher ID
    let teacherId = user.teacher?.id;
    if (user.role === 'ADMIN' && !teacherId) {
      // If admin doesn't have teacher profile, use the first available teacher
      const firstTeacher = await prisma.teacher.findFirst();
      teacherId = firstTeacher?.id;
    }

    if (!teacherId) {
      return NextResponse.json(
        { error: 'No teacher found for activity creation' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, type, date, duration, location, maxParticipants, classId } = body;

    const activity = await prisma.activity.create({
      data: {
        name,
        description,
        type,
        date: new Date(date),
        duration: duration ? parseInt(duration) : null,
        location,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        classId,
        createdById: teacherId
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true
          }
        }
      }
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}