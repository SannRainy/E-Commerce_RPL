'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { CameraIcon } from '@heroicons/react/24/solid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: {
    _id: string;
    name: string;
  };
};

type Category = {
  _id: string;
  name: string;
};

const initialFormState = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
};

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get<Product[]>(`${API_URL}/products`),
        axios.get<Category[]>(`${API_URL}/categories`),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Gagal mengambil data awal:', err);
      setError('Gagal memuat data. Periksa koneksi atau coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setImageFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setEditingId(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    formData.append('stock', form.stock);
    formData.append('category', form.category);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editingId) {
        const res = await axios.put<Product>(`${API_URL}/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProducts((prev) => prev.map((p) => (p._id === editingId ? res.data : p)));
      } else {
        const res = await axios.post<Product>(`${API_URL}/products`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProducts((prev) => [res.data, ...prev]);
      }
      resetForm();
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
      alert('Gagal menyimpan produk. Mohon periksa kembali data Anda.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`${API_URL}/products/${productId}`);
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } catch (err) {
        console.error('Gagal menghapus produk:', err);
        alert('Gagal menghapus produk.');
      }
    }
  };

  const startEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category?._id || '',
    });
    setPreviewUrl(product.imageUrl ? `${API_URL?.replace('/api', '')}${product.imageUrl}` : null);
    setEditingId(product._id);
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{editingId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <input name="name" type="text" placeholder="Nama Produk" value={form.name} onChange={handleChange} required className="input-style" />
              <select name="category" value={form.category} onChange={handleChange} required className="input-style">
                <option value="" disabled>Pilih Kategori</option>
                {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
              </select>
              <input name="price" type="number" placeholder="Harga" value={form.price} onChange={handleChange} required className="input-style" />
              <input name="stock" type="number" placeholder="Stok" value={form.stock} onChange={handleChange} required className="input-style" />
            </div>

            <textarea name="description" placeholder="Deskripsi Produk (Opsional)" value={form.description} onChange={handleChange} className="input-style md:col-span-2" rows={4} />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Produk</label>
              <div className="mt-1 flex items-center gap-4">
                <span className=" h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {previewUrl ?
                    <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" /> :
                    <CameraIcon className="h-12 w-12 text-gray-300" />
                  }
                </span>
                <label htmlFor="image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span>Upload file</span>
                  <input id="image-upload" name="image" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                </label>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto justify-center">
                {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Produk'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-secondary w-full sm:w-auto justify-center">
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Daftar Produk</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3">Gambar</th>
                  <th scope="col" className="px-6 py-3">Nama Produk</th>
                  <th scope="col" className="px-6 py-3">Harga</th>
                  <th scope="col" className="px-6 py-3">Stok</th>
                  <th scope="col" className="px-6 py-3">Kategori</th>
                  <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={6} className="text-center p-6">Memuat produk...</td></tr>
                ) : error ? (
                  <tr><td colSpan={6} className="text-center p-6 text-red-500">{error}</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={6} className="text-center p-6">Belum ada produk yang ditambahkan.</td></tr>
                ) : (
                  products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img src={prod.imageUrl ? `${API_URL?.replace('/api', '')}${prod.imageUrl}` : 'https://via.placeholder.com/150'} alt={prod.name} className="h-10 w-10 rounded-md object-cover" />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{prod.name}</td>
                      <td className="px-6 py-4">{formatRupiah(prod.price)}</td>
                      <td className="px-6 py-4">{prod.stock}</td>
                      <td className="px-6 py-4">{prod.category?.name || '-'}</td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button onClick={() => startEdit(prod)} className="font-medium text-indigo-600 hover:text-indigo-800">Edit</button>
                        <button onClick={() => deleteProduct(prod._id)} className="font-medium text-red-600 hover:text-red-800">Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input-style {
          display: block;
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid #D1D5DB;
          padding: 0.5rem 0.75rem;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }
        .input-style:focus {
          outline: none;
          border-color: #4F46E5;
          box-shadow: 0 0 0 1px #4F46E5;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background-color: #4F46E5;
          color: white;
          border: 1px solid transparent;
          font-weight: 600;
          border-radius: 0.375rem;
          transition: background-color 0.2s;
        }
        .btn-primary:hover {
          background-color: #4338CA;
        }
        .btn-primary:disabled {
          background-color: #A5B4FC;
          cursor: not-allowed;
        }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background-color: #F3F4F6;
          color: #374151;
          border: 1px solid #D1D5DB;
          font-weight: 500;
          border-radius: 0.375rem;
          transition: background-color 0.2s;
        }
        .btn-secondary:hover {
          background-color: #E5E7EB;
        }
      `}</style>
    </div>
  );
}
