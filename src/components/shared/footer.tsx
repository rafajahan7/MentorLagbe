
import Link from "next/link";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Why MentorLagbe", href: "/#why-mentorlagbe" },
  { label: "Pricing", href: "/#pricing" },
];

const accountLinks = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Create Account", href: "/sign-up" },
  { label: "My Dashboard", href: "/dashboard" },
];

export default function Footer() {
  return (
    <footer className="bg-[#183F38] text-white dark:bg-[#142D29]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-16 md:pt-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9A441] text-xl font-black text-[#183F38]">
                M
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Mentor<span className="text-[#D9A441]">Lagbe</span>
              </span>
            </Link>

            <p className="mt-5 text-sm font-medium text-[#D9A441]">
              The Learning Exchange
            </p>

            <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
              Connecting students with the right tutors and helping
              educators share their knowledge. Learn, teach, and grow
              together with MentorLagbe.
            </p>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg font-bold transition hover:border-[#D9A441] hover:bg-[#D9A441] hover:text-[#183F38]"
              >
                𝕏
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 font-bold transition hover:border-[#D9A441] hover:bg-[#D9A441] hover:text-[#183F38]"
              >
                f
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-bold transition hover:border-[#D9A441] hover:bg-[#D9A441] hover:text-[#183F38]"
              >
                IG
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-bold transition hover:border-[#D9A441] hover:bg-[#D9A441] hover:text-[#183F38]"
              >
                in
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#D9A441]">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/70 transition hover:text-[#D9A441]"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#D9A441]">
              Your Account
            </h3>

            <ul className="mt-6 space-y-4">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-white/70 transition hover:text-[#D9A441]"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[#D9A441]">
              Get In Touch
            </h3>

            <div className="mt-6 space-y-5">
              <div className="flex items-start gap-3">
                <Mail
                  size={19}
                  className="mt-0.5 shrink-0 text-[#D9A441]"
                />
                <div>
                  <p className="text-xs text-white/45">Email</p>
                  <a
                    href="mailto:rafa.jahan@gmail.com"
                    className="mt-1 block break-all text-sm text-white/75 transition hover:text-[#D9A441]"
                  >
                    rafa.jahan@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={19}
                  className="mt-0.5 shrink-0 text-[#D9A441]"
                />
                <div>
                  <p className="text-xs text-white/45">Location</p>
                  <p className="mt-1 text-sm text-white/75">
                    Bangladesh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/50">
            © 2026 MentorLagbe. All rights reserved.
          </p>

          <p className="text-xs text-white/50">
            Made for learners, built for growth.
          </p>
        </div>
      </div>
    </footer>
  );
}
