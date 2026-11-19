
import { Suspense } from "react";
import { headers } from "next/headers";
import { connection } from "next/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getTuitionById } from "@/lib/actions/tuitions";
import ApplyTuitionForm from "@/components/tuitions/apply-tuition-form";

export const metadata = {
  title: "Tuition Details | MentorLagbe",
  description: "Explore tuition details and apply through MentorLagbe.",
};

interface TuitionDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function TuitionDetails({
  params,
}: TuitionDetailsPageProps) {
  await connection();

  // Resolve params inside Suspense.
  const { id } = await params;

  const [tuition, session] = await Promise.all([
    getTuitionById(id),
    auth.api.getSession({
      headers: await headers(),
    }),
  ]);

  if (!tuition) {
    notFound();
  }

  const userRole = session?.user?.role;
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;

  return (
    <main className="min-h-screen bg-[#F7F4EC] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/tuitions"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#183F38] transition hover:text-[#D9A441]"
        >
          <ArrowLeft size={18} />
          Back to Browse Tuitions
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="overflow-hidden rounded-3xl border border-[#183F38]/10 bg-white shadow-sm">
              {tuition.bannerImage ? (
                <img
                  src={tuition.bannerImage}
                  alt={tuition.title}
                  className="h-64 w-full object-cover md:h-80"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-[#DCE9E2]">
                  <BookOpen
                    size={64}
                    className="text-[#183F38]/40"
                  />
                </div>
              )}

              <div className="p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#DCE9E2] px-4 py-1.5 text-sm font-semibold text-[#183F38]">
                    {tuition.subject}
                  </span>

                  <span className="rounded-full bg-[#F7F4EC] px-4 py-1.5 text-sm font-semibold text-[#68736C]">
                    {tuition.mode}
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-bold text-[#183F38] md:text-4xl">
                  {tuition.title}
                </h1>

                <p className="mt-4 leading-8 text-[#68736C]">
                  {tuition.description}
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#F7F4EC] p-5">
                    <p className="text-sm text-[#68736C]">
                      Class / Level
                    </p>
                    <p className="mt-2 font-semibold text-[#183F38]">
                      {tuition.classLevel}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F7F4EC] p-5">
                    <p className="text-sm text-[#68736C]">
                      Monthly Fee
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[#183F38]">
                      ৳{tuition.monthlyFee.toLocaleString("en-BD")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F7F4EC] p-5">
                    <p className="flex items-center gap-2 text-sm text-[#68736C]">
                      <MapPin size={16} />
                      Location
                    </p>
                    <p className="mt-2 font-semibold text-[#183F38]">
                      {tuition.location}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F7F4EC] p-5">
                    <p className="flex items-center gap-2 text-sm text-[#68736C]">
                      <CalendarDays size={16} />
                      Days per week
                    </p>
                    <p className="mt-2 font-semibold text-[#183F38]">
                      {tuition.daysPerWeek} days
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#183F38]/10 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCE9E2]">
                  <GraduationCap
                    size={25}
                    className="text-[#183F38]"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#183F38]">
                    About the Tutor
                  </h2>
                  <p className="text-sm text-[#68736C]">
                    Tuition provider
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-lg font-semibold text-[#183F38]">
                  {tuition.tutorName}
                </p>
                <p className="mt-1 text-sm text-[#68736C]">
                  {tuition.tutorEmail}
                </p>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-8">
            <ApplyTuitionForm
              tuitionId={tuition._id}
              userRole={userRole}
              userName={userName}
              userEmail={userEmail}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function TuitionDetailsLoading() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl animate-pulse px-6 py-12">
      <div className="h-6 w-40 rounded bg-[#DCE9E2]" />
      <div className="mt-8 h-80 rounded-3xl bg-[#DCE9E2]" />
      <div className="mt-6 h-40 rounded-3xl bg-[#DCE9E2]" />
    </div>
  );
}

export default function TuitionDetailsPage({
  params,
}: TuitionDetailsPageProps) {
  return (
    <Suspense fallback={<TuitionDetailsLoading />}>
      <TuitionDetails params={params} />
    </Suspense>
  );
}
