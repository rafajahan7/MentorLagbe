
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type UserRole = "student" | "tutor";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
  name,
  email,
  password,
  callbackURL: "/",
  role,
});

      if (result.error) {
        setError(result.error.message || "Registration failed.");
        return;
      }

      router.push(
        role === "student"
          ? "/dashboard/student"
          : "/dashboard/tutor"
      );

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F4EC] px-5 py-12">
      <div className="mx-auto grid min-h-[80vh] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">

        {/* Left Side */}
        <section className="flex flex-col justify-between bg-[#183F38] p-8 text-white md:p-12">
          <Link href="/" className="flex w-fit items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D9A441] text-[#183F38]">
              <GraduationCap size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold">MentorLagbe</h1>
              <p className="text-[9px] tracking-[2px] text-[#D9A441]">
                LEARN. GROW. CONNECT.
              </p>
            </div>
          </Link>

          <div className="my-16">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[3px] text-[#D9A441]">
              The Learning Exchange
            </p>

            <h2 className="max-w-md text-4xl font-bold leading-tight md:text-5xl">
              Every great journey begins with a connection.
            </h2>

            <p className="mt-6 max-w-md leading-7 text-white/70">
              Find the right tutor, share your knowledge, and make
              learning a meaningful part of your journey.
            </p>
          </div>

          <p className="text-xs text-white/50">
            © 2026 MentorLagbe. All rights reserved.
          </p>
        </section>

        {/* Right Side */}
        <section className="flex items-center justify-center p-7 md:p-12">
          <div className="w-full max-w-md">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[2px] text-[#B58A35]">
              Get started today
            </p>

            <h2 className="text-3xl font-bold text-[#183F38]">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Join MentorLagbe and start your learning journey.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#242C2A]">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#183F38] focus:ring-2 focus:ring-[#183F38]/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#242C2A]">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#183F38] focus:ring-2 focus:ring-[#183F38]/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#242C2A]">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#183F38] focus:ring-2 focus:ring-[#183F38]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#242C2A]">
                  I want to join as a
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`rounded-xl border p-4 text-left transition ${
                      role === "student"
                        ? "border-[#183F38] bg-[#DCE9E2]"
                        : "border-gray-200 hover:border-[#183F38]/40"
                    }`}
                  >
                    <span className="block font-bold text-[#183F38]">
                      Student
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      Find a tutor
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("tutor")}
                    className={`rounded-xl border p-4 text-left transition ${
                      role === "tutor"
                        ? "border-[#183F38] bg-[#DCE9E2]"
                        : "border-gray-200 hover:border-[#183F38]/40"
                    }`}
                  >
                    <span className="block font-bold text-[#183F38]">
                      Tutor
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      Share your knowledge
                    </span>
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#183F38] px-5 py-3.5 font-semibold text-white transition hover:bg-[#28584E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-bold text-[#183F38] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
