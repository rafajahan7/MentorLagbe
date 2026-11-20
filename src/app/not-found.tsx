import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#F7F4EC] px-6 py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#DCE9E2]">
          <SearchX className="h-10 w-10 text-[#183F38]" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#D9A441]">
          Error 404
        </p>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#183F38] sm:text-5xl">
          Page Not Found
        </h1>

        <p className="mb-8 text-base leading-7 text-[#68736C]">
          The page you're looking for doesn't exist or may have been moved.
          Let's help you find your way back to learning.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#183F38] px-6 py-3 font-semibold text-white transition hover:bg-[#24564B]"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/tuitions"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#183F38] px-6 py-3 font-semibold text-[#183F38] transition hover:bg-[#DCE9E2]"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Tuitions
          </Link>
        </div>
      </div>
    </main>
  );
}