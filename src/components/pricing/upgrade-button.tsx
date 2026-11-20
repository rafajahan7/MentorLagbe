
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpgrade() {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      toast.loading("Preparing your Pro checkout...", {
        id: "stripe-checkout",
      });

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.dismiss("stripe-checkout");
        toast.error("Please sign in before upgrading.");
        window.location.href = "/sign-in";
        return;
      }

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.message || "Could not start checkout.");
      }

      toast.dismiss("stripe-checkout");
      toast.success("Redirecting you to secure Stripe Checkout...");

      window.location.href = data.url;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setError(errorMessage);

      toast.dismiss("stripe-checkout");
      toast.error(errorMessage);

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
