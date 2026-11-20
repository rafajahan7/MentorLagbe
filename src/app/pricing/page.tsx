
import Link from "next/link";
import {
  Check,
  Sparkles,
  GraduationCap,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import UpgradeButton from "@/components/pricing/upgrade-button";

export const metadata = {
  title: "Pricing | MentorLagbe",
  description: "Choose the right MentorLagbe plan for your learning journey.",
};

const plans = [
  {
    name: "Free Student",
    price: "$0",
    period: "Forever",
    description: "Start finding the right tutor for your learning journey.",
    features: [
      "Browse approved tuition posts",
      "Apply for available tuitions",
      "Manage your applications",
      "Personal dashboard",
    ],
    highlighted: false,
  },
  {
    name: "Pro Student",
    price: "$10",
    period: "/ month",
    description: "Get more opportunities to connect with great tutors.",
    features: [
      "Everything in Free Student",
      "Premium learning opportunities",
      "Priority application visibility",
      "Enhanced student profile",
      "Pro member badge",
    ],
    highlighted: true,
  },
  {
    name: "Free Tutor",
    price: "$0",
    period: "Forever",
    description: "Start sharing your knowledge with students.",
    features: [
      "Post up to 2 tuitions",
      "Manage tuition posts",
      "View student applications",
      "Personal tutor dashboard",
    ],
    highlighted: false,
  },
  {
    name: "Pro Tutor",
    price: "$15",
    period: "/ month",
    description: "Grow your tutoring opportunities without post limits.",
    features: [
      "Everything in Free Tutor",
      "Unlimited tuition posts",
      "Manage all your applicants",
      "Pro tutor badge",
      "Premium visibility",
    ],
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EC]">
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#DCE9E2] px-4 py-2 text-sm font-semibold text-[#183F38]">
            <Sparkles size={16} />
            Simple and transparent pricing
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#183F38] md:text-5xl">
            Invest in your
            <span className="text-[#D9A441]"> growth.</span>
          </h1>

          <p className="mt-5 leading-7 text-[#68736C]">
            Whether you're learning or teaching, choose a plan that
            supports your next step.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-7 ${
                plan.highlighted
                  ? "border-[#183F38] bg-[#183F38] text-white shadow-xl"
                  : "border-[#183F38]/10 bg-white text-[#242C2A]"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 right-6 rounded-full bg-[#D9A441] px-4 py-1 text-xs font-bold text-[#242C2A]">
                  PRO PLAN
                </span>
              )}

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCE9E2] text-[#183F38]">
                {plan.name.includes("Student") ? (
                  <GraduationCap size={25} />
                ) : (
                  <BookOpen size={25} />
                )}
              </div>

              <h2 className="text-xl font-bold">{plan.name}</h2>

              <p
                className={`mt-3 min-h-14 text-sm leading-6 ${
                  plan.highlighted ? "text-white/70" : "text-[#89928C]"
                }`}
              >
                {plan.description}
              </p>

              <div className="my-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span
                  className={`text-sm ${
                    plan.highlighted ? "text-white/70" : "text-[#89928C]"
                  }`}
                >
                  {plan.period}
                </span>
              </div>

              <div
                className={`mb-6 h-px ${
                  plan.highlighted ? "bg-white/20" : "bg-[#183F38]/10"
                }`}
              />

              <ul className="mb-8 flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      size={17}
                      className="mt-0.5 shrink-0 text-[#D9A441]"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.highlighted ? (
                <UpgradeButton />
              ) : (
                <Link
                  href="/sign-up"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#183F38]/20 px-6 py-3 text-center text-sm font-semibold text-[#183F38] transition hover:bg-[#DCE9E2]"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              )}
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[#89928C]">
          Pro subscriptions are billed monthly. You can manage your plan
          through your account.
        </p>
      </section>
    </main>
  );
}
