import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { studentId, scannedByUserId } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 });
    }

    // Today's boundaries
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Find student to get their class
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { class: true }
    });

    if (!student || !student.classId) {
       return NextResponse.json({ error: 'Student or class not found' }, { status: 404 });
    }

    // See if attendance exists for today
    let attendance = await prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        }
      }
    });

    const now = new Date();

    // Determine the teacherId
    // If a teacher scanned it, map generic User ID to their Teacher profile
    let teacherId = student.class?.teacherId;
    
    if (scannedByUserId) {
        const teacherProfile = await prisma.teacher.findUnique({ where: { userId: scannedByUserId } });
        if (teacherProfile) teacherId = teacherProfile.id;
    }

    // Fallback to the first teacher in the DB to satisfy the schema requirement if unassigned
    if (!teacherId) {
        const fallback = await prisma.teacher.findFirst();
        if (fallback) teacherId = fallback.id;
    }

    if (!teacherId) {
        return NextResponse.json({ error: 'No valid teacher configuration found for logging attendance' }, { status: 500 });
    }

    if (!attendance) {
      // Create new Present check-in record
      attendance = await prisma.attendance.create({
        data: {
          studentId: student.id,
          classId: student.classId,
          date: now,
          status: 'PRESENT',
          checkInTime: now,
          takenById: teacherId
        }
      });
      return NextResponse.json({ message: 'Check-in successful', type: 'check-in', data: attendance });
    } else {
      // If already checked in, and no checkOutTime, do a check-out
      if (!attendance.checkOutTime) {
        attendance = await prisma.attendance.update({
          where: { id: attendance.id },
          data: { checkOutTime: now }
        });
        return NextResponse.json({ message: 'Check-out successful', type: 'check-out', data: attendance });
      } else {
        return NextResponse.json({ message: 'Already checked out for today', type: 'error' }, { status: 400 });
      }
    }

  } catch (error: any) {
    console.error('Scan Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
