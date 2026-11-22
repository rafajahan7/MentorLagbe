
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";

import { auth } from "@/lib/auth";
import { getAllTransactions } from "@/lib/actions/admin";
import TransactionsTable from "@/components/admin/transactions-table";

export const metadata: Metadata = {
  title: "Transaction Management | MentorLagbe",
  description: "View and manage subscription payment records.",
};

export const instant = false;

export default async function AdminTransactionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  if (session.user.role !== "admin") redirect("/");

  const result = await getAllTransactions();

  return (
    <main className="min-h-screen bg-background px-5 py-12 text-foreground md:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard/admin"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={17} />
          Back to Admin Overview
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCE9E2] dark:bg-[#183F38]">
            <CreditCard size={27} className="text-[#183F38] dark:text-[#DCE9E2]" />
          </div>

          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Transaction Management
          </h1>

          <p className="mt-2 text-muted-foreground">
            Monitor successful Pro subscription payments and revenue.
          </p>
        </div>

        {result.success ? (
          <TransactionsTable transactions={result.transactions} />
        ) : (
          <div className="rounded-2xl border border-red-200 bg-card p-8 text-center dark:border-red-900">
            <p className="font-medium text-red-700 dark:text-red-400">
              Unable to load transaction records.
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Please refresh the page and try again.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
