'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Link from 'next/link'; // 1. Impor komponen Link

type Category = {
  _id: string;
  name: string;
};

type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: {
    _id: string;
    name: string;
  };
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/products'),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category?._id === selectedCategory);

  return (
    <div className="w-full min-h-screen text-gray-800">
      <Navbar />
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] bg-[url('/bg-1.jpg')] bg-cover bg-center flex items-center justify-center text-center px-5">
        <div className="relative z-10 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Belanja Produk Elektronik Berkualitas</h2>
          {/* Mengarahkan ke bagian produk */}
          <a href="#produk" className="px-6 py-3 mt-10 bg-green-600 text-white rounded hover:bg-green-700 transition">
            Mulai Belanja
          </a>
        </div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>
      </section>

      {/* Kategori */}
      <section className="mt-16 px-10">
        <h3 className="text-2xl font-semibold text-center mb-10">Kategori Populer</h3>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`border-2 px-6 py-3 rounded-full transition ${
              selectedCategory === 'all'
                ? 'bg-green-500 text-white border-green-500'
                : 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white'
            }`}
          >
            Semua
          </button>
          {categories.map((kategori) => (
            <button
              key={kategori._id}
              onClick={() => setSelectedCategory(kategori._id)}
              className={`border-2 px-6 py-3 rounded-full transition ${
                selectedCategory === kategori._id
                  ? 'bg-green-500 text-white border-green-500'
                  : 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white'
              }`}
            >
              {kategori.name}
            </button>
          ))}
        </div>
      </section>

      {/* Produk - Tambahkan id="produk" untuk navigasi */}
      <section id="produk" className="mt-20 px-10 scroll-mt-20">
        <h3 className="text-2xl font-semibold text-center mb-10">Produk Unggulan</h3>
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada produk di kategori ini.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col"
              >
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:5000${product.imageUrl}`}
                      alt={product.name}
                      className="h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-gray-400">Tidak ada gambar</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 flex-grow">{product.description || 'Deskripsi tidak tersedia.'}</p>
                  <div className="text-green-600 font-bold text-lg mt-auto">Rp {product.price.toLocaleString()}</div>
                  
                  {/* 2. Ubah <button> menjadi <Link> */}
                  <Link
                    href={`/order/${product._id}`}
                    className="mt-4 w-full bg-green-500 text-white py-2 rounded text-center hover:bg-green-600 transition"
                  >
                    Beli Sekarang
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-24 bg-green-600 text-white py-10 px-10">
        <div className="grid md:grid-cols-3 gap-8 text-sm max-w-7xl mx-auto">
          <div>
            <h4 className="font-bold mb-2 text-lg">HayataStore</h4>
            <p>Marketplace terpercaya untuk produk lokal UMKM.</p>
          </div>
          <div>
            <h4 className="font-bold mb-2 text-lg">Navigasi</h4>
            {/* 3. Perbaiki tautan footer */}
            <ul className="space-y-2">
              <li><Link href="/" className="hover:underline">Beranda</Link></li>
              <li><Link href="/#produk" className="hover:underline">Produk</Link></li>
              <li><Link href="/tentang" className="hover:underline">Tentang Kami</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2 text-lg">Kontak</h4>
            <p>Email: info@HayataStore.id</p>
            <p>Phone: +62 812-3456-7890</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/20 text-center text-xs text-white/70 max-w-7xl mx-auto">
          © 2025 HayataStore. Semua hak dilindungi undang-undang.
        </div>
      </footer>
    </div>
  );
}