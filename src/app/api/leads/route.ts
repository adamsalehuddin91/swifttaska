import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const lead = await prisma.lead.create({
      data: {
        parentName: data.parentName,
        childName: data.childName,
        phone: data.phone,
        email: data.email,
        status: data.status || 'NEW',
        notes: data.notes
      }
    });
    return NextResponse.json(lead);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    
    const up = await prisma.lead.update({
      where: { id },
      data: updateData
    });
    return NextResponse.json(up);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
