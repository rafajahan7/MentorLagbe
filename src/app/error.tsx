
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#F7F4EC] px-6 py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FCE8E2]">
          <AlertTriangle className="h-10 w-10 text-[#D77C63]" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#D77C63]">
          Something went wrong
        </p>

        <h1 className="mb-4 text-3xl font-bold text-[#183F38] sm:text-4xl">
          We Hit a Small Bump!
        </h1>

        <p className="mb-8 text-base leading-7 text-[#68736C]">
          An unexpected error occurred while loading this page.
          Please try again or return to the homepage.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183F38] px-6 py-3 font-semibold text-white transition hover:bg-[#24564B]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#183F38] px-6 py-3 font-semibold text-[#183F38] transition hover:bg-[#DCE9E2]"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
