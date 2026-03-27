"use client";

import { useParams } from "next/navigation";
import { useDLQEvent, useReplayDLQ } from "@/modules/dlq/dlq.hooks";
import { useEffect } from "react";

export default function DLQDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useDLQEvent(id);
  const { mutate } = useReplayDLQ();

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (isLoading) return <div className="p-6">Loading...</div>;

  if (!data) return <div className="p-6">Not found</div>;

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">DLQ Event Details</h1>

        <button
          onClick={() => mutate(id)}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Replay Event
        </button>
      </div>

      {/* 🔹 Event Info */}
      <div className="border rounded-xl p-4">
        <p>
          <strong>ID:</strong> {data.id}
        </p>
        <p>
          <strong>Topic:</strong> {data.topic}
        </p>
        <p>
          <strong>Status:</strong> {data.status}
        </p>
        <p>
          <strong>Created:</strong> {data.createdAt}
        </p>
      </div>

      {/* 🔹 Error */}
      <div className="border rounded-xl p-4">
        <h2 className="font-medium mb-2">Error</h2>
        <p className="text-red-500 text-sm">{data.error}</p>
      </div>

      {/* 🔥 Payload Viewer */}
      <div className="border rounded-xl p-4">
        <h2 className="font-medium mb-2">Payload</h2>

        <pre className="bg-gray-900 text-green-400 text-sm p-4 rounded-lg overflow-auto">
          {JSON.stringify(data.payload, null, 2)}
        </pre>
      </div>
    </div>
  );
}
