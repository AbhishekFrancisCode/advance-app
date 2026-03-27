"use client";

import { useServices } from "@/modules/services/services.hooks";
import { useDLQEvents } from "@/modules/dlq/dlq.hooks";

export default function DashboardPage() {
  const { data: services } = useServices();
  const { data: dlq } = useDLQEvents();

  const totalServices = services?.length || 0;
  const healthyServices =
    services?.filter((s) => s.status === "UP").length || 0;

  const totalDLQ = dlq?.length || 0;
  const pendingDLQ =
    dlq?.filter((e) => e.status === "PENDING").length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Title */}
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* 🔹 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Services */}
        <div className="p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Services</p>
          <p className="text-xl font-bold">{healthyServices}/{totalServices}</p>
        </div>

        {/* DLQ Total */}
        <div className="p-4 rounded-xl border">
          <p className="text-sm text-gray-500">DLQ Events</p>
          <p className="text-xl font-bold">{totalDLQ}</p>
        </div>

        {/* Pending DLQ */}
        <div className="p-4 rounded-xl border">
          <p className="text-sm text-gray-500">Pending DLQ</p>
          <p className="text-xl font-bold text-yellow-500">{pendingDLQ}</p>
        </div>

        {/* Health */}
        <div className="p-4 rounded-xl border">
          <p className="text-sm text-gray-500">System Health</p>
          <p className="text-xl font-bold text-green-500">
            {healthyServices === totalServices ? "Healthy" : "Degraded"}
          </p>
        </div>
      </div>

      {/* 🔹 Services List */}
      <div className="border rounded-xl p-4">
        <h2 className="font-medium mb-3">Services Status</h2>

        <div className="grid gap-2">
          {services?.map((service) => (
            <div
              key={service.name}
              className="flex justify-between text-sm"
            >
              <span>{service.name}</span>

              <span
                className={
                  service.status === "UP"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}