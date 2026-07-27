"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "@/widgets/admin-sidebar/ui/AdminSidebar";
import { isTokenExpired, refreshAccessToken } from "@/shared/lib/auth";
import { Loader } from "@/shared/ui/Loader";

export default function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.replace('/admin/login');
        return;
      }

      if (isTokenExpired(token)) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('isAdmin');
          router.replace('/admin/login');
          return;
        }
      }
      
      setIsValidating(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-neu-bg flex items-center justify-center">
        <Loader text="Verifying session..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neu-bg flex text-neu-text">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
