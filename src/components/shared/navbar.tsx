
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  UserRound,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

type UserRole = "student" | "tutor" | "admin";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Tuitions", href: "/tuitions" },
  { name: "Pricing", href: "/pricing" },
  { name: "How It Works", href: "/#how-it-works" },
];

const dashboardRoutes: Record<UserRole, string> = {
  student: "/dashboard/student",
  tutor: "/dashboard/tutor",
  admin: "/dashboard/admin",
};

const roleStyles: Record<UserRole, string> = {
  student: "bg-[#DCE9E2] text-[#183F38]",
  tutor: "bg-[#F8EBCB] text-[#89651D]",
  admin: "bg-[#F6DFD8] text-[#A34E37]",
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function isValidRole(role: unknown): role is UserRole {
  return (
    role === "student" ||
    role === "tutor" ||
    role === "admin"
  );
}

export default function Navbar() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = isValidRole(user?.role) ? user.role : undefined;

  const dashboardLink = role
    ? dashboardRoutes[role]
    : "/";

  const profileLink = "/dashboard/profile";

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(
          result.error.message || "Could not sign out. Please try again."
        );
        setSigningOut(false);
        return;
      }

      setMenuOpen(false);

      toast.success("Signed out successfully!", {
        description: "See you again at MentorLagbe!",
      });

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);

      toast.error("Something went wrong while signing out.");
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#183F38]/10 bg-[#F7F4EC]">
      <div className="mx-auto flex min-h-[82px] max-w-7xl items-center justify-between px-5 md:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="MentorLagbe Home"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#183F38] text-[#F7F4EC]">
            <GraduationCap size={25} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#183F38]">
              MentorLagbe
            </h1>
            <p className="text-[9px] font-semibold tracking-[2px] text-[#9A7B3F]">
              LEARN. GROW. CONNECT.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-semibold text-[#46534C] transition-colors hover:text-[#B58A35]"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden items-center gap-4 lg:flex">
          {isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-[#DCE9E2]" />
          ) : user ? (
            <>
              <Link
                href={dashboardLink}
                className="flex items-center gap-2 text-sm font-semibold text-[#183F38] transition hover:text-[#B58A35]"
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <Link
                href={profileLink}
                className="flex items-center gap-2.5 rounded-full border border-[#183F38]/10 px-3 py-2 transition hover:bg-[#DCE9E2]"
                aria-label="Update your profile"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={`${user.name || "User"}'s profile`}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#183F38] text-xs font-bold text-white">
                    {getInitials(user.name || "User")}
                  </div>
                )}

                <div className="flex flex-col items-start">
                  <span className="max-w-[110px] truncate text-sm font-bold text-[#183F38]">
                    {user.name || "User"}
                  </span>

                  {role && (
                    <span
                      className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${roleStyles[role]}`}
                    >
                      {role}
                    </span>
                  )}
                </div>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="rounded-full border border-[#183F38]/25 px-4 py-2 text-sm font-semibold text-[#183F38] transition hover:bg-[#DCE9E2] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {signingOut ? "Signing out..." : "Sign Out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-[#183F38] transition hover:text-[#B58A35]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#183F38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28584E]"
              >
                Sign Up <span className="ml-1">↗</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="rounded-lg p-2 text-[#183F38] transition hover:bg-[#DCE9E2] lg:hidden"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#183F38]/10 bg-[#F7F4EC] px-5 py-5 lg:hidden"
        >
          <nav
            className="flex flex-col gap-4"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#354B42] transition hover:text-[#B58A35]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="my-5 border-t border-[#183F38]/10" />

          {isPending ? (
            <div className="h-10 animate-pulse rounded-lg bg-[#DCE9E2]" />
          ) : user ? (
            <div className="flex flex-col gap-4">

              {/* Mobile Profile */}
              <Link
                href={profileLink}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={`${user.name || "User"}'s profile`}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#183F38] text-sm font-bold text-white">
                    {getInitials(user.name || "User")}
                  </div>
                )}

                <div>
                  <p className="font-bold text-[#183F38]">
                    {user.name || "User"}
                  </p>

                  {role && (
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${roleStyles[role]}`}
                    >
                      {role}
                    </span>
                  )}
                </div>
              </Link>

              <Link
                href={dashboardLink}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-[#183F38]"
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <Link
                href={profileLink}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-[#183F38]"
              >
                <UserRound size={17} />
                Update Profile
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-2 text-left text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut size={17} />
                {signingOut ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#183F38]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="w-fit rounded-full bg-[#183F38] px-5 py-3 text-sm font-semibold text-white"
              >
                Sign Up ↗
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
