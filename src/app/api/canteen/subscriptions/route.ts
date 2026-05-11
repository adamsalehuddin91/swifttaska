import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch all active meal subscriptions, including student details (and their allergies)
    const subscriptions = await prisma.mealSubscription.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            allergies: true,
            class: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: {
        student: { firstName: 'asc' }
      }
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch meal subscriptions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { studentId, startDate, endDate, notes } = body;

    const subscription = await prisma.mealSubscription.upsert({
      where: { studentId },
      update: {
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: 'ACTIVE',
        notes
      },
      create: {
        studentId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        notes
      },
      include: {
        student: {
          select: { firstName: true, allergies: true }
        }
      }
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Failed to create subscription:', error);
    return NextResponse.json({ error: 'Failed to update meal subscription' }, { status: 500 });
  }
}
