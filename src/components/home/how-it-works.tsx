
import {
  UserRoundPlus,
  BookOpen,
  ClipboardCheck,
  Crown,
  ArrowUpRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Join the community",
    description:
      "Create your account as a Student or Tutor. Set up your profile and access a dashboard designed for your role.",
    icon: UserRoundPlus,
    tag: "BETTER AUTH",
  },
  {
    number: "02",
    title: "Discover or publish tuitions",
    description:
      "Students explore opportunities by subject, class level, mode, location, and budget. Tutors publish tuition batches or 1-on-1 mentorship listings.",
    icon: BookOpen,
    tag: "TUITION MARKETPLACE",
  },
  {
    number: "03",
    title: "Connect and manage applications",
    description:
      "Students apply to suitable approved listings. Tutors review applications and decide whether to accept or reject them.",
    icon: ClipboardCheck,
    tag: "APPLICATION MANAGEMENT",
  },
  {
    number: "04",
    title: "Unlock more with Pro",
    description:
      "Students and Tutors can upgrade their accounts through secure Stripe payments and enjoy their available Pro benefits.",
    icon: Crown,
    tag: "STRIPE POWERED",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-white px-6 py-24 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="max-w-2xl">
          <span className="text-xs font-bold tracking-[0.2em] text-[#B58A35]">
            HOW MENTORLAGBE WORKS
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#183F38] md:text-5xl">
            From finding guidance
            <span className="text-[#D9A441]"> to growing together.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-8 text-[#68736C]">
            A simpler way for students to find the right learning
            opportunities and for tutors to share their knowledge.
            Everything happens in one connected platform.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group flex flex-col rounded-3xl border border-[#183F38]/10 bg-[#F7F4EC] p-7 transition duration-300 hover:-translate-y-2 hover:border-[#D9A441]/60 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[#D9A441]">
                    {step.number}
                  </span>

                  <div className="rounded-2xl bg-[#DCE9E2] p-3 text-[#183F38] transition group-hover:bg-[#183F38] group-hover:text-white">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>
                </div>

                <h3 className="mt-8 text-xl font-bold text-[#183F38]">
                  {step.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-7 text-[#68736C]">
                  {step.description}
                </p>

                <div className="mt-7 flex items-center justify-between border-t border-[#183F38]/10 pt-5">
                  <span className="text-[10px] font-bold tracking-wider text-[#9A7B3F]">
                    {step.tag}
                  </span>

                  <ArrowUpRight
                    size={18}
                    className="text-[#B58A35] transition group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
