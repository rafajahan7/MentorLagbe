
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
    <div className="mx-auto max-w-xl space-y-5 p-8">
      <h1 className="text-2xl font-bold">
        Test Create Tuition API
      </h1>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="rounded-lg bg-green-700 px-5 py-3 text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Test Tuition"}
      </button>

      {message && (
        <p className="break-words rounded-lg bg-gray-100 p-4 text-gray-900">
          {message}
        </p>
      )}
    </div>
  );
}
