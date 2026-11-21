
"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function JWTTestPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testRole = async (role: string) => {
    try {
      setLoading(true);
      setResult("");

      const response = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/api/test/${role}`);

      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Role Authorization Test</h1>

      <p>Test access permissions using your signed-in account.</p>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          disabled={loading}
          onClick={() => testRole("student")}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-50"
        >
          Test Student
        </button>

        <button
          disabled={loading}
          onClick={() => testRole("tutor")}
          className="rounded-lg bg-green-700 px-5 py-3 text-white disabled:opacity-50"
        >
          Test Tutor
        </button>

        <button
          disabled={loading}
          onClick={() => testRole("admin")}
          className="rounded-lg bg-purple-700 px-5 py-3 text-white disabled:opacity-50"
        >
          Test Admin
        </button>
      </div>

      {loading && <p>Checking permissions...</p>}

      {result && (
        <pre className="w-full max-w-2xl overflow-auto rounded-lg bg-gray-100 p-5 text-sm text-gray-900">
          {result}
        </pre>
      )}
    </main>
  );
}
