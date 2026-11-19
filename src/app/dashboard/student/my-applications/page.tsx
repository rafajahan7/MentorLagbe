
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import { auth } from "@/lib/auth";
import { getMyApplications } from "@/lib/actions/student";
import MyApplicationsTable from "@/components/student/my-applications-table";

export const metadata: Metadata = {
  title: "My Applications | MentorLagbe",
  description: "Track your tuition applications.",
};

export const instant = false;

export default async function MyApplicationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "student") redirect("/");

  const applications = await getMyApplications();

  return (
    <main className="min-h-screen bg-[#F7F4EC] px-5 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/student"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#68736C] hover:text-[#183F38]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCE9E2]">
            <FileText size={27} className="text-[#183F38]" />
          </div>

          <h1 className="text-3xl font-bold text-[#183F38] md:text-4xl">
            My Applications
          </h1>

          <p className="mt-2 text-[#68736C]">
            Track your applications and see responses from tutors.
          </p>
        </div>

        <MyApplicationsTable applications={applications} />
      </div>
    </main>
  );
}
