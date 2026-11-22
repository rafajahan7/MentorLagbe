import Link from "next/link";
import { Check, ArrowRight, GraduationCap, BookOpen } from "lucide-react";

const plans = [
  {
    name: "Student",
    description: "Find tutors and apply for tuition opportunities.",
    free: true,
    price: "Free",
    features: [
      "Browse approved tuitions",
      "Apply to tuition posts",
      "Track your applications",
    ],
    icon: GraduationCap,
  },
  {
    name: "Student Pro",
    description: "Get more visibility and enhanced learning access.",
    free: false,
    price: "$10/month",
    features: [
      "Everything in Free",
      "Pro member status",
      "Enhanced profile features",
    ],
    icon: GraduationCap,
  },
  {
    name: "Tutor",
    description: "Start teaching and connect with students.",
    free: true,
    price: "Free",
    features: [
      "Post up to 2 tuitions",
      "Manage applications",
      "Access tutor dashboard",
    ],
    icon: BookOpen,
  },
  {
    name: "Tutor Pro",
    description: "Grow your tutoring opportunities without post limits.",
    free: false,
    price: "$15/month",
    features: [
      "Everything in Free",
      "Unlimited tuition posts",
      "Pro member status",
    ],
    icon: BookOpen,
  },
];

export default function PricingPreview() {
  return (
    <section className="bg-background px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
            Simple & Transparent
          </span>

          <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
            Choose the plan that fits your journey
          </h2>

          <p className="mt-4 text-muted-foreground">
            Start for free and upgrade whenever you are ready to grow with
            MentorLagbe.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`flex h-full flex-col rounded-2xl border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  plan.free
                    ? "border-border bg-card text-card-foreground"
                    : "border-[#D9A441] bg-[#183F38] text-white"
                }`}
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                    plan.free
                      ? "bg-[#DCE9E2] text-[#183F38] dark:bg-[#29463E] dark:text-[#DCE9E2]"
                      : "bg-[#D9A441]/20 text-[#D9A441]"
                  }`}
                >
                  <Icon size={24} />
                </div>

                <h3 className="text-xl font-bold">{plan.name}</h3>

                <p
                  className={`mt-2 min-h-12 text-sm ${
                    plan.free
                      ? "text-muted-foreground"
                      : "text-white/70"
                  }`}
                >
                  {plan.description}
                </p>

                <p className="mt-5 text-3xl font-bold">{plan.price}</p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <Check
                        size={17}
                        className="mt-0.5 shrink-0 text-[#D9A441]"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/pricing"
                  className={`mt-8 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    plan.free
                      ? "bg-[#183F38] text-white hover:bg-[#24564C] dark:bg-[#D9A441] dark:text-[#183F38] dark:hover:bg-[#E7B956]"
                      : "bg-[#D9A441] text-[#183F38] hover:bg-[#E7B956]"
                  }`}
                >
                  Explore Plans
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          View full plan details and subscription options on our pricing page.
        </p>
      </div>
    </section>
  );
}