
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

import { auth } from "@/lib/auth";
import { getAllUsers } from "@/lib/actions/admin";
import UsersTable from "@/components/admin/users-table";

export const metadata: Metadata = {
  title: "User Management | MentorLagbe",
  description: "Manage registered users and their roles.",
};

export const instant = false;

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const result = await getAllUsers();

  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back navigation */}
        <Link
          href="/dashboard/admin"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-[#B58A35]"
        >
          <ArrowLeft size={17} />
          Back to Admin Overview
        </Link>

        {/* Page heading */}
        <div className="mb-10">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#183F38] text-white">
            <Users size={28} />
          </div>

          <p className="text-xs font-bold tracking-[0.2em] text-[#B58A35]">
            PLATFORM MANAGEMENT
          </p>

          <h1 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
            User Management
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            View all registered students, tutors and administrators.
            Manage account roles from one place.
          </p>
        </div>

        {/* Users table */}
        {result.success ? (
          <UsersTable
            users={result.users}
            currentAdminId={session.user.id}
          />
        ) : (
          <div className="rounded-2xl border border-red-200 bg-card p-8 text-center dark:border-red-900">
            <h2 className="font-bold text-red-700 dark:text-red-400">
              Unable to load users
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Please refresh the page and try again.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
