"use client";

import { Session } from "@/modules/auth/auth.types";
import { getDeviceInfo } from "@/utils/device";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";

dayjs.extend(relativeTime);

interface Props {
  session: Session;
  isCurrent: boolean;
  onLogout: (id: string) => void;
}

export default function SessionCard({ session, isCurrent, onLogout }: Props) {
  const device = getDeviceInfo(session.userAgent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all"
    >
      <div className="flex-1 items-center justify-between p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all">
        <div className="flex items-center gap-4">
          <div className="text-2xl">{device.icon}</div>

          <div>
            <div className="font-medium text-gray-800">{device.name}</div>

            <div className="text-sm text-gray-500">{session.ipAddress}</div>

            <div className="text-xs text-gray-400">
              Last active {dayjs(session.lastUsedAt).fromNow()}
            </div>
          </div>
        </div>

        <div>
          {isCurrent ? (
            <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full flex items-center gap-1">
              ● This device
            </span>
          ) : (
            <button
              onClick={() => onLogout(session.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
