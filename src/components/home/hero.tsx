
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Search,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28 lg:px-8">
        {/* Left Content */}
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2">
            <Sparkles size={15} className="text-[#D9A441]" />
            <span className="text-xs font-semibold tracking-wide text-foreground">
              THE LEARNING EXCHANGE
            </span>
          </div>

          <h1 className="max-w-xl text-5xl font-bold leading-[1.12] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Find your ideal
            <span className="relative mx-2 inline-block text-[#D9A441]">
              tutor
            </span>
            or mentorship opportunity.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground md:text-lg">
            Discover trusted tutors, explore available tuition
            opportunities, or find your next batch of students.
            MentorLagbe connects learners and educators to make
            learning more accessible.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-3 rounded-full bg-[#183F38] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#28584E]"
            >
              Browse Tuitions
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-4 text-sm font-semibold text-foreground transition hover:bg-accent"
            >
              Become a Tutor
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-8 border-t border-border pt-7">
            <div>
              <p className="text-2xl font-bold text-foreground">01</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Find opportunities
              </p>
            </div>

            <div className="h-10 w-px bg-border" />

            <div>
              <p className="text-2xl font-bold text-foreground">02</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Connect & apply
              </p>
            </div>

            <div className="h-10 w-px bg-border" />

            <div>
              <p className="text-2xl font-bold text-foreground">03</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Grow together
              </p>
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[#DCE9E2] dark:bg-[#183F38]" />
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-[#F1E5C9] dark:bg-[#4A3512]" />

          <div className="relative overflow-hidden rounded-[2rem] bg-[#183F38] p-5 shadow-2xl md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium tracking-widest text-[#D9A441]">
                  YOUR LEARNING JOURNEY
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[#F7F4EC]">
                  Knowledge starts here.
                </h2>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 text-[#D9A441]">
                <GraduationCap size={28} />
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#F7F4EC] p-5 dark:bg-[#242C2A]">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#DCE9E2] p-3 text-[#183F38] dark:bg-[#183F38] dark:text-[#DCE9E2]">
                  <BookOpen size={23} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#183F38] dark:text-[#F7F4EC]">
                    Find your learning match
                  </p>
                  <p className="mt-1 text-xs text-[#68736C] dark:text-[#B7C2BB]">
                    Explore opportunities made for you
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-[#183F38]/10 bg-white p-3 dark:border-white/10 dark:bg-[#303B37]">
                  <span className="text-sm text-[#58645D] dark:text-[#E0E7E2]">
                    Mathematics
                  </span>
                  <span className="rounded-full bg-[#DCE9E2] px-3 py-1 text-xs font-semibold text-[#183F38] dark:bg-[#183F38] dark:text-[#DCE9E2]">
                    Popular
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#183F38]/10 bg-white p-3 dark:border-white/10 dark:bg-[#303B37]">
                  <span className="text-sm text-[#58645D] dark:text-[#E0E7E2]">
                    English
                  </span>
                  <span className="text-xs text-[#68736C] dark:text-[#B7C2BB]">
                    Explore
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#183F38]/10 bg-white p-3 dark:border-white/10 dark:bg-[#303B37]">
                  <span className="text-sm text-[#58645D] dark:text-[#E0E7E2]">
                    Science
                  </span>
                  <span className="text-xs text-[#68736C] dark:text-[#B7C2BB]">
                    Explore
                  </span>
                </div>
              </div>

              <Link
                href="/tuitions"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9A441] px-4 py-3 text-sm font-bold text-[#183F38] transition hover:bg-[#E7B957]"
              >
                <Search size={16} />
                Explore Tuitions
                <ArrowRight size={16} />
              </Link>
            </div>

            <p className="mt-5 text-center text-xs tracking-wide text-white/60">
              LEARN BETTER. GROW FURTHER.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
