
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
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
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
    } else {
      setMessage(result.message);
    }

    setLoadingId(null);
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
        <div className="rounded-2xl border border-[#183F38]/10 bg-white p-5">
          <p className="text-sm text-[#68736C]">Pending Applications</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">
            {pendingCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#183F38]/10 bg-white p-5">
          <p className="text-sm text-[#68736C]">Accepted Applications</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {acceptedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-[#183F38]/10 bg-white p-5">
          <p className="text-sm text-[#68736C]">Rejected Applications</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {rejectedCount}
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-[#183F38]/10 bg-white px-5 py-3 text-sm text-[#183F38]">
          {message}
        </div>
      )}

      {/* Applications */}
      {applications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#183F38]/20 bg-white px-6 py-16 text-center">
          <Users size={44} className="mx-auto text-[#B58A35]" />

          <h2 className="mt-4 text-xl font-bold text-[#183F38]">
            No applicants yet
          </h2>

          <p className="mt-2 text-sm text-[#68736C]">
            Student applications for your tuition posts will appear here.
          </p>

          <Link
            href="/dashboard/tutor/my-tuitions"
            className="mt-6 inline-flex rounded-xl bg-[#183F38] px-6 py-3 text-sm font-semibold text-white hover:bg-[#24564B]"
          >
            View My Tuitions
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((application) => (
            <article
              key={application._id}
              className="rounded-2xl border border-[#183F38]/10 bg-white p-5 shadow-sm md:p-7"
            >
              {/* Header */}
              <div className="flex flex-col justify-between gap-4 border-b border-[#183F38]/10 pb-5 sm:flex-row sm:items-start">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#DCE9E2] px-3 py-1 text-xs font-semibold text-[#183F38]">
                    <BookOpen size={13} />
                    {application.tuitionTitle}
                  </span>

                  <h2 className="mt-3 text-xl font-bold text-[#183F38]">
                    {application.studentName}
                  </h2>

                  <p className="mt-1 text-sm text-[#68736C]">
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
                  <Mail size={18} className="mt-1 shrink-0 text-[#B58A35]" />
                  <div>
                    <p className="text-xs font-medium text-[#89928C]">
                      Email Address
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-[#183F38]">
                      {application.studentEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-1 shrink-0 text-[#B58A35]" />
                  <div>
                    <p className="text-xs font-medium text-[#89928C]">
                      Phone Number
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#183F38]">
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
                    <p className="text-xs font-medium text-[#89928C]">
                      Preferred Schedule
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#183F38]">
                      {application.preferredSchedule}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-1 shrink-0 text-[#B58A35]" />
                  <div>
                    <p className="text-xs font-medium text-[#89928C]">
                      Monthly Tuition Fee
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#183F38]">
                      ৳{application.monthlyFee.toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Note */}
              <div className="mt-6 rounded-xl bg-[#F7F4EC] p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare size={17} className="text-[#B58A35]" />
                  <p className="text-sm font-semibold text-[#183F38]">
                    Student Note
                  </p>
                </div>

                <p className="mt-2 text-sm leading-6 text-[#68736C]">
                  {application.studentNote || "No additional note provided."}
                </p>
              </div>

              {/* Actions */}
              {application.status === "pending" && (
                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#183F38]/10 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusUpdate(application._id, "rejected")
                    }
                    disabled={loadingId !== null}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
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
                    className="inline-flex items-center gap-2 rounded-xl bg-[#183F38] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#24564B] disabled:opacity-50"
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
