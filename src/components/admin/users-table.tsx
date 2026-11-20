
"use client";

import { useMemo, useState } from "react";
import { Search, Users, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { updateUserRole } from "@/lib/actions/admin";

type UserRole = "student" | "tutor" | "admin";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: UserRole;
  plan: string;
  createdAt: string;
}

interface UsersTableProps {
  users: AdminUser[];
  currentAdminId: string;
}

export default function UsersTable({
  users: initialUsers,
  currentAdminId,
}: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [users, search]);

  async function handleRoleChange(userId: string, newRole: UserRole) {
    const previousUser = users.find((user) => user._id === userId);

    if (!previousUser || previousUser.role === newRole || updatingId) return;

    setUpdatingId(userId);
    setMessage("");
    setError("");

    try {
      const result = await updateUserRole(userId, newRole);

      if (!result.success) {
        setError(result.message);
        toast.error(result.message);
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      setMessage(result.message);
      toast.success(result.message);
    } catch (err) {
      console.error("User role update failed:", err);

      const errorMessage = "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      {/* Search and summary */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCE9E2] text-[#183F38]">
            <Users size={22} />
          </div>

          <div>
            <h2 className="font-bold text-[#183F38]">
              Registered Users
            </h2>
            <p className="text-sm text-[#68736C]">
              {users.length} total accounts
            </p>
          </div>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#89928C]"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email or role..."
            className="w-full rounded-xl border border-[#183F38]/15 bg-white py-3 pl-11 pr-4 text-sm text-[#242C2A] outline-none focus:border-[#B58A35]"
          />
        </div>
      </div>

      {/* Feedback */}
      {message && (
        <div className="mb-4 rounded-xl bg-[#DCE9E2] px-4 py-3 text-sm font-medium text-[#183F38]">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl bg-[#F6DFD8] px-4 py-3 text-sm font-medium text-[#A34E37]">
          {error}
        </div>
      )}

      {/* Users table */}
      <div className="overflow-hidden rounded-2xl border border-[#183F38]/10 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#F7F4EC]">
              <tr className="text-xs font-bold uppercase tracking-wider text-[#68736C]">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Manage Role</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#183F38]/10">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="transition hover:bg-[#F7F4EC]/60"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#183F38] text-sm font-bold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-[#183F38]">
                          {user.name}
                        </p>
                        <p className="text-xs text-[#89928C]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-[#DCE9E2] px-3 py-1.5 text-xs font-bold capitalize text-[#183F38]">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                        user.plan === "pro"
                          ? "bg-[#F8EBCB] text-[#89651D]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.plan}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm text-[#68736C]">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-BD")
                      : "—"}
                  </td>

                  <td className="px-6 py-5">
                    {user._id === currentAdminId ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#68736C]">
                        <ShieldCheck size={15} />
                        Your account
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          disabled={updatingId !== null}
                          onChange={(event) =>
                            handleRoleChange(
                              user._id,
                              event.target.value as UserRole
                            )
                          }
                          className="rounded-lg border border-[#183F38]/15 bg-[#F7F4EC] px-3 py-2 text-sm text-[#183F38] outline-none focus:border-[#B58A35] disabled:opacity-50"
                        >
                          <option value="student">Student</option>
                          <option value="tutor">Tutor</option>
                          <option value="admin">Admin</option>
                        </select>

                        {updatingId === user._id && (
                          <Loader2
                            size={17}
                            className="animate-spin text-[#B58A35]"
                          />
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center text-sm text-[#68736C]"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-[#89928C]">
        Role changes are saved directly to the users collection.
      </p>
    </div>
  );
}
