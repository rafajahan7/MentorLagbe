
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    // Verify the logged-in user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please sign in first." },
        { status: 401 }
      );
    }

    const role = session.user.role;

    // Only students and tutors can purchase Pro
    if (role !== "student" && role !== "tutor") {
      return NextResponse.json(
        { success: false, message: "Your account cannot purchase this plan." },
        { status: 403 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");

    if (!appUrl) {
      throw new Error("NEXT_PUBLIC_APP_URL is missing.");
    }

    // The server determines the price from the user's role
    const amount = role === "student" ? 1000 : 1500;
    const planName = role === "student" ? "Pro Student" : "Pro Tutor";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email,
      client_reference_id: session.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planName,
              description: "MentorLagbe monthly Pro subscription",
            },
            unit_amount: amount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userEmail: session.user.email,
        userName: session.user.name,
        userRole: role,
        planName,
      },
      subscription_data: {
        metadata: {
          userEmail: session.user.email,
          userRole: role,
          planName,
        },
      },
      success_url: `${appUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/payment/cancel`,
    });

    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { success: false, message: "Could not start checkout." },
      { status: 500 }
    );
  }
}
