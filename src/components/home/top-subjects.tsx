import Link from "next/link";
import {
  Calculator,
  Atom,
  Code2,
  Languages,
  ArrowUpRight,
} from "lucide-react";

const subjects = [
  {
    name: "Mathematics",
    description: "Build confidence in problem-solving.",
    icon: Calculator,
    color:
      "bg-[#DCE9E2] text-[#183F38] dark:bg-[#29463E] dark:text-[#DCE9E2]",
    search: "Mathematics",
  },
  {
    name: "Physics",
    description: "Understand the science behind everything.",
    icon: Atom,
    color:
      "bg-[#F5E8CE] text-[#9A6B17] dark:bg-[#493C27] dark:text-[#E8C77E]",
    search: "Physics",
  },
  {
    name: "Programming",
    description: "Learn coding and technical skills.",
    icon: Code2,
    color:
      "bg-[#F2DED7] text-[#A6533F] dark:bg-[#49312D] dark:text-[#E9A18E]",
    search: "Programming",
  },
  {
    name: "IELTS",
    description: "Prepare for your English language goals.",
    icon: Languages,
    color:
      "bg-[#E5E1F2] text-[#65528F] dark:bg-[#39334D] dark:text-[#C4B5E8]",
    search: "English",
  },
];

export default function TopSubjects() {
  return (
    <section className="bg-background px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
              Explore Learning
            </span>

            <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
              Learn what inspires you
            </h2>

            <p className="mt-3 max-w-xl text-muted-foreground">
              Explore popular subjects and connect with tutors who can help
              you reach your goals.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 font-semibold text-foreground transition hover:text-[#D9A441]"
          >
            Browse all tuitions
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((subject) => {
            const Icon = subject.icon;

            return (
              <Link
                key={subject.name}
                href={`/tuitions?subject=${encodeURIComponent(subject.search)}`}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-[#D9A441] hover:shadow-lg"
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${subject.color}`}
                >
                  <Icon size={27} />
                </div>

                <h3 className="text-xl font-bold text-card-foreground">
                  {subject.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {subject.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-foreground transition group-hover:text-[#D9A441]">
                  Explore subject
                  <ArrowUpRight
                    size={16}
                    className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}