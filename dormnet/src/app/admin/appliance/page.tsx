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
    data: Appliances,
    error,
    mutate,
  } = useSWR<IAppliance[]>("/api/admin/Appliance", fetchWithCredentials);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  if (error) return <p className="text-red-500">Error loading Appliances.</p>;
  if (!Appliances) return <p>Loading Appliances…</p>;

  const addAppliance = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/admin/Appliance", {
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Appliance Management</h1>

      <form onSubmit={addAppliance} className="mb-4 flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="New Appliance name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !name.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {busy ? "Adding…" : "Add Appliance"}
        </button>
      </form>

      <ul className="space-y-2">
        {Appliances.map((m) => (
          <li key={m._id} className="p-2 bg-white rounded shadow">
            <strong>{m.name}</strong> — {m.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
