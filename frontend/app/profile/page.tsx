'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, isLoading, logout } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Jika loading selesai dan tidak ada user, redirect ke login
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Tampilkan loading skeleton atau pesan saat data user belum siap
  if (isLoading || !user) {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-10 bg-gray-300 rounded w-32 mt-4"></div>
            </div>
        </div>
    );
  }

  // Jika user ada, tampilkan halaman profil
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Profil Saya</h1>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nama Lengkap</h3>
            <p className="mt-1 text-lg text-gray-900">{user.name}</p>
          </div>
          <hr/>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Alamat Email</h3>
            <p className="mt-1 text-lg text-gray-900">{user.email}</p>
          </div>
          <hr/>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Peran</h3>
            <p className="mt-1 text-lg text-gray-900 capitalize">{user.role}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
            <button
                onClick={() => alert("Fitur riwayat pesanan belum tersedia.")}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
            >
                Riwayat Pesanan 
            </button>
            <button 
              onClick={logout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
        </div>
      </div>
    </div>
  );
}