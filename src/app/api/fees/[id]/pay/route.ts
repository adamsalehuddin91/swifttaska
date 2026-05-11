import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(
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
    const { paidAmount, paymentMethod, notes } = body;

    // Get the fee first
    const { id } = await params;
    const fee = await prisma.fee.findUnique({
      where: { id }
    });

    if (!fee) {
      return NextResponse.json({ error: 'Fee not found' }, { status: 404 });
    }

    const paidAmountFloat = parseFloat(paidAmount);
    const totalPaid = (fee.paidAmount || 0) + paidAmountFloat;

    let newStatus: string;
    if (totalPaid >= fee.amount) {
      newStatus = 'PAID';
    } else if (totalPaid > 0) {
      newStatus = 'PARTIAL';
    } else {
      newStatus = fee.status;
    }

    const updatedFee = await prisma.fee.update({
      where: { id },
      data: {
        paidAmount: totalPaid,
        paidDate: new Date(),
        paymentMethod,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: newStatus as any,
        notes: notes || fee.notes
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

    return NextResponse.json(updatedFee);
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}