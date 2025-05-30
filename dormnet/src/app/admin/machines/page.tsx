"use client";

import useSWR from "swr";
import { useState } from "react";
import type { IMachine } from "@models/Machine";

const fetchWithCredentials = async (url: string): Promise<IMachine[]> => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<IMachine[]>;
};

export default function AdminMachinesPage() {
  const {
    data: machines,
    error,
    mutate,
  } = useSWR<IMachine[]>("/api/admin/machine", fetchWithCredentials);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  if (error) return <p className="text-red-500">Error loading machines.</p>;
  if (!machines) return <p>Loading machines…</p>;

  const addMachine = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/admin/machine", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setName("");
      await mutate();
    } catch (err: unknown) {
      let msg = "Unknown error";
      if (err instanceof Error) msg = err.message;
      alert("Error: " + msg);
    } finally {
      setBusy(false);
    }
  };

  const deleteMachine = async (id: string) => {
    if (!confirm("Are you sure you want to delete this machine?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/machine/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      await mutate();
    } catch (err: unknown) {
      let msg = "Unknown error";
      if (err instanceof Error) msg = err.message;
      alert("Error: " + msg);
    } finally {
      setBusy(false);
    }
  };

  const startEditing = (machine: IMachine) => {
    setEditingId(machine._id);
    setEditName(machine.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/machine/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      setEditingId(null);
      setEditName("");
      await mutate();
    } catch (err: unknown) {
      let msg = "Unknown error";
      if (err instanceof Error) msg = err.message;
      alert("Error: " + msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Machine Management</h1>

      <form onSubmit={addMachine} className="mb-6 flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="New machine name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          required
        />
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {busy ? "Adding…" : "Add Machine"}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {machines.map((m) => (
            <li key={m._id} className="p-4 hover:bg-gray-50">
              {editingId === m._id ? (
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 p-2 border rounded"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={busy}
                    required
                  />
                  <button
                    onClick={() => saveEdit(m._id)}
                    disabled={busy || !editName.trim()}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={busy}
                    className="px-3 py-1 bg-gray-500 text-white rounded disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-lg">{m.name}</strong>
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                      {m.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(m)}
                      disabled={busy}
                      className="px-3 py-1 bg-yellow-500 text-white rounded disabled:opacity-50"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => deleteMachine(m._id)}
                      disabled={busy}
                      className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
