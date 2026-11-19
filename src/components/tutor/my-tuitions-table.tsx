
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  BookOpen,
  X,
} from "lucide-react";
import {
  deleteMyTuition,
  toggleMyTuitionStatus,
  updateMyTuition,
} from "@/lib/actions/tutor";
import ImageUpload from "@/components/tuitions/image-upload";

interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string | null;
}

interface MyTuitionsTableProps {
  tuitions: Tuition[];
}

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export default function MyTuitionsTable({
  tuitions: initialTuitions,
}: MyTuitionsTableProps) {
  const [tuitions, setTuitions] = useState(initialTuitions);
  const [editingTuition, setEditingTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    subject: "",
    classLevel: "",
    mode: "Offline" as "Online" | "Offline",
    location: "",
    monthlyFee: "",
    daysPerWeek: "5",
    description: "",
    bannerImage: "",
  });

  function openEditModal(tuition: Tuition) {
    setEditingTuition(tuition);

    setForm({
      title: tuition.title,
      subject: tuition.subject,
      classLevel: tuition.classLevel,
      mode: tuition.mode,
      location: tuition.location,
      monthlyFee: String(tuition.monthlyFee),
      daysPerWeek: String(tuition.daysPerWeek),
      description: tuition.description,
      bannerImage: tuition.bannerImage || "",
    });

    setMessage("");
  }

  function closeEditModal() {
    setEditingTuition(null);
    setMessage("");
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingTuition) return;

    const monthlyFee = Number(form.monthlyFee);
    const daysPerWeek = Number(form.daysPerWeek);

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.classLevel.trim() ||
      !form.location.trim() ||
      !form.description.trim() ||
      !Number.isFinite(monthlyFee) ||
      monthlyFee <= 0 ||
      !Number.isInteger(daysPerWeek) ||
      daysPerWeek < 1 ||
      daysPerWeek > 7
    ) {
      setMessage("Please enter valid information in all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    const result = await updateMyTuition(editingTuition._id, {
      ...form,
      monthlyFee,
      daysPerWeek,
    });

    if (result.success) {
      setTuitions((previous) =>
        previous.map((tuition) =>
          tuition._id === editingTuition._id
            ? {
                ...tuition,
                ...form,
                monthlyFee,
                daysPerWeek,
              }
            : tuition
        )
      );

      closeEditModal();
      setMessage("Tuition updated successfully.");
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  }

  async function handleDelete(tuitionId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tuition? Its associated applications will also be deleted."
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");

    const result = await deleteMyTuition(tuitionId);

    if (result.success) {
      setTuitions((previous) =>
        previous.filter((tuition) => tuition._id !== tuitionId)
      );
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  }

  async function handleToggle(tuition: Tuition) {
    setLoading(true);
    setMessage("");

    const nextStatus = !tuition.isActive;

    const result = await toggleMyTuitionStatus(
      tuition._id,
      nextStatus
    );

    if (result.success) {
      setTuitions((previous) =>
        previous.map((item) =>
          item._id === tuition._id
            ? { ...item, isActive: nextStatus }
            : item
        )
      );

      setMessage(result.message);
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  }

  return (
    <div>
      {message && (
        <div className="mb-5 rounded-xl border border-[#183F38]/10 bg-white px-5 py-3 text-sm text-[#183F38]">
          {message}
        </div>
      )}

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#183F38]/10 bg-white p-5">
          <p className="text-sm text-[#68736C]">Total Posts</p>
          <p className="mt-2 text-2xl font-bold text-[#183F38]">
            {tuitions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#183F38]/10 bg-white p-5">
          <p className="text-sm text-[#68736C]">Approved</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {tuitions.filter((item) => item.approvalStatus === "approved").length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#183F38]/10 bg-white p-5">
          <p className="text-sm text-[#68736C]">Pending Review</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">
            {tuitions.filter((item) => item.approvalStatus === "pending").length}
          </p>
        </div>
      </div>

      {/* Tuition List */}
      {tuitions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#183F38]/20 bg-white px-6 py-16 text-center">
          <BookOpen size={42} className="mx-auto text-[#B58A35]" />

          <h2 className="mt-4 text-xl font-bold text-[#183F38]">
            No tuition posts yet
          </h2>

          <p className="mt-2 text-sm text-[#68736C]">
            Create your first tuition opportunity to get started.
          </p>

          <Link
            href="/dashboard/tutor/post-tuition"
            className="mt-6 inline-flex rounded-xl bg-[#183F38] px-6 py-3 text-sm font-semibold text-white hover:bg-[#24564B]"
          >
            Post a Tuition
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {tuitions.map((tuition) => (
            <div
              key={tuition._id}
              className="overflow-hidden rounded-2xl border border-[#183F38]/10 bg-white p-5 shadow-sm md:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row">
                {/* Banner */}
                <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-[#DCE9E2] sm:h-40 lg:w-56">
                  {tuition.bannerImage ? (
                    <img
                      src={tuition.bannerImage}
                      alt={tuition.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen size={42} className="text-[#183F38]/40" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#DCE9E2] px-3 py-1 text-xs font-semibold text-[#183F38]">
                      {tuition.subject}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[tuition.approvalStatus]}`}
                    >
                      {tuition.approvalStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        tuition.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tuition.isActive ? "Active" : "Closed"}
                    </span>
                  </div>

                  <h2 className="mt-3 text-xl font-bold text-[#183F38]">
                    {tuition.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#68736C]">
                    <span>{tuition.classLevel}</span>
                    <span>{tuition.mode}</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={15} />
                      {tuition.location}
                    </span>
                    <span>{tuition.daysPerWeek} days/week</span>
                  </div>

                  <p className="mt-3 text-lg font-bold text-[#183F38]">
                    ৳{tuition.monthlyFee.toLocaleString("en-BD")}
                    <span className="text-sm font-normal text-[#68736C]">
                      {" "} / month
                    </span>
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#68736C]">
                    {tuition.description}
                  </p>

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(tuition)}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#183F38]/15 px-4 py-2 text-sm font-semibold text-[#183F38] hover:bg-[#DCE9E2] disabled:opacity-50"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggle(tuition)}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#183F38]/15 px-4 py-2 text-sm font-semibold text-[#183F38] hover:bg-[#DCE9E2] disabled:opacity-50"
                    >
                      {tuition.isActive ? (
                        <>
                          <EyeOff size={15} />
                          Close
                        </>
                      ) : (
                        <>
                          <Eye size={15} />
                          Activate
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(tuition._id)}
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingTuition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#183F38]">
                  Edit Tuition
                </h2>
                <p className="mt-1 text-sm text-[#68736C]">
                  Update your tuition information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={loading}
                className="rounded-full p-2 text-[#68736C] hover:bg-[#F7F4EC]"
                aria-label="Close edit form"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#183F38]">
                  Tuition Title
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#183F38]/15 px-4 py-3 text-sm outline-none focus:border-[#183F38]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#183F38]">
                    Subject
                  </label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#183F38]/15 px-4 py-3 text-sm outline-none focus:border-[#183F38]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#183F38]">
                    Class Level
                  </label>
                  <input
                    required
                    value={form.classLevel}
                    onChange={(e) =>
                      setForm({ ...form, classLevel: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#183F38]/15 px-4 py-3 text-sm outline-none focus:border-[#183F38]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#183F38]">
                    Mode
                  </label>
                  <select
                    value={form.mode}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mode: e.target.value as "Online" | "Offline",
                      })
                    }
                    className="w-full rounded-xl border border-[#183F38]/15 px-4 py-3 text-sm outline-none focus:border-[#183F38]"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#183F38]">
                    Location
                  </label>
                  <input
                    required
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#183F38]/15 px-4 py-3 text-sm outline-none focus:border-[#183F38]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#183F38]">
                    Monthly Fee (৳)
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.monthlyFee}
                    onChange={(e) =>
                      setForm({ ...form, monthlyFee: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#183F38]/15 px-4 py-3 text-sm outline-none focus:border-[#183F38]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#183F38]">
                    Days per Week
                  </label>
                  <select
                    value={form.daysPerWeek}
                    onChange={(e) =>
                      setForm({ ...form, daysPerWeek: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#183F38]/15 px-4 py-3 text-sm outline-none focus:border-[#183F38]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <option key={day} value={day}>
                        {day} days
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#183F38]">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#183F38]/15 px-4 py-3 text-sm outline-none focus:border-[#183F38]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#183F38]">
                  Banner Image
                </label>
                <ImageUpload
                  value={form.bannerImage}
                  onChange={(value) =>
                    setForm({ ...form, bannerImage: value })
                  }
                />
              </div>

              {message && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {message}
                </p>
              )}

              <div className="flex flex-wrap justify-end gap-3 border-t border-[#183F38]/10 pt-5">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={loading}
                  className="rounded-xl border border-[#183F38]/15 px-5 py-3 text-sm font-semibold text-[#183F38]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-[#183F38] px-6 py-3 text-sm font-semibold text-white hover:bg-[#24564B] disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
