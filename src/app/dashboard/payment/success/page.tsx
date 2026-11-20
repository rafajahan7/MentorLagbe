
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";

export const metadata = {
  title: "Payment Successful | MentorLagbe",
};

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#F7F4EC] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#DCE9E2]">
          <CheckCircle2 className="h-11 w-11 text-[#183F38]" />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#B58A35]">
          MentorLagbe Pro
        </p>

        <h1 className="mb-4 text-3xl font-bold text-[#183F38]">
          Checkout completed!
        </h1>

        <p className="mb-6 leading-7 text-[#68736C]">
          Thank you for choosing MentorLagbe Pro. Your payment is being
          verified. Your account will be upgraded after Stripe confirms
          the payment through our secure webhook.
        </p>

        <div className="mb-8 flex items-center justify-center gap-2 rounded-xl bg-[#F7F4EC] p-4 text-sm text-[#68736C]">
          <Clock size={18} />
          <span>Plan activation may take a few moments.</span>
        </div>

        <Link
          href="/dashboard/profile"
          className="inline-flex rounded-xl bg-[#183F38] px-7 py-3 font-semibold text-white transition hover:bg-[#24584E]"
        >
          View My Profile
        </Link>
      </div>
    </main>
  );
}
