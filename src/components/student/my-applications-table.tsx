
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  Mail,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { cancelApplication } from "@/lib/actions/student";

type ApplicationStatus = "pending" | "accepted" | "rejected";

interface StudentApplication {
  _id: string;
  tuitionTitle: string;
  tutorName: string;
  tutorEmail: string;
  monthlyFee: number;
  appliedAt: string;
  status: ApplicationStatus;
}

interface MyApplicationsTableProps {
  applications: StudentApplication[];
}

export default function MyApplicationsTable({
  applications: initialApplications,
}: MyApplicationsTableProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleCancel(applicationId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (!confirmed) return;

    setLoadingId(applicationId);
    setMessage("");
    setError("");

    try {
      const result = await cancelApplication(applicationId);

      if (!result.success) {
        setError(result.message);
        toast.error(result.message);
        return;
      }

      setApplications((previous) =>
        previous.filter((application) => application._id !== applicationId)
      );

      setMessage(result.message);
      toast.success(result.message);
    } catch (error) {
      console.error("Application cancellation failed:", error);

      const errorMessage = "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingId(null);
    }
  }

  function formatDate(date: string) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusStyle(status: ApplicationStatus) {
    switch (status) {
      case "accepted":
        return "bg-[#DCE9E2] text-[#183F38] dark:bg-[#29483D] dark:text-[#B9DDC9]";
      case "rejected":
        return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
      default:
        return "bg-[#FFF2D6] text-[#91640D] dark:bg-[#51452A] dark:text-[#F5D68A]";
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback */}
      {message && (
        <div className="rounded-xl border border-[#DCE9E2] bg-[#DCE9E2] p-4 text-sm text-[#183F38] dark:border-[#29483D] dark:bg-[#29483D] dark:text-[#B9DDC9]">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Application Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Your Applications
        </h2>

        <span className="rounded-full bg-[#DCE9E2] px-4 py-2 text-sm font-medium text-[#183F38] dark:bg-[#29483D] dark:text-[#B9DDC9]">
          {applications.length} Total
        </span>
      </div>

      {/* Empty State */}
      {applications.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <BookOpen
            size={44}
            className="mx-auto text-muted-foreground"
          />

          <h3 className="mt-4 text-xl font-semibold text-card-foreground">
            No applications yet
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Browse available tuition posts and apply for opportunities
            that interest you.
          </p>

          <Link
            href="/tuitions"
            className="mt-6 inline-flex rounded-xl bg-[#183F38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24574D]"
          >
            Browse Tuitions
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {applications.map((application) => (
            <article
              key={application._id}
              className="rounded-2xl border border-border bg-card p-5 transition hover:shadow-md md:p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-card-foreground">
                      {application.tuitionTitle}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(application.status)}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Monthly Fee:{" "}
                    <span className="font-semibold text-card-foreground">
                      ৳{application.monthlyFee.toLocaleString()}
                    </span>
                  </p>
                </div>

                <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays size={15} />
                  Applied: {formatDate(application.appliedAt)}
                </p>
              </div>

              {/* Tutor Information */}
              <div className="mt-5 grid gap-3 rounded-xl bg-muted p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Tutor Name
                  </p>

                  <p className="mt-1 font-medium text-foreground">
                    {application.tutorName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Tutor Email
                  </p>

                  <p className="mt-1 flex items-center gap-2 break-all text-sm text-foreground">
                    <Mail size={14} className="shrink-0" />
                    {application.tutorEmail}
                  </p>
                </div>
              </div>

              {/* Cancel Application */}
              {application.status === "pending" && (
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    disabled={loadingId !== null}
                    onClick={() => handleCancel(application._id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    {loadingId === application._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}

                    {loadingId === application._id
                      ? "Cancelling..."
                      : "Cancel Application"}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
