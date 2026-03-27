"use client";

import { useDLQEvents, useReplayDLQ } from "@/modules/dlq/dlq.hooks";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DLQPage() {
  const { data, isLoading } = useDLQEvents();
  const { mutate } = useReplayDLQ();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filtered = data?.filter((event) => {
    const matchSearch =
      event.topic.toLowerCase().includes(search.toLowerCase()) ||
      event.error.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "ALL" || event.status === status;

    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">DLQ Events</h1>

      <div className="relative z-20 flex flex-col md:flex-row gap-3">
        <input
          placeholder="Search topic or error..."
          className="border px-4 py-2 rounded-lg w-full md:w-1/4"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-4 py-2 rounded-lg w-full md:w-1/4"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="REPLAYED">Replayed</option>
        </select>
      </div>

      <p className="text-sm text-gray-500">
        Showing {filtered?.length || 0} events
      </p>

      <div className="border rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
        <div className="grid grid-cols-5 text-xs font-medium text-gray-500 px-4 py-3 border-b">
          <span>Topic</span>
          <span>Error</span>
          <span>Status</span>
          <span>Created</span>
          <span className="text-right">Action</span>
        </div>

        {filtered?.map((event) => (
          <div
            key={event.id}
            onClick={() => router.push(`/dlq/${event.id}`)}
            className="grid grid-cols-5 px-4 py-3 text-sm border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
          >
            <span className="font-medium">{event.topic}</span>

            <span className="text-gray-500 truncate">{event.error}</span>

            <span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  event.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {event.status}
              </span>
            </span>

            <span className="text-gray-400">
              {new Date(event.createdAt).toLocaleString()}
            </span>

            <div className="text-right">
              <button
                disabled={event.status === "REPLAYED"}
                onClick={(e) => {
                  e.stopPropagation();
                  mutate(event.id);
                }}
                className="text-xs px-3 py-1 rounded-lg bg-black text-white disabled:opacity-50"
              >
                Replay
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered?.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No DLQ events found
        </div>
      )}
    </div>
  );
}
