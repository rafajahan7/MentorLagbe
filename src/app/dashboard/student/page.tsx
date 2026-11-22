
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Crown,
  ArrowRight,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getStudentDashboardStats } from "@/lib/actions/student";
import StatsCard from "@/components/admin/stats-card";

export const metadata: Metadata = {
  title: "Student Dashboard | MentorLagbe",
  description: "Manage your tuition applications and learning journey.",
};

export const instant = false;

export default async function StudentDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "student") redirect("/");

  const result = await getStudentDashboardStats();

  const stats = result.success ? result.stats : null;

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Welcome section */}
        <div className="mb-10">
          <p className="text-sm font-medium text-[#D9A441]">
            STUDENT DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
            Welcome back, {session.user.name}!
          </h1>

          <p className="mt-3 text-muted-foreground">
            Keep track of your tuition applications and learning opportunities.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Applied Tuitions"
            value={stats?.totalApplied ?? "—"}
            description="Your total submitted applications"
            icon={BookOpen}
          />

          <StatsCard
            title="Accepted Applications"
            value={stats?.acceptedApplications ?? "—"}
            description="Applications accepted by tutors"
            icon={CheckCircle}
            iconBackground="bg-[#DCE9E2]"
          />

          <StatsCard
            title="Pending Applications"
            value={stats?.pendingApplications ?? "—"}
            description="Applications waiting for a response"
            icon={Clock}
            iconBackground="bg-[#FFF2D6]"
          />

          <StatsCard
            title="Current Plan"
            value={stats?.currentPlan ?? "—"}
            description="Your current MentorLagbe subscription"
            icon={Crown}
            iconBackground="bg-[#FCE8D9]"
          />
        </div>

        {/* Quick actions */}
        <section className="rounded-3xl bg-[#183F38] p-7 text-white md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#D9A441]">
              YOUR NEXT STEP
            </p>

            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Find the right tuition opportunity.
            </h2>

            <p className="mt-3 leading-7 text-white/70">
              Explore available tuition posts, connect with tutors,
              and keep track of your applications from one place.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/tuitions"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D9A441] px-5 py-3 font-semibold text-[#183F38] transition hover:bg-[#E8B957]"
              >
                Browse Tuitions
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/dashboard/student/my-applications"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                My Applications
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
