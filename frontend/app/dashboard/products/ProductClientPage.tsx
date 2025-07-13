'use client';

import { useState } from 'react';
import axios from 'axios';
import { CameraIcon } from '@heroicons/react/24/solid';
import { Product, Category } from '@/types';
import toast from 'react-hot-toast';
import Image from 'next/image'; // Import Next.js Image untuk optimasi

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// Base URL untuk gambar, lebih aman daripada replace()
const IMAGE_BASE_URL = API_URL?.replace('/api', ''); 

const initialFormState = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: '',
};

interface ProductClientPageProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export default function ProductClientPage({ initialProducts, initialCategories }: ProductClientPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [form, setForm] = useState(initialFormState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    if (previewUrl) URL.revokeObjectURL(previewUrl);
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
        toast.success("Produk berhasil diperbarui!");
      } else {
        const res = await axios.post<Product>(`${API_URL}/products`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProducts((prev) => [res.data, ...prev]);
        toast.success("Produk baru berhasil ditambahkan!");
      }
      resetForm();
    } catch (err: any) {
      console.error('Gagal menyimpan produk:', err);
      toast.error(err.response?.data?.message || 'Gagal menyimpan produk.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const deleteProduct = async (productId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`${API_URL}/products/${productId}`);
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        toast.success("Produk berhasil dihapus.");
      } catch (err: any) {
        console.error('Gagal menghapus produk:', err);
        toast.error(err.response?.data?.message || 'Gagal menghapus produk.');
      }
    }
  };

  const startEdit = (product: Product) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category?._id || '',
    });
    setPreviewUrl(product.imageUrl ? `${IMAGE_BASE_URL}${product.imageUrl}` : null);
    setEditingId(product._id);
  };
  
  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(price);
  };

  // **KOREKSI UTAMA ADA DI SINI**
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Manajemen Produk</h1>

      {/* Form Section */}
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
              <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {previewUrl ?
                  <Image src={previewUrl} alt="Preview" layout="fill" objectFit="cover" /> :
                  <CameraIcon className="h-12 w-12 text-gray-300" />
                }
              </div>
              <label htmlFor="image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
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

      {/* Table Section */}
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
              {products.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-6">Belum ada produk yang ditambahkan.</td></tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="relative h-10 w-10">
                        <Image src={prod.imageUrl ? `${IMAGE_BASE_URL}${prod.imageUrl}` : 'https://via.placeholder.com/150'} alt={prod.name} layout="fill" objectFit="cover" className="rounded-md" />
                      </div>
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
  );
}