"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Services", path: "/services" },
  { name: "DLQ", path: "/dlq" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-60 h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
      <h1 className="text-lg font-semibold mb-6">Observability</h1>

      <div className="space-y-2">
        {menu.map((item) => {
          const active = pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}