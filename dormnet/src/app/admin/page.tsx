"use client";

import useSWR from "swr";

interface Stats {
  userCount: number;
  machineCount: number;
  reservationCount: number;
}

const fetchWithCredentials = async (url: string): Promise<Stats> => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Stats;
};

export default function AdminDashboardPage() {
  const { data, error } = useSWR<Stats>(
    "/api/admin/stats",
    fetchWithCredentials,
  );

  if (error) return <p className="text-red-500">Error loading stats.</p>;
  if (!data) return <p>Loading stats…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-medium">Total Users</h2>
          <p className="text-3xl">{data.userCount}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-medium">Machines</h2>
          <p className="text-3xl">{data.machineCount}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-medium">Active Reservations</h2>
          <p className="text-3xl">{data.reservationCount}</p>
        </div>
      </div>
    </div>
  );
}
