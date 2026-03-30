"use client";

import { Bell, LogOut } from "lucide-react";
import { logout } from "@/utils/sessions";

export default function Navbar() {
  return (
    <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-black">
      
      <div className="text-sm text-gray-500">
        System Overview
      </div>

      <div className="flex items-center gap-4">
        <Bell size={18} className="cursor-pointer" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <span className="text-sm font-medium">Admin</span>
        </div>

        <LogOut className="text-red-900 cursor-pointer" onClick={logout}/>

        {/* <button
          onClick={logout}
          className="text-sm text-red-500"
        >
          Logout
        </button> */}
      </div>
    </div>
  );
}