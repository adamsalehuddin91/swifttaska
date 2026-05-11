import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth()));
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    // Find parent
    const parent = await prisma.parent.findUnique({
      where: { userId: session.user.id },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!parent) {
      return NextResponse.json({ error: 'Parent account not found' }, { status: 404 });
    }

    // Calculate date range for the selected month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    // Fetch attendance records
    const records = await prisma.attendance.findMany({
      where: {
        studentId: parent.studentId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate stats
    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'PRESENT').length,
      absent: records.filter(r => r.status === 'ABSENT').length,
      late: records.filter(r => r.status === 'LATE').length,
      sick: records.filter(r => r.status === 'SICK').length,
      excused: records.filter(r => r.status === 'EXCUSED').length,
      rate: 0,
    };

    stats.rate = stats.total > 0
      ? Math.round((stats.present / stats.total) * 100)
      : 0;

    return NextResponse.json({
      records,
      stats,
      studentName: `${parent.student.firstName} ${parent.student.lastName}`,
    });
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance data' },
      { status: 500 }
    );
  }
}
