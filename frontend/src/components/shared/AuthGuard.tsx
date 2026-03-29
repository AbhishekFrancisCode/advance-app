"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/services/apiClient";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await apiClient.get("/users/me");
        setLoading(false);
      } catch {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return null;

  return <>{children}</>;
}