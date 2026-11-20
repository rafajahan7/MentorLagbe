
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import db from "@/lib/db";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { message: "Webhook secret is missing." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { message: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);

    return NextResponse.json(
      { message: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      if (
        checkoutSession.mode !== "subscription" ||
        !["paid", "no_payment_required"].includes(
          checkoutSession.payment_status
        )
      ) {
        return NextResponse.json({ received: true });
      }

      const userEmail = checkoutSession.metadata?.userEmail;
      const userRole = checkoutSession.metadata?.userRole;
      const planName = checkoutSession.metadata?.planName;

      if (
        !userEmail ||
        !["student", "tutor"].includes(userRole ?? "") ||
        !planName ||
        !checkoutSession.amount_total
      ) {
        return NextResponse.json(
          { message: "Invalid checkout metadata." },
          { status: 400 }
        );
      }

      const users = db.collection("users");
      const payments = db.collection("payments");

      // Prevent duplicate payment records
      const existingPayment = await payments.findOne({
        stripeSessionId: checkoutSession.id,
      });

      if (existingPayment) {
        return NextResponse.json({ received: true });
      }

      // Confirm the account still exists and has the expected role
      const user = await users.findOne({
        email: userEmail,
        role: userRole,
      });

      if (!user) {
        return NextResponse.json(
          { message: "User account not found." },
          { status: 404 }
        );
      }

      await payments.insertOne({
        userEmail,
        userName: user.name ?? "",
        userRole,
        planName,
        amount: checkoutSession.amount_total / 100,
        currency: checkoutSession.currency ?? "usd",
        transactionId:
          typeof checkoutSession.payment_intent === "string"
            ? checkoutSession.payment_intent
            : checkoutSession.subscription?.toString() ?? checkoutSession.id,
        stripeSessionId: checkoutSession.id,
        paymentStatus: "paid",
        paidAt: new Date(),
      });

      await users.updateOne(
        { email: userEmail },
        { $set: { plan: "pro" } }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return NextResponse.json(
      { message: "Webhook processing failed." },
      { status: 500 }
    );
  }
}
