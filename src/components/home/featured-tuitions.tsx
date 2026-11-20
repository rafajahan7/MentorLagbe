
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MapPin,
  Wallet,
} from "lucide-react";

import { getFeaturedTuitions } from "@/lib/actions/tuitions";
import { connection } from "next/server";

export default async function FeaturedTuitions() {
  await connection();

  const tuitions = await getFeaturedTuitions();

  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D9A441]">
              Explore Opportunities
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#183F38] md:text-4xl">
              Featured Tuitions
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-[#68736C]">
              Discover the latest approved tuition opportunities and
              find the right learning match for your journey.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#183F38]/20 px-6 py-3 text-sm font-semibold text-[#183F38] transition hover:bg-[#DCE9E2]"
          >
            Browse All Tuitions
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Tuition Cards */}
        {tuitions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <article
                key={tuition._id}
                className="flex h-full flex-col rounded-2xl border border-[#183F38]/10 bg-[#F7F4EC] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D9A441]/60 hover:shadow-xl"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-[#DCE9E2] px-3 py-1.5 text-xs font-semibold text-[#183F38]">
                    {tuition.subject}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#58645D]">
                    {tuition.mode}
                  </span>
                </div>

                {/* Title and Class */}
                <div className="mt-5">
                  <h3 className="line-clamp-2 min-h-[3.5rem] text-xl font-bold text-[#183F38]">
                    {tuition.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-[#68736C]">
                    <GraduationCap size={17} />
                    <span>{tuition.classLevel}</span>
                  </div>
                </div>

                {/* Tuition Details */}
                <div className="mt-6 space-y-3 border-t border-[#183F38]/10 pt-5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-[#68736C]">
                      <Wallet size={16} />
                      Monthly Fee
                    </span>

                    <span className="font-bold text-[#183F38]">
                      ৳{tuition.monthlyFee.toLocaleString("en-BD")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-[#68736C]">
                      <BookOpen size={16} />
                      Tutor
                    </span>

                    <span className="max-w-[55%] truncate font-semibold text-[#183F38]">
                      {tuition.tutorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#68736C]">
                    <MapPin size={16} />
                    <span className="truncate">
                      {tuition.location || "Location not specified"}
                    </span>
                  </div>
                </div>

                {/* View Details */}
                <div className="mt-auto pt-6">
                  <Link
                    href={`/tuitions/${tuition._id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#183F38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28584E]"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#183F38]/20 bg-[#F7F4EC] px-6 py-16 text-center">
            <BookOpen className="mx-auto text-[#D9A441]" size={36} />

            <h3 className="mt-4 text-xl font-bold text-[#183F38]">
              No Featured Tuitions Yet
            </h3>

            <p className="mt-2 text-sm text-[#68736C]">
              New approved tuition opportunities will appear here.
            </p>

            <Link
              href="/tuitions"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#183F38] px-6 py-3 text-sm font-semibold text-white hover:bg-[#28584E]"
            >
              Explore Tuitions
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
