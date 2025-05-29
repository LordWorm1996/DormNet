// src/app/admin/layout.tsx
import Link from "next/link";

export const metadata = { title: "Admin Panel – DormNet" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="p-2 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
          <Link href="/admin/users" className="p-2 hover:bg-gray-700 rounded">
            Users
          </Link>
          <Link
            href="/admin/appliances"
            className="p-2 hover:bg-gray-700 rounded"
          >
            Appliances
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">{children}</main>
    </div>
  );
}
