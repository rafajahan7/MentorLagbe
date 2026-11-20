
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

import { auth } from "@/lib/auth";
import { getTutorApplications } from "@/lib/actions/tutor";
import ApplicantsTable from "@/components/tutor/applicants-table";

export const metadata: Metadata = {
  title: "Manage Applicants | MentorLagbe",
  description: "Review and manage students applying to your tuitions.",
};

export const instant = false;

export default async function ApplicantsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "tutor") redirect("/");

  const result = await getTutorApplications();

  return (
    <main className="min-h-screen bg-[#F7F4EC] px-5 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/tutor"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#68736C] hover:text-[#183F38]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCE9E2]">
            <Users size={27} className="text-[#183F38]" />
          </div>

          <h1 className="text-3xl font-bold text-[#183F38] md:text-4xl">
            Manage Applicants
          </h1>

          <p className="mt-2 text-[#68736C]">
            Review student applications and accept or reject applicants.
          </p>
        </div>

        <ApplicantsTable applications={result.applications} />
      </div>
    </main>
  );
}
