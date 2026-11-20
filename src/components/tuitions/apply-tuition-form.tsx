
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { applyForTuition } from "@/lib/actions/student";

interface ApplyTuitionFormProps {
  tuitionId: string;
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

export default function ApplyTuitionForm({
  tuitionId,
  userRole,
  userName,
  userEmail,
}: ApplyTuitionFormProps) {
  const router = useRouter();

  const [studentPhone, setStudentPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setMessage("");
    setSuccess(false);
    setLoading(true);

    try {
      const result = await applyForTuition({
        tuitionId,
        studentPhone,
        preferredSchedule,
        studentNote,
      });

      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        toast.success("Application submitted successfully!", {
          description: "The tutor will review your application.",
        });

        setStudentPhone("");
        setPreferredSchedule("");
        setStudentNote("");

        router.refresh();
      } else {
        toast.error("Application could not be submitted", {
          description: result.message,
        });
      }
    } catch {
      const errorMessage = "Something went wrong. Please try again.";

      setMessage(errorMessage);
      setSuccess(false);

      toast.error("Something went wrong", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  // Not logged in
  if (!userRole) {
    return (
      <div className="rounded-2xl border border-[#183F38]/10 bg-white p-6">
        <h2 className="text-xl font-bold text-[#183F38]">
          Interested in this tuition?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#68736C]">
          Sign in with your student account to apply for this tuition.
        </p>

        <a
          href="/sign-in"
          className="mt-5 inline-flex rounded-xl bg-[#183F38] px-6 py-3 font-semibold text-white transition hover:bg-[#24584D]"
        >
          Sign In to Apply
        </a>
      </div>
    );
  }

  // Only students can apply
  if (userRole !== "student") {
    return (
      <div className="rounded-2xl border border-[#183F38]/10 bg-white p-6">
        <h2 className="text-xl font-bold text-[#183F38]">
          Student Applications Only
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#68736C]">
          This application form is available only to student accounts.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-[#183F38]/10 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <span className="text-xs font-bold tracking-[0.18em] text-[#B58A35]">
          TAKE THE NEXT STEP
        </span>

        <h2 className="mt-2 text-2xl font-bold text-[#183F38]">
          Apply for This Tuition
        </h2>

        <p className="mt-2 text-sm text-[#68736C]">
          Complete the form below to send your application to the tutor.
        </p>
      </div>

      <div className="mb-6 rounded-xl bg-[#F7F4EC] p-4">
        <p className="text-sm text-[#68736C]">Applying as</p>
        <p className="mt-1 font-semibold text-[#183F38]">
          {userName || "Student"}
        </p>
        <p className="text-sm text-[#68736C]">{userEmail}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183F38]">
            Phone Number *
          </label>

          <input
            type="tel"
            required
            value={studentPhone}
            onChange={(event) => setStudentPhone(event.target.value)}
            placeholder="Enter your phone number"
            className="w-full rounded-xl border border-[#183F38]/15 bg-white px-4 py-3 text-sm text-[#242C2A] outline-none transition focus:border-[#183F38] focus:ring-2 focus:ring-[#183F38]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183F38]">
            Preferred Schedule *
          </label>

          <input
            type="text"
            required
            value={preferredSchedule}
            onChange={(event) => setPreferredSchedule(event.target.value)}
            placeholder="e.g. Saturday, Monday, Wednesday — 5 PM"
            className="w-full rounded-xl border border-[#183F38]/15 bg-white px-4 py-3 text-sm text-[#242C2A] outline-none transition focus:border-[#183F38] focus:ring-2 focus:ring-[#183F38]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183F38]">
            Additional Note
          </label>

          <textarea
            rows={4}
            value={studentNote}
            onChange={(event) => setStudentNote(event.target.value)}
            placeholder="Tell the tutor about your learning needs or expectations..."
            className="w-full resize-none rounded-xl border border-[#183F38]/15 bg-white px-4 py-3 text-sm text-[#242C2A] outline-none transition focus:border-[#183F38] focus:ring-2 focus:ring-[#183F38]/10"
          />
        </div>

        {message && (
          <div
            className={`rounded-xl p-4 text-sm ${
              success
                ? "bg-[#DCE9E2] text-[#183F38]"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#183F38] px-6 py-3.5 font-semibold text-white transition hover:bg-[#24584D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Apply for Tuition
            </>
          )}
        </button>
      </form>
    </section>
  );
}
