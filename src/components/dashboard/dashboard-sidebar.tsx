
"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BookOpen,
  Users,
  CreditCard,
  UserRound,
  GraduationCap,
  BriefcaseBusiness,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

type Role = "student" | "tutor" | "admin";

interface DashboardSidebarProps {
  role: Role;
  name: string;
  email: string;
  image?: string;
}

const menus = {
  student: [
    { title: "Overview", url: "/dashboard/student", icon: LayoutDashboard },
    { title: "My Applications", url: "/dashboard/student/my-applications", icon: FileText },
  ],
  tutor: [
    { title: "Overview", url: "/dashboard/tutor", icon: LayoutDashboard },
    { title: "Post Tuition", url: "/dashboard/tutor/post-tuition", icon: PlusCircle },
    { title: "My Tuitions", url: "/dashboard/tutor/my-tuitions", icon: BookOpen },
    { title: "Applicants", url: "/dashboard/tutor/applicants", icon: Users },
  ],
  admin: [
    { title: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
    { title: "User Management", url: "/dashboard/admin/users", icon: Users },
    { title: "Tuition Management", url: "/dashboard/admin/tuitions", icon: BriefcaseBusiness },
    { title: "Transactions", url: "/dashboard/admin/transactions", icon: CreditCard },
  ],
};

export default function DashboardSidebar({
  role,
  name,
  email,
  image,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const roleLabels = {
    student: "Student",
    tutor: "Tutor",
    admin: "Administrator",
  };

  function navigate(url: string) {
    router.push(url);
  }

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border"
    >
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#183F38]">
            <GraduationCap className="text-white" size={23} />
          </div>

          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-lg font-bold text-sidebar-foreground">
              MentorLagbe
            </p>
            <p className="text-[10px] tracking-widest text-[#B58A35]">
              THE LEARNING EXCHANGE
            </p>
          </div>
        </button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            {roleLabels[role]} Dashboard
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menus[role].map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.url ||
                  (item.url !== `/dashboard/${role}` &&
                    pathname.startsWith(`${item.url}/`));

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      onClick={() => navigate(item.url)}
                      className="h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                    >
                      <Icon size={19} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Account
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/profile"}
                  tooltip="Update Profile"
                  onClick={() => navigate("/dashboard/profile")}
                  className="h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                >
                  <UserRound size={19} />
                  <span>Update Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Home"
                  onClick={() => navigate("/")}
                  className="h-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Settings size={19} />
                  <span>Back to Website</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-accent">
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound
                size={19}
                className="text-sidebar-foreground"
              />
            )}
          </div>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">
              {name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {email}
            </p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
