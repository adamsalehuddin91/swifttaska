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
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        },
        classes: {
          include: {
            students: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                studentId: true,
                status: true
              }
            }
          }
        },
        attendances: {
          take: 50,
          orderBy: { date: 'desc' },
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
        },
        activities: {
          orderBy: { date: 'desc' },
          include: {
            class: {
              select: {
                id: true,
                name: true
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
            }
          }
        }
      }
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher' },
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
    const { salary, hireDate, dateOfBirth, ...otherFields } = body;

    const { id } = await params;
    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        ...otherFields,
        salary: salary ? parseFloat(salary) : null,
        hireDate: hireDate ? new Date(hireDate) : undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to update teacher' },
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
    await prisma.teacher.update({
      where: { id },
      data: {
        status: 'INACTIVE'
      }
    });

    return NextResponse.json({ message: 'Teacher deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating teacher:', error);
    return NextResponse.json(
      { error: 'Failed to deactivate teacher' },
      { status: 500 }
    );
  }
}