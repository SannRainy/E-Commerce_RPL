'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type User = {
  _id: string;
  name: string;
  email: string;
  // Sesuaikan dengan skema baru
  role: 'customer' | 'admin';
};

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Gagal mengambil data user:', err);
    }
  };

  const updateUserRole = async (userId: string, newRole: User['role']) => {
    try {
      await axios.put(`${API_URL}/users/${userId}/role`, { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      console.error('Gagal mengubah role:', err);
    }
  };

  const deleteUser = async (userId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } catch (err) {
        console.error('Gagal menghapus user:', err);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Pengguna</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                    Nama
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/3">
                    Email
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/6">
                    Role
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-1/6">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="p-4 whitespace-nowrap text-gray-600">
                      {user.email}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value as User['role'])}
                          className="block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                      >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-md font-semibold text-sm hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
