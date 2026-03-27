"use client";

import { useDLQEvents, useReplayDLQ } from "@/modules/dlq/dlq.hooks";
import Link from "next/link";
import { useState } from "react";

export default function DLQPage() {
  const { data, isLoading } = useDLQEvents();
  const { mutate } = useReplayDLQ();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filtered = data?.filter((event) => {
    const matchSearch =
      event.topic.toLowerCase().includes(search.toLowerCase()) ||
      event.error.toLowerCase().includes(search.toLowerCase());

    const matchStatus = status === "ALL" || event.status === status;

    return matchSearch && matchStatus;
  });

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">DLQ Events</h1>
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search..."
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-lg"
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="REPLAYED">Replayed</option>
        </select>
      </div>
      <div className="grid gap-4">
        {filtered?.map((event) => (
          <Link href={`/dlq/${event.id}`} key={event.id}>
            <div className="cursor-pointer hover:shadow">
              <div
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{event.topic}</p>
                  <p className="text-sm text-gray-500">{event.error}</p>
                  <p className="text-xs text-gray-400">{event.createdAt}</p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    event.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {event.status}
                </span>

                <button
                  disabled={event.status === "REPLAYED"}
                  onClick={() => mutate(event.id)}
                  className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Replay
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
