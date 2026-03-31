"use client";

import { useState } from "react";
import { useLogin } from "@/modules/auth/auth.hooks";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { mutate, isPending } = useLogin();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    mutate(
      { email, password },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (res: any) => {
          console.log("LOGIN SUCCESS",res)
          router.push("/dashboard");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black to-gray-900 dark:bg-zinc-700">
      <div className="w-100 bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold text-white mb-6">
          Welcome Back
        </h1>

        <input
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={isPending}
          className="w-full py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          {isPending ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}