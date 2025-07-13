"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Untuk register
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isLogin = type === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, ...(isLogin ? {} : { name }) }),
        credentials: "include", // Jika pakai cookies
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        router.push("/dashboard/products"); // Redirect setelah login
      } else {
        alert(data.message || "Terjadi kesalahan");
      }
    } catch (err) {
      setLoading(false);
      alert("Gagal terhubung ke server. Pastikan API aktif.");
      console.error("Error saat autentikasi:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-green-600">
        {isLogin ? "Login" : "Daftar"}
      </h2>

      {!isLogin && (
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
      >
        {loading ? "Memproses..." : isLogin ? "Login" : "Daftar"}
      </button>

      <p className="text-sm text-center text-gray-600">
        {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
        <a
          href={isLogin ? "/register" : "/login"}
          className="text-green-600 font-semibold hover:underline"
        >
          {isLogin ? "Daftar" : "Login"}
        </a>
      </p>
    </form>
  );
}
