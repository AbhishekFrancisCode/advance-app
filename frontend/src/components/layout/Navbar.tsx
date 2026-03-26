"use client";

import { useState } from "react";
import { logout } from "@/utils/sessions";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-16 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-black/70 backdrop-blur-md flex items-center justify-between px-6">
      
      {/* 🔹 Left - Logo + Name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold">
          O
        </div>
        <span className="text-lg font-semibold">
          Observability
        </span>
      </div>

      {/* 🔹 Right - User Menu */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <span className="hidden md:block text-sm font-medium">
            Admin
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
            >
              Profile
            </button>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 text-sm text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}