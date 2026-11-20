
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="bg-[#F7F4EC] px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#183F38] px-7 py-16 text-center shadow-xl md:px-16 md:py-20">

          {/* Decorative Elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-white/10" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <span className="inline-block rounded-full border border-[#D9A441]/40 bg-[#D9A441]/10 px-5 py-2 text-xs font-bold tracking-[0.2em] text-[#D9A441]">
              YOUR NEXT CHAPTER STARTS HERE
            </span>

            <h2 className="mt-7 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Ready to Start Your
              <span className="block text-[#D9A441]">
                Learning Journey?
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
              Whether you're searching for the right tutor or ready to
              share your knowledge, MentorLagbe brings learning
              opportunities and passionate educators together.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/tuitions"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D9A441] px-7 py-4 text-sm font-bold text-[#183F38] shadow-lg transition hover:-translate-y-1 hover:bg-[#E8B957]"
              >
                <BookOpen size={19} />
                Find a Tutor
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-1 hover:border-[#D9A441] hover:bg-white/10"
              >
                <GraduationCap size={20} />
                Become a Tutor
                <ArrowRight size={17} />
              </Link>
            </div>

            <p className="mt-8 text-xs tracking-wide text-white/45">
              Learn better. Teach smarter. Grow together.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
