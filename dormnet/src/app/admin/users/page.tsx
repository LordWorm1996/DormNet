"use client";
import useSWR from "swr";
import type { IUser } from "@models/User";

const fetchWithCredentials = (url: string): Promise<IUser[]> =>
  fetch(url, { credentials: "include" }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<IUser[]>;
  });

export default function AdminUsersPage() {
  const {
    data: users,
    error,
    mutate,
  } = useSWR<IUser[]>("/api/admin/users", fetchWithCredentials);

  if (error) return <p className="text-red-500">Error loading users.</p>;
  if (!users) return <p>Loading users…</p>;

  async function handleAction(id: string, action: "ban" | "promote") {
    try {
      await fetch(`/api/admin/users/${id}/${action}`, {
        method: "POST",
        credentials: "include",
      });
      await mutate();
      alert(`User ${action}ed successfully`);
    } catch (err: unknown) {
      let msg = "Unknown error";
      if (err instanceof Error) {
        msg = err.message;
      } else if (typeof err === "string") {
        msg = err;
      }
      alert("Error: " + msg);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id.toString()} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2 space-x-2">
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleAction(u._id.toString(), "ban")}
                >
                  Ban
                </button>
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => handleAction(u._id.toString(), "promote")}
                >
                  Promote
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
