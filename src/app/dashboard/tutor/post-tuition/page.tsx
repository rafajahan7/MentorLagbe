
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";

import PostTuitionForm from "@/components/tuitions/post-tuition-form";

export const metadata: Metadata = {
  title: "Post a Tuition",
  description: "Create a new tuition opportunity on MentorLagbe.",
};

export default function PostTuitionPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/tutor"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-[#B58A35]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-10">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#183F38] text-white">
            <GraduationCap size={28} />
          </div>

          <p className="text-xs font-bold tracking-[0.2em] text-[#B58A35]">
            GROW YOUR TEACHING JOURNEY
          </p>

          <h1 className="mt-3 text-3xl font-bold text-foreground md:text-4xl">
            Post a Tuition
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Share your teaching opportunity and connect with students
            looking for the right tutor.
          </p>
        </div>

        <PostTuitionForm />
      </div>
    </main>
  );
}
