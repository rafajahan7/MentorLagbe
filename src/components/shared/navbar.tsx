
"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";

type UserRole = "student" | "tutor" | "admin";

interface NavbarUser {
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
}

interface NavbarProps {
  user?: NavbarUser | null;
  onSignOut?: () => void;
}

const navLinks = [
  { name: "Explore", href: "/tuitions" },
  { name: "For Tutors", href: "/for-tutors" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Pro Plans", href: "/pricing" },
];

const dashboardRoutes: Record<UserRole, string> = {
  student: "/dashboard/student",
  tutor: "/dashboard/tutor",
  admin: "/dashboard/admin",
};

export default function Navbar({
  user = null,
  onSignOut,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardLink = user
    ? dashboardRoutes[user.role]
    : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-[#183F38]/10 bg-[#F7F4EC]">
      <div className="mx-auto flex min-h-[82px] max-w-7xl items-center justify-between px-5 md:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
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
        <nav className="hidden items-center gap-7 lg:flex">
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
          {user ? (
            <>
              <Link
                href={dashboardLink}
                className="text-sm font-semibold text-[#183F38] hover:text-[#B58A35]"
              >
                Dashboard
              </Link>

              <Link
                href="/profile"
                className="text-sm font-semibold text-[#183F38] hover:text-[#B58A35]"
              >
                {user.name}
                <span className="ml-1 text-xs text-[#9A7B3F]">
                  ({user.role})
                </span>
              </Link>

              <button
                onClick={onSignOut}
                className="rounded-full border border-[#183F38]/25 px-4 py-2 text-sm font-semibold text-[#183F38] transition hover:bg-[#DCE9E2]"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-[#183F38] hover:text-[#B58A35]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#183F38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28584E]"
              >
                Find a Tutor <span className="ml-1">↗</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-[#183F38] hover:bg-[#DCE9E2] lg:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#183F38]/10 bg-[#F7F4EC] px-5 py-5 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#354B42] hover:text-[#B58A35]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="my-5 border-t border-[#183F38]/10" />

          {user ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-semibold text-[#183F38]">
                  {user.name}
                </p>
                <p className="text-xs capitalize text-[#9A7B3F]">
                  {user.role}
                </p>
              </div>

              <Link
                href={dashboardLink}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#183F38]"
              >
                Dashboard
              </Link>

              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#183F38]"
              >
                Update Profile
              </Link>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  onSignOut?.();
                }}
                className="text-left text-sm font-semibold text-red-600"
              >
                Sign Out
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
                Find a Tutor ↗
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
