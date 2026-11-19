
"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Search,
  MapPin,
  CalendarDays,
  GraduationCap,
  Loader2,
} from "lucide-react";

import {
  updateTuitionApproval,
} from "@/lib/actions/admin";

type TuitionStatus = "pending" | "approved" | "rejected";

interface AdminTuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  monthlyFee: number;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: TuitionStatus;
  isActive: boolean;
  createdAt: string;
}

interface TuitionsTableProps {
  tuitions: AdminTuition[];
}

export default function TuitionsTable({
  tuitions: initialTuitions,
}: TuitionsTableProps) {
  const [tuitions, setTuitions] = useState(initialTuitions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredTuitions = useMemo(() => {
    return tuitions.filter((tuition) => {
      const searchMatch = [
        tuition.title,
        tuition.subject,
        tuition.tutorName,
        tuition.tutorEmail,
        tuition.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "all" ||
        tuition.approvalStatus === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [tuitions, search, statusFilter]);

  async function handleApproval(
    tuitionId: string,
    status: "approved" | "rejected"
  ) {
    setLoadingId(tuitionId);
    setMessage("");
    setError("");

    try {
      const result = await updateTuitionApproval(tuitionId, status);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setTuitions((previous) =>
        previous.map((tuition) =>
          tuition._id === tuitionId
            ? {
                ...tuition,
                approvalStatus: status,
                isActive: status === "approved",
              }
            : tuition
        )
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

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#183F38]/10 bg-white p-5 md:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#89928C]"
          />
          <input
            type="text"
            placeholder="Search tuition, subject, or tutor..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-[#183F38]/15 bg-[#F7F4EC] py-3 pl-11 pr-4 text-sm text-[#242C2A] outline-none focus:border-[#183F38]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-[#183F38]/15 bg-[#F7F4EC] px-4 py-3 text-sm text-[#242C2A] outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

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

      {/* Results */}
      <div className="overflow-hidden rounded-2xl border border-[#183F38]/10 bg-white">
        <div className="flex items-center justify-between border-b border-[#183F38]/10 p-5">
          <h2 className="font-semibold text-[#183F38]">
            Tuition Posts
          </h2>
          <span className="text-sm text-[#68736C]">
            {filteredTuitions.length} results
          </span>
        </div>

        {filteredTuitions.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <GraduationCap
              size={40}
              className="mx-auto text-[#89928C]"
            />
            <h3 className="mt-4 font-semibold text-[#183F38]">
              No tuition posts found
            </h3>
            <p className="mt-2 text-sm text-[#68736C]">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#183F38]/10">
            {filteredTuitions.map((tuition) => (
              <div
                key={tuition._id}
                className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[#183F38]">
                      {tuition.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        tuition.approvalStatus === "approved"
                          ? "bg-[#DCE9E2] text-[#183F38]"
                          : tuition.approvalStatus === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-[#FFF2D6] text-[#91640D]"
                      }`}
                    >
                      {tuition.approvalStatus}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[#68736C]">
                    {tuition.subject} · {tuition.classLevel} · {tuition.mode}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#68736C]">
                    <span>
                      Tutor: {tuition.tutorName}
                    </span>
                    <span>
                      {tuition.tutorEmail}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} />
                      {tuition.location}
                    </span>
                    <span>
                      ৳{tuition.monthlyFee.toLocaleString()}/month
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={13} />
                      {formatDate(tuition.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {tuition.approvalStatus !== "approved" && (
                    <button
                      type="button"
                      disabled={loadingId === tuition._id}
                      onClick={() =>
                        handleApproval(tuition._id, "approved")
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-[#183F38] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#24574D] disabled:opacity-50"
                    >
                      {loadingId === tuition._id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                      Approve
                    </button>
                  )}

                  {tuition.approvalStatus !== "rejected" && (
                    <button
                      type="button"
                      disabled={loadingId === tuition._id}
                      onClick={() =>
                        handleApproval(tuition._id, "rejected")
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {loadingId === tuition._id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <XCircle size={16} />
                      )}
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
