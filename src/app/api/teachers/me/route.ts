import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find teacher by userId
    const teacher = await prisma.teacher.findFirst({
      where: {
        userId: session.user.id
      },
      include: {
        classes: {
          include: {
            _count: {
              select: {
                students: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher profile not found' }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    return NextResponse.json({ error: 'Failed to fetch teacher profile' }, { status: 500 });
  }
}
