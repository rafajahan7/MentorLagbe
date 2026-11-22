
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Users,
  Clock,
  BookOpen,
  CalendarDays,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

import { updateTutorApplicationStatus } from "@/lib/actions/tutor";

interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  monthlyFee: number;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string | null;
}

interface ApplicantsTableProps {
  applications: Application[];
}

const statusStyles = {
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  accepted:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  rejected:
    "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
};

export default function ApplicantsTable({
  applications: initialApplications,
}: ApplicantsTableProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleStatusUpdate(
    applicationId: string,
    status: "accepted" | "rejected"
  ) {
    const action = status === "accepted" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} this application?`
    );

    if (!confirmed) return;

    setLoadingId(applicationId);
    setMessage("");

    try {
      const result = await updateTutorApplicationStatus(
        applicationId,
        status
      );

      if (result.success) {
        setApplications((previous) =>
          previous.map((application) =>
            application._id === applicationId
              ? { ...application, status }
              : application
          )
        );

        setMessage(result.message);
        toast.success(result.message);
      } else {
        setMessage(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Application status update failed:", error);

      setMessage("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  const pendingCount = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  return (
    <div>
      {/* Statistics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Pending Applications
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-700 dark:text-amber-400">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Accepted Applications
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {acceptedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Rejected Applications
          </p>
          <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
            {rejectedCount}
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-border bg-card px-5 py-3 text-sm text-card-foreground">
          {message}
        </div>
      )}

      {/* Applications */}
      {applications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Users
            size={44}
            className="mx-auto text-[#B58A35]"
          />

          <h2 className="mt-4 text-xl font-bold text-card-foreground">
            No applicants yet
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Student applications for your tuition posts will appear here.
          </p>

          <Link
            href="/dashboard/tutor/my-tuitions"
            className="mt-6 inline-flex rounded-xl bg-[#183F38] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#24564B]"
          >
            View My Tuitions
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((application) => (
            <article
              key={application._id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors md:p-7"
            >
              {/* Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-start">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#DCE9E2] px-3 py-1 text-xs font-semibold text-[#183F38] dark:bg-[#29443D] dark:text-[#DCE9E2]">
                    <BookOpen size={13} />
                    {application.tuitionTitle}
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-card-foreground">
                    {application.studentName}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Applied{" "}
                    {application.appliedAt
                      ? new Date(application.appliedAt).toLocaleDateString(
                          "en-BD",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "Date unavailable"}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-xs font-bold capitalize ${statusStyles[application.status]}`}
                >
                  {application.status}
                </span>
              </div>

              {/* Applicant Information */}
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <Mail
                    size={18}
                    className="mt-1 shrink-0 text-[#B58A35]"
                  />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Email Address
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-card-foreground">
                      {application.studentEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone
                    size={18}
                    className="mt-1 shrink-0 text-[#B58A35]"
                  />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="mt-1 text-sm font-medium text-card-foreground">
                      {application.studentPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={18}
                    className="mt-1 shrink-0 text-[#B58A35]"
                  />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Preferred Schedule
                    </p>
                    <p className="mt-1 text-sm font-medium text-card-foreground">
                      {application.preferredSchedule}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock
                    size={18}
                    className="mt-1 shrink-0 text-[#B58A35]"
                  />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Monthly Tuition Fee
                    </p>
                    <p className="mt-1 text-sm font-bold text-card-foreground">
                      ৳{application.monthlyFee.toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Note */}
              <div className="mt-6 rounded-xl bg-muted p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare
                    size={17}
                    className="text-[#B58A35]"
                  />
                  <p className="text-sm font-semibold text-card-foreground">
                    Student Note
                  </p>
                </div>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {application.studentNote || "No additional note provided."}
                </p>
              </div>

              {/* Actions */}
              {application.status === "pending" && (
                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusUpdate(application._id, "rejected")
                    }
                    disabled={loadingId !== null}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                  >
                    <XCircle size={17} />
                    {loadingId === application._id
                      ? "Updating..."
                      : "Reject"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusUpdate(application._id, "accepted")
                    }
                    disabled={loadingId !== null}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#183F38] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#24564B] disabled:opacity-50"
                  >
                    <CheckCircle size={17} />
                    {loadingId === application._id
                      ? "Updating..."
                      : "Accept"}
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
