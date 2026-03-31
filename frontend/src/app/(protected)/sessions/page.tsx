/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SessionCard from "@/components/ui/SessionCard";
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

  if (isLoading) return <div>Loading sessions...</div>;

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Active Sessions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage devices where you are currently logged in.
        </p>
      </div>

      <div className="space-y-3">
        {sessions?.length === 0 && (
          <div className="text-gray-500 text-sm">No active sessions found.</div>
        )}
        {sessions?.map((session: Session) => {
          const isCurrent = session.id === currentSessionId;
          console.log("Session ID:", session.id, "Current Session ID:", currentSessionId);
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
