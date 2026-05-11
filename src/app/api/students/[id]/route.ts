import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        class: {
          include: {
            teacher: true
          }
        },
        fees: {
          orderBy: { dueDate: 'desc' }
        },
        attendances: {
          orderBy: { date: 'desc' },
          take: 30,
          include: {
            class: true,
            takenBy: true
          }
        },
        activities: {
          include: {
            activity: {
              include: {
                class: true,
                createdBy: true
              }
            }
          },
          orderBy: {
            activity: {
              date: 'desc'
            }
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const student = await prisma.student.update({
      where: { id },
      data: {
        ...body,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined
      },
      include: {
        class: {
          include: {
            teacher: true
          }
        }
      }
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Instead of deleting, mark as inactive
    const { id } = await params;
    await prisma.student.update({
      where: { id },
      data: {
        status: 'INACTIVE'
      }
    });

    return NextResponse.json({ message: 'Student deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating student:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate student' },
      { status: 500 }
    );
  }
}