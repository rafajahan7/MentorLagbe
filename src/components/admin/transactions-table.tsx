
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
      {/* Revenue summary */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#183F38]/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#68736C]">
              Total Successful Transactions
            </p>
            <div className="rounded-xl bg-[#DCE9E2] p-3">
              <Receipt size={21} className="text-[#183F38]" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-[#183F38]">
            {transactions.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-[#183F38]/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#68736C]">
              Total Revenue
            </p>
            <div className="rounded-xl bg-[#FFF2D6] p-3">
              <CreditCard size={21} className="text-[#91640D]" />
            </div>
          </div>

          <h2 className="mt-4 text-3xl font-bold text-[#183F38]">
            {transactions.length === 0
              ? "৳0"
              : currencies.length === 1
                ? formatAmount(totalRevenue, currencies[0])
                : "Multiple currencies"}
          </h2>

          {currencies.length > 1 && (
            <p className="mt-2 text-xs text-[#68736C]">
              Revenue is displayed separately by currency in the table.
            </p>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative rounded-2xl border border-[#183F38]/10 bg-white p-5">
        <Search
          size={18}
          className="absolute left-9 top-1/2 -translate-y-1/2 text-[#89928C]"
        />

        <input
          type="text"
          placeholder="Search by user, email, or transaction ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-xl border border-[#183F38]/15 bg-[#F7F4EC] py-3 pl-11 pr-4 text-sm text-[#242C2A] outline-none focus:border-[#183F38]"
        />
      </div>

      {/* Transactions */}
      <div className="overflow-hidden rounded-2xl border border-[#183F38]/10 bg-white">
        <div className="flex items-center justify-between border-b border-[#183F38]/10 p-5">
          <h2 className="font-semibold text-[#183F38]">
            Payment Records
          </h2>

          <span className="text-sm text-[#68736C]">
            {filteredTransactions.length} records
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <CreditCard
              size={42}
              className="mx-auto text-[#89928C]"
            />

            <h3 className="mt-4 font-semibold text-[#183F38]">
              {transactions.length === 0
                ? "No transactions yet"
                : "No matching transactions"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-[#68736C]">
              {transactions.length === 0
                ? "Successful Stripe subscription payments will appear here once payment integration is complete."
                : "Try searching with a different name, email, or transaction ID."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-[#F7F4EC] text-xs uppercase tracking-wide text-[#68736C]">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Transaction ID</th>
                  <th className="px-5 py-4">Payment Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#183F38]/10">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-[#F7F4EC]/60">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#183F38]">
                        {transaction.userName}
                      </p>
                      <p className="mt-1 text-xs text-[#89928C]">
                        {transaction.userEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4 capitalize text-[#68736C]">
                      {transaction.userRole}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#DCE9E2] px-3 py-1 text-xs font-semibold text-[#183F38]">
                        {transaction.planName}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#183F38]">
                      {formatAmount(
                        transaction.amount,
                        transaction.currency
                      )}
                    </td>

                    <td className="max-w-[180px] truncate px-5 py-4 font-mono text-xs text-[#68736C]">
                      {transaction.transactionId || "—"}
                    </td>

                    <td className="px-5 py-4 text-[#68736C]">
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
