
"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function TestTuitionPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      setMessage("");

      const result = await apiRequest<{
        success: boolean;
        message: string;
        data?: {
          _id: string;
          title: string;
          approvalStatus: string;
        };
      }>("/api/tuitions", {
        method: "POST",
        body: JSON.stringify({
          title: "Mathematics Tutor Needed",
          subject: "Mathematics",
          classLevel: "Class 10",
          mode: "Online",
          location: "Dhaka",
          monthlyFee: 5000,
          daysPerWeek: 4,
          bannerImage: "",
          description:
            "Looking for an experienced mathematics tutor for Class 10.",
        }),
      });

      setMessage(
        `${result.message} Tuition ID: ${result.data?._id}`
      );
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
            Test Create Tuition API
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Use this page to test the tuition creation API.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          disabled={loading}
          className="rounded-lg bg-[#183F38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28584E] dark:bg-[#D9A441] dark:text-[#242C2A] dark:hover:bg-[#E8B94F] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Test Tuition"}
        </button>

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
