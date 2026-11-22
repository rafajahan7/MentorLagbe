import {
  ShieldCheck,
  SlidersHorizontal,
  Users,
  ClipboardCheck,
  ImagePlus,
  Crown,
  ArrowUpRight,
} from "lucide-react";

const benefits = [
  {
    number: "01",
    title: "Admin-reviewed tuition posts",
    description:
      "Every tuition listing goes through an admin approval process before becoming publicly available.",
    icon: ShieldCheck,
    color:
      "bg-[#DCE9E2] text-[#183F38] dark:bg-[#29463E] dark:text-[#DCE9E2]",
  },
  {
    number: "02",
    title: "Find your ideal tuition",
    description:
      "Explore opportunities using subject, class level, online or offline mode, location, and monthly budget filters.",
    icon: SlidersHorizontal,
    color:
      "bg-[#F1E5C9] text-[#9A6B17] dark:bg-[#493C27] dark:text-[#E8C77E]",
  },
  {
    number: "03",
    title: "Dedicated role-based dashboards",
    description:
      "Students, tutors, and admins get separate dashboards designed around their responsibilities.",
    icon: Users,
    color:
      "bg-[#DCE9E2] text-[#183F38] dark:bg-[#29463E] dark:text-[#DCE9E2]",
  },
  {
    number: "04",
    title: "Simplified application management",
    description:
      "Students can track their applications while tutors manage applicants and make enrollment decisions.",
    icon: ClipboardCheck,
    color:
      "bg-[#F1E5C9] text-[#9A6B17] dark:bg-[#493C27] dark:text-[#E8C77E]",
  },
  {
    number: "05",
    title: "Showcase your teaching opportunities",
    description:
      "Tutors can create detailed tuition listings with subject information, fees, descriptions, and banner images.",
    icon: ImagePlus,
    color:
      "bg-[#DCE9E2] text-[#183F38] dark:bg-[#29463E] dark:text-[#DCE9E2]",
  },
  {
    number: "06",
    title: "Upgrade with flexible Pro plans",
    description:
      "Students and tutors can upgrade through Stripe and access the benefits included in their Pro subscription.",
    icon: Crown,
    color:
      "bg-[#F1E5C9] text-[#9A6B17] dark:bg-[#493C27] dark:text-[#E8C77E]",
  },
];

export default function WhyMentorLagbe() {
  return (
    <section className="bg-background px-6 py-24 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#B58A35] dark:text-[#D9A441]">
              THE MENTORLAGBE ADVANTAGE
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              More than a tuition finder.
              <span className="text-[#D9A441]">
                {" "}A learning ecosystem.
              </span>
            </h2>
          </div>

          <p className="max-w-lg text-base leading-8 text-muted-foreground md:justify-self-end">
            From discovering the right tuition to managing applications
            and growing your teaching journey, MentorLagbe brings the
            entire experience together.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.number}
                className="group rounded-3xl border border-border bg-card p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D9A441]/60 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`rounded-2xl p-4 ${benefit.color}`}
                  >
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <span className="text-sm font-bold tracking-widest text-[#B58A35] dark:text-[#D9A441]">
                    {benefit.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-bold text-card-foreground">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {benefit.description}
                </p>

                <div className="mt-6 flex justify-end">
                  <ArrowUpRight
                    size={19}
                    className="text-[#B58A35] transition group-hover:translate-x-1 group-hover:-translate-y-1 dark:text-[#D9A441]"
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