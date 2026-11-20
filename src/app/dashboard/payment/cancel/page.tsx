
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Payment Cancelled | MentorLagbe",
};

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#F7F4EC] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm md:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FCE8E3]">
          <XCircle className="h-11 w-11 text-[#D77C63]" />
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#B58A35]">
          MentorLagbe Pro
        </p>

        <h1 className="mb-4 text-3xl font-bold text-[#183F38]">
          Payment cancelled
        </h1>

        <p className="mb-8 leading-7 text-[#68736C]">
          Your checkout was cancelled. No subscription was activated.
          You can return to your dashboard and try again whenever you're ready.
        </p>

        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-2 rounded-xl bg-[#183F38] px-7 py-3 font-semibold text-white transition hover:bg-[#24584E]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
