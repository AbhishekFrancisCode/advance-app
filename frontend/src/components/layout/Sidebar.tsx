"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  AlertTriangle,
} from "lucide-react";

const menu = [
  {
    section: "Overview",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    section: "Monitoring",
    items: [
      { name: "Services", path: "/services", icon: Server },
      { name: "DLQ", path: "/dlq", icon: AlertTriangle },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 flex flex-col">
      
      {/* logo */}
      <div className="mb-8">
        <h1 className="text-lg font-semibold">Observability</h1>
      </div>

      {/*menu */}
      <div className="space-y-6 flex-1">
        {menu.map((section) => (
          <div key={section.section}>
            <p className="text-xs text-gray-500 mb-2">
              {section.section}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const active = pathname.startsWith(item.path);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                      active
                        ? "bg-black text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/*footer */}
      <div className="text-xs text-gray-400">
        v1.0.0
      </div>
    </div>
  );
}