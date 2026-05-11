import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find parent by userId
    const parent = await prisma.parent.findUnique({
      where: { userId: session.user.id },
      include: {
        student: {
          include: {
            class: {
              include: {
                teacher: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            attendances: {
              orderBy: { date: 'desc' },
            },
            fees: {
              where: {
                status: {
                  in: ['PENDING', 'PARTIAL', 'OVERDUE'],
                },
              },
            },
            activities: {
              include: {
                activity: true,
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 5,
            },
          },
        },
      },
    });

    if (!parent) {
      return NextResponse.json({ error: 'Parent account not found' }, { status: 404 });
    }

    // Calculate attendance statistics
    const attendances = parent.student.attendances;
    const totalAttendance = attendances.length;
    const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
    const absentCount = attendances.filter(a => a.status === 'ABSENT').length;
    const attendanceRate = totalAttendance > 0
      ? Math.round((presentCount / totalAttendance) * 100)
      : 0;

    // Calculate fees
    const fees = parent.student.fees;
    const pendingFees = fees.reduce((sum, fee) => {
      if (fee.status === 'PENDING' || fee.status === 'PARTIAL') {
        return sum + (fee.amount - (fee.paidAmount || 0));
      }
      return sum;
    }, 0);

    const overdueFees = fees
      .filter(fee => fee.status === 'OVERDUE')
      .reduce((sum, fee) => sum + (fee.amount - (fee.paidAmount || 0)), 0);

    // Get recent activities
    const recentActivities = parent.student.activities.map(sa => ({
      id: sa.activity.id,
      name: sa.activity.name,
      date: sa.activity.date,
      type: sa.activity.type,
    }));

    // Get unread messages count
    const unreadMessages = await prisma.message.count({
      where: {
        recipientId: session.user.id,
        isRead: false,
      },
    });

    // Get recent announcements
    const announcements = await prisma.announcement.findMany({
      where: {
        AND: [
          {
            OR: [
              { targetAudience: 'ALL' },
              { targetAudience: 'PARENTS' },
              { classId: parent.student.classId },
            ],
          },
          {
            OR: [
              { expiresAt: null },
              { expiresAt: { gt: new Date() } },
            ],
          },
        ],
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 5,
    });

    return NextResponse.json({
      parent: {
        id: parent.id,
        firstName: parent.firstName,
        lastName: parent.lastName,
        relationship: parent.relationship,
        student: {
          id: parent.student.id,
          studentId: parent.student.studentId,
          firstName: parent.student.firstName,
          lastName: parent.student.lastName,
          dateOfBirth: parent.student.dateOfBirth,
          class: parent.student.class,
        },
      },
      attendance: {
        total: totalAttendance,
        present: presentCount,
        absent: absentCount,
        rate: attendanceRate,
      },
      fees: {
        pending: pendingFees,
        overdue: overdueFees,
        total: pendingFees + overdueFees,
      },
      recentActivities,
      unreadMessages,
      announcements,
    });
  } catch (error) {
    console.error('Error fetching parent data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parent data' },
      { status: 500 }
    );
  }
}
