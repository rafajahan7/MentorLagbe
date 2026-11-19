
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  Users,
  Crown,
  PlusCircle,
  FileText,
  UserRound,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getTutorDashboardStats } from "@/lib/actions/tutor";
import StatsCard from "@/components/admin/stats-card";

export const metadata: Metadata = {
  title: "Tutor Dashboard | MentorLagbe",
  description: "Manage your tuition posts and student applicants.",
};

export const instant = false;

export default async function TutorDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "tutor") {
    redirect("/");
  }

  const result = await getTutorDashboardStats();

  const stats = result.stats;

  return (
    <main className="min-h-screen bg-[#F7F4EC] px-5 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Welcome Section */}
        <div className="mb-10">
          <span className="text-xs font-bold tracking-[0.2em] text-[#B58A35]">
            TUTOR WORKSPACE
          </span>

          <h1 className="mt-3 text-3xl font-bold text-[#183F38] md:text-4xl">
            Welcome back, {session.user.name}!
          </h1>

          <p className="mt-3 text-[#68736C]">
            Manage your tuition opportunities and connect with students.
          </p>
        </div>

        {/* Statistics */}
        <section>
          <h2 className="mb-5 text-xl font-bold text-[#183F38]">
            Your Overview
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              title="Total Tuitions Posted"
              value={stats?.totalTuitions ?? 0}
              description="All your submitted tuition posts"
              icon={BookOpen}
            />

            <StatsCard
              title="Active / Approved Tuitions"
              value={stats?.activeApprovedTuitions ?? 0}
              description="Approved and currently active posts"
              icon={CheckCircle}
              iconBackground="bg-[#DCE9E2]"
            />

            <StatsCard
              title="Total Applicants Received"
              value={stats?.totalApplicants ?? 0}
              description="Students who applied to your tuitions"
              icon={Users}
              iconBackground="bg-[#F5E8C9]"
            />

            <StatsCard
              title="Current Plan"
              value={stats?.currentPlan ?? "Free"}
              description={
                stats?.currentPlan === "Pro"
                  ? "You are enjoying Pro benefits"
                  : "Upgrade to unlock unlimited tuition posts"
              }
              icon={Crown}
              iconBackground="bg-[#F5E8C9]"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-12">
          <h2 className="mb-5 text-xl font-bold text-[#183F38]">
            Manage Your Account
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            <Link
              href="/dashboard/tutor/post-tuition"
              className="group rounded-2xl border border-[#183F38]/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <PlusCircle className="text-[#B58A35]" size={28} />
              <h3 className="mt-4 font-bold text-[#183F38]">
                Post a Tuition
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#68736C]">
                Create a new tuition opportunity for students.
              </p>
            </Link>

            <Link
              href="/dashboard/tutor/my-tuitions"
              className="group rounded-2xl border border-[#183F38]/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <FileText className="text-[#B58A35]" size={28} />
              <h3 className="mt-4 font-bold text-[#183F38]">
                My Tuitions
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#68736C]">
                Edit, manage, or close your tuition posts.
              </p>
            </Link>

            <Link
              href="/dashboard/tutor/applicants"
              className="group rounded-2xl border border-[#183F38]/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <UserRound className="text-[#B58A35]" size={28} />
              <h3 className="mt-4 font-bold text-[#183F38]">
                Manage Applicants
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#68736C]">
                Review student applications and respond to them.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
