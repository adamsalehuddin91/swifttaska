import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const whereClause: any = {};
    if (month) whereClause.month = parseInt(month);
    if (year) whereClause.year = parseInt(year);

    const payrolls = await prisma.payroll.findMany({
      where: whereClause,
      include: {
        teacher: {
          select: { firstName: true, lastName: true, employeeId: true, position: true }
        }
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    });

    return NextResponse.json(payrolls);
  } catch (error) {
    console.error('Failed to fetch payroll:', error);
    return NextResponse.json({ error: 'Failed to fetch payroll' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { teacherId, month, year, baseSalary, deductions, bonuses } = body;

    const netPay = parseFloat(baseSalary) + parseFloat(bonuses || 0) - parseFloat(deductions || 0);

    const payroll = await prisma.payroll.upsert({
      where: {
        teacherId_month_year: {
          teacherId,
          month: parseInt(month),
          year: parseInt(year)
        }
      },
      update: {
        baseSalary: parseFloat(baseSalary),
        deductions: parseFloat(deductions || 0),
        bonuses: parseFloat(bonuses || 0),
        netPay
      },
      create: {
        teacherId,
        month: parseInt(month),
        year: parseInt(year),
        baseSalary: parseFloat(baseSalary),
        deductions: parseFloat(deductions || 0),
        bonuses: parseFloat(bonuses || 0),
        netPay,
        status: 'DRAFT'
      }
    });

    return NextResponse.json(payroll, { status: 201 });
  } catch (error) {
    console.error('Failed to generate payroll:', error);
    return NextResponse.json({ error: 'Failed to generate payroll' }, { status: 500 });
  }
}
