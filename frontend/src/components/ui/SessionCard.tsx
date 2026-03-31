"use client";

import { Session } from "@/modules/auth/auth.types";

export default function SessionCard({
  session,
  isCurrent,
  onLogout,
}: {
  session: Session;
  isCurrent: boolean;
  onLogout: (id: string) => void;
}) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-2xl bg-white shadow-sm hover:shadow-md transition">

      <div className="space-y-1">
        <p className="font-medium text-gray-800">
          {session.device || "Unknown Device"}
        </p>

        <p className="text-sm text-gray-500">
          {session.ipAddress}
        </p>

        <p className="text-xs text-gray-400">
          Last active: {new Date(session.createdAt).toLocaleString()}
        </p>
      </div>

      {isCurrent ? (
        <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
          This Device
        </span>
      ) : (
        <button
          onClick={() => onLogout(session.id)}
          className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      )}
    </div>
  );
}