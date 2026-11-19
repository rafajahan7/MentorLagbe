
import Link from "next/link";
import {
  MapPin,
  CalendarDays,
  Monitor,
  GraduationCap,
  ArrowUpRight,
  Wallet,
} from "lucide-react";

import type { Tuition } from "@/lib/actions/tuitions";

interface TuitionCardProps {
  tuition: Tuition;
}

export default function TuitionCard({ tuition }: TuitionCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[#183F38]/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Banner */}
      <div className="relative h-48 overflow-hidden bg-[#DCE9E2]">
        {tuition.bannerImage ? (
          <img
            src={tuition.bannerImage}
            alt={tuition.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#183F38]">
            <GraduationCap size={55} strokeWidth={1.2} />
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-[#183F38] px-4 py-2 text-xs font-semibold text-white">
          {tuition.subject}
        </span>

        <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#183F38]">
          {tuition.mode}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="line-clamp-1 text-xl font-bold text-[#183F38]">
          {tuition.title}
        </h3>

        <p className="mt-2 text-sm text-[#68736C]">
          {tuition.classLevel}
        </p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 text-sm text-[#58645D]">
            <GraduationCap size={17} className="text-[#B58A35]" />
            <span>Tutor: {tuition.tutorName}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#58645D]">
            <MapPin size={17} className="text-[#B58A35]" />
            <span className="line-clamp-1">
              {tuition.mode === "Online" ? "Online" : tuition.location}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#58645D]">
            <CalendarDays size={17} className="text-[#B58A35]" />
            <span>{tuition.daysPerWeek} days per week</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-[#58645D]">
            {tuition.mode === "Online" ? (
              <Monitor size={17} className="text-[#B58A35]" />
            ) : (
              <Wallet size={17} className="text-[#B58A35]" />
            )}
            <span>Monthly tuition</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#183F38]/10 pt-5">
          <div>
            <p className="text-xs text-[#68736C]">Monthly fee</p>
            <p className="mt-1 text-xl font-bold text-[#183F38]">
              ৳{tuition.monthlyFee.toLocaleString("en-BD")}
            </p>
          </div>

          <Link
            href={`/tuitions/${tuition._id}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#183F38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28584E]"
          >
            Details
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
