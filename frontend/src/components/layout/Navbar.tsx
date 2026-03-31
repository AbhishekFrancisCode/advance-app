"use client";

import { Bell, LogOut } from "lucide-react";
import { logout } from "@/utils/sessions";
import { useAuth } from "@/modules/user/user.hooks";

export default function Navbar() {
  const { data: authData } = useAuth();

  const handleLogout = () => {
    if (!authData?.currentSessionId) return;

    logout();
  };
  return (
    <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-black">
      <div className="text-sm text-gray-500">System Overview</div>

      <div className="flex items-center gap-4">
        <Bell size={18} className="cursor-pointer" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300" />
          <span className="text-sm font-medium">Admin</span>
        </div>

        <LogOut className="text-red-900 cursor-pointer" onClick={handleLogout} />
      </div>
    </div>
  );
}
