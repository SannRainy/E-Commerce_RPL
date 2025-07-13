"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import toast from 'react-hot-toast';


export default function AuthForm({ type }: { type: "login" | "register" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const isLogin = type === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/${type}`;
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(isLogin ? 'Login berhasil!' : 'Registrasi berhasil!');
        // Panggil fungsi login dari context untuk menyimpan data user
        login(data.token, data.result);
        router.push("/dashboard/products");
      } else {
        toast.error(data.message || "Terjadi kesalahan");
      }
    } catch (err) {
      toast.error("Gagal terhubung ke server. Pastikan API aktif.");
      console.error("Error saat autentikasi:", err);
    } finally {
      setLoading(false);
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
        className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition disabled:bg-green-400"
      >
        {loading ? "Memproses..." : isLogin ? "Login" : "Daftar"}
      </button>
      
      {/* ... sisanya sama */}
    </form>
  );
}