
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        const message =
          result.error.message || "Invalid email or password.";

        setError(message);
        toast.error(message);
        return;
      }

      const user = result.data?.user;
      const role = user?.role;

      let dashboardPath = "/";

      if (role === "student") {
        dashboardPath = "/dashboard/student";
      } else if (role === "tutor") {
        dashboardPath = "/dashboard/tutor";
      } else if (role === "admin") {
        dashboardPath = "/dashboard/admin";
      }

      toast.success("Signed in successfully!", {
        description: "Welcome back to MentorLagbe!",
        duration: 3000,
      });

      // Allow the notification to appear before navigation.
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push(dashboardPath);
      router.refresh();
    } catch {
      const message = "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
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
              <h1 className="text-xl font-bold">
                MentorLagbe
              </h1>
              <p className="text-[9px] tracking-[2px] text-[#D9A441]">
                LEARN. GROW. CONNECT.
              </p>
            </div>
          </Link>

          <div className="my-16">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[3px] text-[#D9A441]">
              Welcome Back
            </p>

            <h2 className="max-w-md text-4xl font-bold leading-tight md:text-5xl">
              Your next learning chapter starts here.
            </h2>

            <p className="mt-6 max-w-md leading-7 text-white/70">
              Connect with learners and educators, discover
              opportunities, and continue growing with MentorLagbe.
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
              Your account
            </p>

            <h2 className="text-3xl font-bold text-[#183F38]">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter your details to access your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#183F38] focus:ring-2 focus:ring-[#183F38]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
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
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-[#183F38] hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
