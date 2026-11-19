
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import {
  Users,
  GraduationCap,
  Clock,
  CheckCircle2,
  CreditCard,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getAdminStats } from "@/lib/actions/admin";
import StatsCard from "@/components/admin/stats-card";

export const metadata: Metadata = {
  title: "Admin Overview | MentorLagbe",
  description: "Monitor MentorLagbe platform statistics.",
};

export const instant = false;

const adminLinks = [
  {
    title: "User Management",
    description: "View registered users and manage their roles.",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Tuition Management",
    description: "Review, approve and reject tuition submissions.",
    href: "/dashboard/admin/tuitions",
    icon: BookOpen,
  },
  {
    title: "Transaction Management",
    description: "Review Stripe subscription payment records.",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
  },
];

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const result = await getAdminStats();
  const stats = result.stats;

  const revenueDescription = stats?.revenueByCurrency.length
    ? stats.revenueByCurrency
        .map(
          (item) =>
            `${item.currency.toUpperCase()} ${item.total.toLocaleString()}`
        )
        .join(" · ")
    : "No verified payments yet";

  const revenueDisplay =
    stats?.revenueByCurrency.length === 1
      ? `${stats.revenueByCurrency[0].currency.toUpperCase()} ${stats.revenueByCurrency[0].total.toLocaleString()}`
      : stats?.revenueByCurrency.length
        ? "Multiple currencies"
        : "0";

  return (
    <main className="min-h-screen bg-[#F7F4EC] px-5 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#183F38] text-white">
              <ShieldCheck size={30} />
            </div>

            <p className="text-xs font-bold tracking-[0.2em] text-[#B58A35]">
              PLATFORM CONTROL CENTER
            </p>

            <h1 className="mt-3 text-3xl font-bold text-[#183F38] md:text-4xl">
              Admin Overview
            </h1>

            <p className="mt-3 text-[#68736C]">
              Monitor users, tuition activity and platform revenue.
            </p>
          </div>

          <div className="rounded-xl border border-[#183F38]/10 bg-white px-5 py-3">
            <p className="text-xs text-[#68736C]">Signed in as</p>
            <p className="mt-1 font-bold text-[#183F38]">
              {session.user.name}
            </p>
            <span className="text-xs font-semibold capitalize text-[#B58A35]">
              {session.user.role}
            </span>
          </div>
        </div>

        {/* Statistics */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#183F38]">
              Platform Statistics
            </h2>
            <p className="mt-1 text-sm text-[#68736C]">
              Current overview of MentorLagbe.
            </p>
          </div>

          {stats ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <StatsCard
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                description="All registered platform users"
                icon={Users}
              />

              <StatsCard
                title="Total Tutors"
                value={stats.totalTutors.toLocaleString()}
                description="Registered tutor accounts"
                icon={GraduationCap}
                iconBackground="bg-[#F8EBCB]"
              />

              <StatsCard
                title="Pending vs Approved"
                value={`${stats.pendingTuitions} / ${stats.approvedTuitions}`}
                description={`${stats.rejectedTuitions} rejected tuition posts`}
                icon={Clock}
                iconBackground="bg-[#F6DFD8]"
              />

              <StatsCard
                title="Stripe Revenue"
                value={revenueDisplay}
                description={revenueDescription}
                icon={CreditCard}
                iconBackground="bg-[#DCE9E2]"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-red-200 bg-white p-6 text-sm text-red-700">
              Could not load platform statistics. Please refresh the page.
            </div>
          )}
        </section>

        {/* Management Navigation */}
        <section className="mt-12">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#183F38]">
              Management Center
            </h2>
            <p className="mt-1 text-sm text-[#68736C]">
              Manage the main areas of your platform.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {adminLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-[#183F38]/10 bg-white p-6 transition hover:-translate-y-1 hover:border-[#D9A441] hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCE9E2] text-[#183F38]">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-[#183F38]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#68736C]">
                    {item.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#B58A35]">
                    Manage section
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tuition status note */}
        <section className="mt-10 rounded-2xl bg-[#183F38] p-7 text-white">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={24} className="text-[#D9A441]" />
            <h2 className="text-lg font-bold">
              Keep MentorLagbe running smoothly
            </h2>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/75">
            Review new tuition submissions regularly, maintain accurate user
            roles and monitor verified subscription payments.
          </p>
        </section>

      </div>
    </main>
  );
}
