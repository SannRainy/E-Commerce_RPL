'use client'; // Jadikan Client Component untuk mengakses Context

import Sidebar from "@/components/Sidebar";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Tunggu sampai data user selesai dimuat
    }

    // Jika loading selesai TAPI...
    // 1. Tidak ada user (belum login) ATAU
    // 2. User bukan admin
    // ...maka tendang keluar dari dashboard.
    if (!user) {
      router.replace('/login');
    } else if (user.role !== 'admin') {
      router.replace('/profile'); // Alihkan customer ke halaman profil mereka
    }
  }, [user, isLoading, router]);

  // Tampilkan pesan loading saat memeriksa otorisasi
  // Ini mencegah halaman dashboard "berkedip" sesaat sebelum dialihkan
  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-screen bg-gray-100 justify-center items-center">
        <p className="text-lg text-gray-600">Memeriksa otorisasi...</p>
      </div>
    );
  }
  
  // Jika user adalah admin, tampilkan layout dashboard yang sebenarnya
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}