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
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const whereClause: Prisma.FeeWhereInput = {};

    if (studentId) whereClause.studentId = studentId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (status) whereClause.status = status as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (type) whereClause.type = type as any;

    const fees = await prisma.fee.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
            class: {
              select: {
                name: true,
                level: true
              }
            }
          }
        }
      },
      orderBy: [
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(fees);
  } catch (error) {
    console.error('Error fetching fees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fees' },
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
    const { studentId, type, description, amount, dueDate, notes } = body;

    const fee = await prisma.fee.create({
      data: {
        studentId,
        type,
        description,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        notes
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
            class: {
              select: {
                name: true,
                level: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    console.error('Error creating fee:', error);
    return NextResponse.json(
      { error: 'Failed to create fee' },
      { status: 500 }
    );
  }
}