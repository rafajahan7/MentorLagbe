import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";

import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";
import ProfileForm from "@/components/profile/profile-form";

export const metadata: Metadata = {
  title: "Update Profile | MentorLagbe",
  description: "Manage your MentorLagbe account profile.",
};

export const instant = false;

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const profile = await getMyProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/dashboard/${profile.role}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCE9E2] dark:bg-[#29463E]">
            <UserRound
              size={27}
              className="text-[#183F38] dark:text-[#DCE9E2]"
            />
          </div>

          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Update Profile
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your personal information and profile picture.
          </p>
        </div>

        <ProfileForm profile={profile} />
      </div>
    </main>
  );
}