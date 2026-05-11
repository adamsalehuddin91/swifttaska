import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participantOneId: userId },
          { participantTwoId: userId }
        ]
      },
      include: {
        participantOne: { select: { id: true, name: true, role: true } },
        participantTwo: { select: { id: true, name: true, role: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    return NextResponse.json(conversations);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { recipientId, content, subject, conversationId } = await req.json();
    const senderId = session.user.id;

    let targetConvId = conversationId;

    if (!targetConvId) {
      let conv = await prisma.conversation.findFirst({
        where: {
          OR: [
            { participantOneId: senderId, participantTwoId: recipientId },
            { participantOneId: recipientId, participantTwoId: senderId }
          ]
        }
      });
      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            participantOneId: senderId,
            participantTwoId: recipientId,
            subject: subject || "Direct Message"
          }
        });
      }
      targetConvId = conv.id;
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        recipientId,
        conversationId: targetConvId,
        content,
        subject: subject || "Direct Message"
      }
    });

    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
