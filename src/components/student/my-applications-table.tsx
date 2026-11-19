
"use client";

import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Mail,
  MapPin,
  Trash2,
  Loader2,
} from "lucide-react";

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
        return;
      }

      setApplications((previous) =>
        previous.filter((application) => application._id !== applicationId)
      );

      setMessage(result.message);
    } catch {
      setError("Something went wrong. Please try again.");
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
        return "bg-[#DCE9E2] text-[#183F38]";
      case "rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-[#FFF2D6] text-[#91640D]";
    }
  }

  return (
    <div className="space-y-6">
      {/* Feedback */}
      {message && (
        <div className="rounded-xl bg-[#DCE9E2] p-4 text-sm text-[#183F38]">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Application count */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#183F38]">
          Your Applications
        </h2>

        <span className="rounded-full bg-[#DCE9E2] px-4 py-2 text-sm font-medium text-[#183F38]">
          {applications.length} Total
        </span>
      </div>

      {/* Empty state */}
      {applications.length === 0 ? (
        <div className="rounded-2xl border border-[#183F38]/10 bg-white px-6 py-16 text-center">
          <BookOpen
            size={44}
            className="mx-auto text-[#89928C]"
          />

          <h3 className="mt-4 text-xl font-semibold text-[#183F38]">
            No applications yet
          </h3>

          <p className="mt-2 text-sm text-[#68736C]">
            Browse available tuition posts and apply for opportunities
            that interest you.
          </p>

          <a
            href="/tuitions"
            className="mt-6 inline-flex rounded-xl bg-[#183F38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#24574D]"
          >
            Browse Tuitions
          </a>
        </div>
      ) : (
        <div className="grid gap-5">
          {applications.map((application) => (
            <article
              key={application._id}
              className="rounded-2xl border border-[#183F38]/10 bg-white p-5 transition hover:shadow-md md:p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-[#183F38]">
                      {application.tuitionTitle}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(application.status)}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[#68736C]">
                    Monthly Fee:{" "}
                    <span className="font-semibold text-[#183F38]">
                      ৳{application.monthlyFee.toLocaleString()}
                    </span>
                  </p>
                </div>

                <p className="inline-flex items-center gap-2 text-xs text-[#89928C]">
                  <CalendarDays size={15} />
                  Applied: {formatDate(application.appliedAt)}
                </p>
              </div>

              <div className="mt-5 grid gap-3 rounded-xl bg-[#F7F4EC] p-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#89928C]">Tutor Name</p>
                  <p className="mt-1 font-medium text-[#183F38]">
                    {application.tutorName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#89928C]">Tutor Email</p>
                  <p className="mt-1 flex items-center gap-2 break-all text-sm text-[#183F38]">
                    <Mail size={14} />
                    {application.tutorEmail}
                  </p>
                </div>
              </div>

              {application.status === "pending" && (
                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    disabled={loadingId === application._id}
                    onClick={() => handleCancel(application._id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {loadingId === application._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}

                    Cancel Application
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
