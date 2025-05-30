"use client";

import useSWR from "swr";
import { useState } from "react";
import { IAppliance } from "@/shared/interfaces";

const fetchWithCredentials = async (url: string): Promise<IAppliance[]> => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<IAppliance[]>;
};

export default function AdminAppliancesPage() {
  const {
    data: appliances,
    error,
    mutate,
  } = useSWR<IAppliance[]>("/api/admin/appliance", fetchWithCredentials);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [type, setType] = useState("laundry");

  if (error) return <p className="text-red-500">Error loading appliances.</p>;
  if (!appliances) return <p>Loading appliances…</p>;

  const addAppliance = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/appliance", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      setName("");
      setType("laundry");
      await mutate();
    } catch (err: unknown) {
      let msg = "Unknown error";
      if (err instanceof Error) msg = err.message;
      alert("Error: " + msg);
    } finally {
      setBusy(false);
    }
  };

  const deleteAppliance = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appliance?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/appliance/${id}`, {
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

  const startEditing = (appliance: IAppliance) => {
    setEditingId(appliance._id);
    setEditName(appliance.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/appliance/${id}`, {
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
      <h1 className="text-2xl font-bold mb-6">Appliance Management</h1>

      <form
        onSubmit={addAppliance}
        className="mb-6 flex flex-col sm:flex-row gap-2"
      >
        <input
          className="flex-1 p-2 border rounded"
          placeholder="New appliance name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          required
        />
        <select
          className="p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={busy}
          required
        >
          <option value="laundry">Laundry</option>
          <option value="kitchen">Kitchen</option>
          <option value="study">Study</option>
          <option value="cleaning">Cleaning</option>
          <option value="recreational">Recreational</option>
        </select>
        <button
          type="submit"
          disabled={busy || !name.trim() || !type.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {busy ? "Adding…" : "Add Appliance"}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {appliances.map((m) => (
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
                    <span className="ml-2 text-xs text-gray-500">
                      ({m.type})
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
                      onClick={() => deleteAppliance(m._id)}
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
