import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const feeId = session.metadata?.feeId;
    
    if (feeId) {
      await prisma.$transaction([
        prisma.fee.update({
          where: { id: feeId },
          data: { status: 'PAID', paidDate: new Date(), paidAmount: session.amount_total ? session.amount_total / 100 : 0 }
        }),
        prisma.payment.update({
          where: { feeId: feeId },
          data: { status: 'SUCCESS' }
        })
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
