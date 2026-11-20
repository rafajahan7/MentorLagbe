
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { UserRound } from "lucide-react";

import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/actions/profile";

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const instant = false;

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const role = session.user.role;

  if (!["student", "tutor", "admin"].includes(role)) {
    redirect("/");
  }

  const profile = await getMyProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const roleLabels = {
    student: "Student",
    tutor: "Tutor",
    admin: "Administrator",
  };

  return (
    <SidebarProvider>
      <DashboardSidebar
        role={role as "student" | "tutor" | "admin"}
        name={profile.name}
        email={profile.email}
        image={profile.image}
      />

      <SidebarInset className="min-w-0 bg-[#F7F4EC]">
        {/* Dashboard Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#183F38]/10 bg-white px-4 md:px-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-[#183F38]" />

            <div className="hidden h-6 w-px bg-[#183F38]/10 sm:block" />

            <div>
              <p className="text-sm font-bold text-[#183F38]">
                MentorLagbe Dashboard
              </p>
              <p className="text-xs text-[#89928C]">
                Manage your learning journey
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[#DCE9E2]"
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#DCE9E2]">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={19} className="text-[#183F38]" />
              )}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-36 truncate text-sm font-semibold text-[#183F38]">
                {profile.name}
              </p>
              <p className="text-xs text-[#89928C]">
                {roleLabels[role as keyof typeof roleLabels]}
              </p>
            </div>
          </Link>
        </header>

        {/* Current Dashboard Page */}
        <div className="min-w-0 flex-1">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
