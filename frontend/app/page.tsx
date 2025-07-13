'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

type Category = { _id: string; name: string; };
type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: { _id: string; name: string; };
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/products`),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Filter produk berdasarkan kategori
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category?._id === selectedCategory);

  return (
    <div className="w-full min-h-screen text-gray-800">
      <Navbar />
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] bg-[url('/bg-1.jpg')] bg-cover bg-center flex items-center justify-center text-center px-5">
        <div className="relative z-10 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Belanja Produk Fashion Berkualitas</h2>
          <Link href="#produk" className="px-6 py-3 mt-10 bg-jade text-white rounded hover:bg-jade/80 transition">
            Mulai Belanja
          </Link>
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
      </section>

      {/* Kategori */}
      <section className="mt-16 px-10">
        <h3 className="text-2xl font-semibold text-center mb-10">Kategori Populer</h3>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`border-2 px-6 py-3 rounded-full transition ${
              selectedCategory === 'all'
                ? 'bg-jade text-white border-jade'
                : 'border-jade text-jade hover:bg-jade hover:text-white'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`border-2 px-6 py-3 rounded-full transition ${
                selectedCategory === cat._id
                  ? 'bg-jade text-white border-jade'
                  : 'border-jade text-jade hover:bg-jade hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* Produk */}
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
                      src={`${API_URL?.replace('/api', '')}${product.imageUrl}`}
                      alt={product.name}
                      className="h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-gray-400">Tidak ada gambar</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 flex-grow">
                    {product.description || 'Deskripsi tidak tersedia.'}
                  </p>
                  <div className="text-jade font-bold text-lg mb-4">
                    Rp {product.price.toLocaleString()}
                  </div>
                  <Link
                    href={`/order/${product._id}`}
                    className="mt-4 w-full bg-jade text-white py-2 rounded text-center hover:bg-jade/80 transition"
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
      <footer className="mt-24 bg-jade text-white py-10 px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div>
            <h4 className="font-bold mb-2 text-lg">Tentang Kami</h4>
            <p className="mb-4">
              Toko sepatu & sandal online terlengkap. Berbagai merek terkenal dengan kualitas terjamin.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2 text-lg">Kontak</h4>
            <p>Email: info@MDGfashionStore.id</p>
            <p>Telepon: +62 812-3456-7890</p>
          </div>
          <div>
            <h4 className="font-bold mb-2 text-lg">Jam Operasional</h4>
            <p>Senin - Jumat: 09.00 - 17.00</p>
            <p>Sabtu: 10.00 - 14.00</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/20 text-center text-xs text-white/70">
          © 2025 MDG Fashion. Semua hak dilindungi undang-undang.
        </div>
      </footer>
    </div>
  );
}
