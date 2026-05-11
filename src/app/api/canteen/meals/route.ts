import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const meals = await prisma.mealPlan.findMany({
      where: startDate && endDate ? {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      } : {},
      orderBy: { date: 'asc' }
    });

    return NextResponse.json(meals);
  } catch (error) {
    console.error('Failed to fetch meals:', error);
    return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { date, type, name, description, ingredients, nutritional } = body;

    const meal = await prisma.mealPlan.create({
      data: {
        date: new Date(date),
        type,
        name,
        description,
        ingredients,
        nutritional
      }
    });

    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    console.error('Failed to create meal:', error);
    return NextResponse.json({ error: 'Failed to create meal plan' }, { status: 500 });
  }
}
