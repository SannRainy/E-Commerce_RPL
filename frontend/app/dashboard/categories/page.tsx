'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Category = {
  _id: string;
  name: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CategoryDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch kategori
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get<Category[]>(`${API_URL}/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Gagal mengambil kategori:', err);
      setError('Gagal memuat data. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  // Tambah kategori
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await axios.post<Category>(`${API_URL}/categories`, { name });
      setCategories((prev) => [...prev, res.data]);
      setName('');
    } catch (err) {
      console.error('Gagal menambah kategori:', err);
      alert('Gagal menyimpan kategori baru.');
    }
  };

  // Hapus kategori
  const deleteCategory = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await axios.delete(`${API_URL}/categories/${id}`);
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
      } catch (err) {
        console.error('Gagal menghapus kategori:', err);
        alert('Gagal menghapus kategori.');
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderContent = () => {
    if (loading) return <p className="p-6 text-center text-gray-500">Memuat data...</p>;
    if (error) return <p className="p-6 text-center text-red-500">{error}</p>;
    if (categories.length === 0)
      return <p className="p-6 text-center text-gray-500">Belum ada kategori yang ditambahkan.</p>;

    return (
      <ul className="divide-y divide-gray-200">
        {categories.map((cat) => (
          <li
            key={cat._id}
            className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-gray-800 font-medium">{cat.name}</span>
            <button
              onClick={() => deleteCategory(cat._id)}
              className="text-sm font-semibold text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Manajemen Kategori</h1>

        {/* Form tambah kategori */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Tambah Kategori Baru</h2>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Contoh: Elektronik"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="flex-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Tambah
            </button>
          </form>
        </div>

        {/* List kategori */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Daftar Kategori</h2>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
