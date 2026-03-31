/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SessionCard from "@/components/ui/SessionCard";
import SessionSkeleton from "@/components/ui/SessionSkeleton";
import { useLogoutSession, useSessions } from "@/modules/auth/auth.hooks";
import { useCurrentSession } from "@/modules/auth/auth.services";
import { Session } from "@/modules/auth/auth.types";
import { logout } from "@/utils/sessions";

export default function SessionsPage() {
  const { data: sessions, isLoading } = useSessions();
  const { data: currentSessionId } = useCurrentSession();
  const logoutMutation = useLogoutSession();

  const handleLogoutSession = (sessionId: string) => {
    logoutMutation.mutate(sessionId, {
      onSuccess: () => {},
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-6">
        {[...Array(3)].map((_, i) => (
          <SessionSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!sessions?.length) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="text-4xl mb-2">🧩</div>
        <p>No active sessions</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <button
        onClick={() => handleLogoutSession("")}
        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition"
      >
        Logout
      </button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Active Sessions
          </h1>
          <p className="text-sm text-gray-500">
            Manage where you&apos;re logged in
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sessions?.length === 0 && (
          <div className="text-gray-500 text-sm">No active sessions found.</div>
        )}
        {sessions?.map((session: Session) => {
          const isCurrent = session.id === currentSessionId;
          console.log(
            "Session ID:",
            session.id,
            "Current Session ID:",
            currentSessionId,
          );
          return (
            <SessionCard
              key={session.id}
              session={session}
              isCurrent={isCurrent}
              onLogout={(id) => handleLogoutSession(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
