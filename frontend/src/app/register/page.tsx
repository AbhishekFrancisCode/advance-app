"use client";

import { useState } from "react";
import { useRegister } from "@/modules/auth/auth.hooks";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { mutate, isPending } = useRegister();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push("/login");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black to-gray-900">
      <div className="w-100 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold text-white mb-6">
          Create Account
        </h1>

        <input
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          {isPending ? "Creating..." : "Register"}
        </button>
      </div>
    </div>
  );
}