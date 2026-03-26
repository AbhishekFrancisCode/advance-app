"use client";

import { useParams } from "next/navigation";

export default function ServiceDetailsPage() {
  const params = useParams();
  const serviceName = params.name as string;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold capitalize">
        {serviceName} Details
      </h1>

      {/* Status Card */}
      <div className="bg-white dark:bg-gray-900 border rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold mb-2">Service Status</h2>
        <p>Status: <span className="text-green-500">UP</span></p>
        <p>Response Time: 120ms</p>
      </div>

      {/* Logs Section */}
      <div className="bg-white dark:bg-gray-900 border rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold mb-2">Recent Logs</h2>
        <p className="text-sm text-gray-500">
          Logs will appear here...
        </p>
      </div>

      {/* Metrics Section */}
      <div className="bg-white dark:bg-gray-900 border rounded-2xl p-5 shadow-sm">
        <h2 className="font-semibold mb-2">Metrics</h2>
        <p className="text-sm text-gray-500">
          Metrics visualization coming soon...
        </p>
      </div>
    </div>
  );
}