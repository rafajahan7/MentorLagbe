
"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function TestModerationPage() {
  const [tuitionId, setTuitionId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleModeration = async (
    action: "approve" | "reject"
  ) => {
    if (!tuitionId.trim()) {
      setMessage("Please enter a tuition ID.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/api/tuitions/${tuitionId}/${action}`, {
        method: "PATCH",
      });

      setMessage(result.message);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-5 p-8">
      <h1 className="text-2xl font-bold">
        Test Admin Moderation API
      </h1>

      <input
        type="text"
        placeholder="Enter pending tuition ID"
        value={tuitionId}
        onChange={(e) => setTuitionId(e.target.value)}
        className="w-full rounded-lg border p-3"
      />

      <div className="flex gap-3">
        <button
          onClick={() => handleModeration("approve")}
          disabled={loading}
          className="rounded-lg bg-green-700 px-5 py-3 text-white disabled:opacity-50"
        >
          Approve
        </button>

        <button
          onClick={() => handleModeration("reject")}
          disabled={loading}
          className="rounded-lg bg-red-700 px-5 py-3 text-white disabled:opacity-50"
        >
          Reject
        </button>
      </div>

      {message && (
        <p className="break-words rounded-lg bg-gray-100 p-4 text-gray-900">
          {message}
        </p>
      )}
    </div>
  );
}
