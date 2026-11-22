
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import { auth } from "@/lib/auth";
import { getMyTuitions } from "@/lib/actions/tutor";
import MyTuitionsTable from "@/components/tutor/my-tuitions-table";

export const metadata: Metadata = {
  title: "My Tuitions | MentorLagbe",
  description: "Manage your tuition posts on MentorLagbe.",
};

export const instant = false;

export default async function MyTuitionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "tutor") redirect("/");

  const tuitions = await getMyTuitions();

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/tutor"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCE9E2] dark:bg-[#29483D]">
            <FileText
              size={27}
              className="text-[#183F38] dark:text-[#DCE9E2]"
            />
          </div>

          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            My Tuitions
          </h1>

          <p className="mt-2 text-muted-foreground">
            View and manage all tuition posts you have created.
          </p>
        </div>

        <MyTuitionsTable tuitions={tuitions} />
      </div>
    </main>
  );
}
