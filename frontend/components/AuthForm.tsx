"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isLogin = type === "login";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // ...
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      {isLogin || (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-jade focus:border-jade p-2"
            required
          />
        </div>
      )}
      {/* Email & Password fields */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-jade focus:border-jade p-2"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-jade focus:border-jade p-2"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-jade text-white py-3 rounded hover:bg-jade/80 transition font-semibold"
      >
        {loading ? "Memproses..." : isLogin ? "Login" : "Daftar"}
      </button>
      <p className="text-sm text-center text-gray-600 mt-4">
        {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <a
          href={isLogin ? "/register" : "/login"}
          className="text-jade font-semibold hover:underline"
        >
          {isLogin ? "Daftar" : "Login"}
        </a>
      </p>
    </form>
  );
}
