'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

export default function OrderPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const params = useParams();
  const router = useRouter();
  const { productId } = params;

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await axios.get(`${API_URL}/products/${productId}`);
          setProduct(res.data);
        } catch (err) {
          setError('Gagal memuat produk. Mungkin produk tidak ditemukan.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !formData.name || !formData.address || !formData.phone) {
      toast.error('Harap isi semua kolom formulir.');
      return;
    }

    const orderData = {
      productName: product.name,
      price: product.price,
      customerDetails: formData,
    };

    const promise = axios.post(`${API_URL}/orders`, orderData);

    toast.promise(
      promise,
      {
        loading: 'Memproses pesanan Anda...',
        success: (response) => {
          setTimeout(() => router.push('/'), 2000);
          return `Pesanan untuk ${product.name} berhasil dibuat!`;
        },
        error: (err) => {
          const errorMessage =
            err.response?.data?.message || 'Terjadi kesalahan saat membuat pesanan.';
          console.error('Gagal membuat pesanan:', err);
          return errorMessage;
        },
      },
      {
        style: {
          minWidth: '250px',
        },
        success: {
          duration: 5000,
          icon: '🎉',
        },
      }
    );
  };

  if (isLoading)
    return <div className="flex justify-center items-center h-screen">Memuat...</div>;
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Selesaikan Pesanan Anda
        </h1>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Ringkasan Produk */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Produk</h2>
            {product.imageUrl && (
              <img
                src={`${API_URL?.replace('/api', '')}${product.imageUrl}`}
                alt={product.name}
                className="w-full h-48 object-contain rounded bg-gray-100 mb-4"
              />
            )}
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-600 my-2 text-sm">
              {product.description}
            </p>
            <p className="text-2xl font-bold text-green-600 mt-4">
              Rp {product.price.toLocaleString()}
            </p>
          </div>

          {/* Formulir Pemesan */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Detail Pengiriman</h2>
            <form onSubmit={handleSubmitOrder}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Alamat Pengiriman
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nomor Telepon (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition font-bold text-lg"
              >
                Pesan Sekarang
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
