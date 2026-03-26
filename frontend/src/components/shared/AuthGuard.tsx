"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/services/apiClient";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await apiClient.get("/users/me");
      } catch (err) {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}