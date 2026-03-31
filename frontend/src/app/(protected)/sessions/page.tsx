/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SessionCard from "@/components/ui/SessionCard";
import { useSessions } from "@/modules/auth/auth.hooks";
import { Session } from "@/modules/auth/auth.types";

export default function SessionsPage() {
  const { data: sessions, isLoading } = useSessions();
  //   const { data: currentSessionId } = useCurrentSession();
  //   const logoutMutation = useLogoutSession();

  if (isLoading) return <div>Loading sessions...</div>;

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-800">Active Sessions</h1>

      <div className="space-y-3">
        {sessions?.map((session: Session) => {
          const isCurrent = session.id === "current-session-id"; // Replace with actual current session ID logic

          return (
            <SessionCard
              key={session.id}
              session={session}
              isCurrent={isCurrent}
              onLogout={() => {}}
              //   onLogout={(id) => logoutMutation.mutate(id)}
            />
          );
        })}
      </div>
    </div>
  );
}
