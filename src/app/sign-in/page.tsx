
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

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        const message =
          result.error.message || "Invalid email or password.";

        setError(message);
        toast.error(message);
        setLoading(false);
        return;
      }

      const role = result.data?.user?.role;

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
      });

      router.replace(dashboardPath);
      router.refresh();
    } catch (err) {
      console.error("Sign-in error:", err);

      const message = "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-5 py-12">
      <div className="mx-auto grid min-h-[80vh] max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl lg:grid-cols-2">

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
        <section className="flex items-center justify-center bg-card p-7 md:p-12">
          <div className="w-full max-w-md">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[2px] text-[#B58A35]">
              Your account
            </p>

            <h2 className="text-3xl font-bold text-card-foreground">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Enter your details to access your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#183F38] focus:ring-2 focus:ring-[#183F38]/10 dark:focus:border-[#D9A441] disabled:opacity-60"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#183F38] focus:ring-2 focus:ring-[#183F38]/10 dark:focus:border-[#D9A441] disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed"
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
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400"
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#183F38] px-5 py-3.5 font-semibold text-white transition hover:bg-[#28584E] dark:bg-[#D9A441] dark:text-[#242C2A] dark:hover:bg-[#E8B94F] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-[#242C2A]/30 dark:border-t-[#242C2A]" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-foreground transition hover:text-[#B58A35] hover:underline"
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
