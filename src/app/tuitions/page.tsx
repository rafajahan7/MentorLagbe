
import { Suspense } from "react";
import { connection } from "next/server";

import { getPaginatedApprovedTuitions } from "@/lib/actions/tuitions";
import TuitionList from "@/components/tuitions/tuition-list";

export const metadata = {
  title: "Browse Tuitions",
  description:
    "Explore approved tuition opportunities and find the right learning match.",
};

interface TuitionsPageProps {
  searchParams: Promise<{
    search?: string;
    subject?: string;
    classLevel?: string;
    mode?: string;
    page?: string;
  }>;
}

async function TuitionResults({
  searchParams,
}: TuitionsPageProps) {
  await connection();

  const params = await searchParams;

  const requestedPage = Math.max(
    1,
    Number.parseInt(params.page || "1", 10) || 1
  );

  const result = await getPaginatedApprovedTuitions(
    {
      search: params.search,
      subject: params.subject,
      classLevel: params.classLevel,
      mode:
        params.mode === "Online" || params.mode === "Offline"
          ? params.mode
          : "",
    },
    requestedPage
  );

  return (
    <TuitionList
      tuitions={result.tuitions}
      currentPage={result.currentPage}
      totalPages={result.totalPages}
      totalTuitions={result.totalTuitions}
      subjects={result.subjects}
      classLevels={result.classLevels}
    />
  );
}

function TuitionLoading() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-[#183F38]/10 bg-white p-6 dark:border-white/10 dark:bg-[#202B27]"
          >
            <div className="h-40 rounded-xl bg-[#DCE9E2] dark:bg-[#35443D]" />
            <div className="mt-5 h-4 w-1/3 rounded bg-[#DCE9E2] dark:bg-[#35443D]" />
            <div className="mt-3 h-6 w-3/4 rounded bg-[#DCE9E2] dark:bg-[#35443D]" />
            <div className="mt-4 h-4 w-1/2 rounded bg-[#DCE9E2] dark:bg-[#35443D]" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TuitionsPage({
  searchParams,
}: TuitionsPageProps) {
  return (
    <div className="min-h-screen bg-[#F7F4EC] transition-colors dark:bg-[#151D1A]">
      <section className="border-b border-[#183F38]/10 bg-white px-6 py-16 transition-colors dark:border-white/10 dark:bg-[#202B27]">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold tracking-[0.2em] text-[#B58A35] dark:text-[#E5B957]">
            EXPLORE OPPORTUNITIES
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#183F38] dark:text-[#F7F4EC] md:text-5xl">
            Find your perfect
            <span className="text-[#D9A441]"> tuition.</span>
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-[#68736C] dark:text-[#B7C4BC]">
            Discover tuition opportunities that match your subject,
            academic level, preferred learning mode, and budget.
          </p>
        </div>
      </section>

      <Suspense fallback={<TuitionLoading />}>
        <TuitionResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
