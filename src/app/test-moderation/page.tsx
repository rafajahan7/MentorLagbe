
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
    <main className="min-h-screen bg-background px-5 py-12 text-foreground">
      <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Test Admin Moderation API
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Enter a pending tuition ID to test the moderation actions.
          </p>
        </div>

        <input
          type="text"
          placeholder="Enter pending tuition ID"
          value={tuitionId}
          onChange={(e) => setTuitionId(e.target.value)}
          disabled={loading}
          className="w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#183F38] focus:ring-2 focus:ring-[#183F38]/10 dark:focus:border-[#D9A441] disabled:opacity-60"
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleModeration("approve")}
            disabled={loading}
            className="rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Approve"}
          </button>

          <button
            type="button"
            onClick={() => handleModeration("reject")}
            disabled={loading}
            className="rounded-lg bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Reject"}
          </button>
        </div>

        {message && (
          <p
            role="status"
            className="break-words rounded-lg border border-border bg-muted p-4 text-sm text-foreground"
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
