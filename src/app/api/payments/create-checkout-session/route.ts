import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { feeId } = body;

    if (!feeId) return NextResponse.json({ error: "feeId is required" }, { status: 400 });

    // Fetch the fee
    const fee = await prisma.fee.findUnique({
      where: { id: feeId },
      include: { student: true }
    });

    if (!fee) return NextResponse.json({ error: "Fee not found" }, { status: 404 });
    if (fee.status === "PAID") return NextResponse.json({ error: "Fee already paid" }, { status: 400 });

    // Ensure there's a payment record to track this (or create one)
    let payment = await prisma.payment.findUnique({ where: { feeId } });
    if (!payment) {
      payment = await prisma.payment.create({
        data: {
          feeId: fee.id,
          amount: fee.amount,
          provider: "STRIPE",
          status: "PENDING"
        }
      });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "fpx"], // Support FPX for Malaysia
      line_items: [
        {
          price_data: {
            currency: "myr", // Malaysian Ringgit
            product_data: {
              name: `Fee: ${fee.type} - ${fee.description}`,
              description: `Student: ${fee.student.firstName} ${fee.student.lastName}`
            },
            unit_amount: Math.round(fee.amount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/fees?success=true&feeId=${fee.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/fees?canceled=true`,
      metadata: {
        feeId: fee.id,
        paymentId: payment.id
      }
    });

    // Update payment intent id if successful
    await prisma.payment.update({
      where: { id: payment.id },
      data: { paymentIntentId: session.id }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
