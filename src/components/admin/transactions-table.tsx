
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  CreditCard,
  Receipt,
  CalendarDays,
} from "lucide-react";

interface Transaction {
  _id: string;
  userName: string;
  userEmail: string;
  userRole: string;
  planName: string;
  amount: number;
  currency: string;
  transactionId: string;
  paidAt: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({
  transactions,
}: TransactionsTableProps) {
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchableText = [
        transaction.userName,
        transaction.userEmail,
        transaction.transactionId,
        transaction.planName,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search.toLowerCase());
    });
  }, [transactions, search]);

  const totalRevenue = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const currencies = Array.from(
    new Set(transactions.map((transaction) => transaction.currency))
  );

  function formatDate(date: string) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount);
  }

  return (
    <div className="space-y-6">
      {/* Revenue Summary */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Successful Transactions
            </p>

            <div className="rounded-xl bg-[#DCE9E2] p-3 dark:bg-[#183F38]">
              <Receipt
                size={21}
                className="text-[#183F38] dark:text-[#DCE9E2]"
              />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-card-foreground">
            {transactions.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </p>

            <div className="rounded-xl bg-[#FFF2D6] p-3 dark:bg-[#4A3512]">
              <CreditCard
                size={21}
                className="text-[#91640D] dark:text-[#F5C96B]"
              />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-card-foreground">
            {transactions.length === 0
              ? "৳0"
              : currencies.length === 1
                ? formatAmount(totalRevenue, currencies[0])
                : "Multiple currencies"}
          </h2>

          {currencies.length > 1 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Revenue is displayed separately by currency in the table.
            </p>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative rounded-2xl border border-border bg-card p-5">
        <Search
          size={18}
          className="absolute left-9 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <input
          type="text"
          placeholder="Search by user, email, or transaction ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-input bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/20"
        />
      </div>

      {/* Transactions */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold text-card-foreground">
            Payment Records
          </h2>

          <span className="text-sm text-muted-foreground">
            {filteredTransactions.length} records
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <CreditCard
              size={42}
              className="mx-auto text-muted-foreground"
            />

            <h3 className="mt-4 font-semibold text-card-foreground">
              {transactions.length === 0
                ? "No transactions yet"
                : "No matching transactions"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {transactions.length === 0
                ? "Successful Stripe subscription payments will appear here once payment integration is complete."
                : "Try searching with a different name, email, or transaction ID."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Transaction ID</th>
                  <th className="px-5 py-4">Payment Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-card-foreground">
                        {transaction.userName}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {transaction.userEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4 capitalize text-muted-foreground">
                      {transaction.userRole}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#DCE9E2] px-3 py-1 text-xs font-semibold text-[#183F38] dark:bg-[#183F38] dark:text-[#DCE9E2]">
                        {transaction.planName}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-card-foreground">
                      {formatAmount(
                        transaction.amount,
                        transaction.currency
                      )}
                    </td>

                    <td className="max-w-[180px] truncate px-5 py-4 font-mono text-xs text-muted-foreground">
                      {transaction.transactionId || "—"}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={14} />
                        {formatDate(transaction.paidAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
