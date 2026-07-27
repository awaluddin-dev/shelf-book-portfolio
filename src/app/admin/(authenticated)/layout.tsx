"use client";

import { AdminSidebar } from "@/widgets/admin-sidebar/ui/AdminSidebar";

export default function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neu-bg flex text-neu-text">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
