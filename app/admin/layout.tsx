"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/admin-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/admin" && !isLoggedIn()) {
      router.replace("/admin");
    }
  }, [pathname, router]);

  return <>{children}</>;
}