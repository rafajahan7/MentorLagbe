
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/sign-in";
        return;
      }

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.message || "Could not start checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full rounded-xl bg-[#183F38] px-6 py-3 font-semibold text-white transition hover:bg-[#24584E] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting...
          </span>
        ) : (
          "Upgrade to Pro"
        )}
      </button>

      {error && (
        <p className="mt-3 text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
