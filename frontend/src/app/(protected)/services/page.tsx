"use client";

import ServiceCardSkeleton from "@/components/ui/ServiceCardSkeleton";
import { useServices } from "@/modules/services/services.hooks";
import { Service } from "@/modules/services/services.types";
import Link from "next/link";
import { useState } from "react";

export default function ServicesPage() {
  const { data, isLoading, error } = useServices();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Failed to load services. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const filteredServices = data?.filter((service) => {
    console.log("data", data);
    const matchesSearch = service.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || service.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Services</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search services..."
          className="border px-4 py-2 rounded-lg w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter */}
        <select
          className="border px-4 py-2 rounded-lg w-full md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="UP">UP</option>
          <option value="DOWN">DOWN</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices?.map((service: Service, index: number) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{service.name}</h2>

              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  service.status === "UP"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {service.status}
              </span>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Response Time: {service.responseTime}ms
            </div>
            <Link href={`/services/${service.name}`}>
              <button className="mt-5 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
