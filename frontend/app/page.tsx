'use client';

import { useEffect, useState, useContext, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, Category } from '@/types';
import API from '@/lib/api';
import { CartContext } from '@/context/CartContext';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  const fetchProducts = useCallback(async (pageNum: number, categoryId: string) => {
    setLoading(true);
    try {
      const res = await API.get('/products', {
        params: { 
          page: pageNum,
          // Hanya kirim parameter kategori jika bukan 'all'
          ...(categoryId !== 'all' && { category: categoryId })
        }
      });
      // **PERBAIKAN UTAMA DI SINI**
      // Ambil array dari properti 'data' di dalam respons
      setProducts(res.data.data || []); 
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Gagal mengambil produk:", error);
      setProducts([]); // Set ke array kosong jika ada error
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(page, selectedCategory);
  }, [page, selectedCategory, fetchProducts]);

  const handleCategoryChange = (catId: string) => {
    setPage(1);
    setSelectedCategory(catId);
  }

  // Karena products sekarang dijamin array, kode di bawah ini akan berfungsi
  const filteredProducts = products; // Logika filter sudah ditangani oleh backend

  return (
    <div className="w-full min-h-screen text-gray-800">
      <section className="relative w-full h-[50vh] bg-gray-400 bg-cover bg-center flex items-center justify-center text-center px-5" style={{backgroundImage: "url('/bg-1.jpg')"}}>
        <div className="relative z-10 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Belanja Produk Fashion Berkualitas</h2>
          <a href="#produk" className="px-6 py-3 mt-10 bg-green-600 text-white rounded hover:bg-green-700 transition">
            Mulai Belanja
          </a>
        </div>
        <div className="absolute inset-0 bg-black/40 z-0"></div>
      </section>

      <section className="my-12 px-5 md:px-10">
        <h3 className="text-2xl font-semibold text-center mb-8">Kategori Populer</h3>
        <div className="flex justify-center gap-3 flex-wrap">
          <button onClick={() => handleCategoryChange('all')} className={`border-2 px-6 py-2 rounded-full transition ${selectedCategory === 'all' ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>Semua</button>
          {categories.map((cat) => (
            <button key={cat._id} onClick={() => handleCategoryChange(cat._id)} className={`border-2 px-6 py-2 rounded-full transition ${selectedCategory === cat._id ? 'bg-green-500 text-white border-green-500' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>{cat.name}</button>
          ))}
        </div>
      </section>

      <section id="produk" className="px-5 md:px-10 scroll-mt-20">
        <h3 className="text-2xl font-semibold text-center mb-8">Produk Unggulan</h3>
        {loading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-gray-300 h-48 rounded-lg"></div>
                  <div className="bg-gray-300 h-5 w-3/4 rounded"></div>
                  <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                </div>
             ))}
           </div>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Tidak ada produk di kategori ini.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <div key={product._id} className="border rounded-xl flex flex-col group shadow-sm hover:shadow-lg transition-shadow">
                  <Link href={`/product/${product._id}`}>
                    <div className="relative w-full h-56 bg-gray-100 overflow-hidden rounded-t-xl">
                      <Image src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api','')}${product.imageUrl}`} alt={product.name} layout="fill" objectFit="contain" className="p-4 group-hover:scale-105 transition-transform duration-300"/>
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold mb-2 truncate" title={product.name}>{product.name}</h3>
                    <p className="text-green-600 font-bold text-lg mt-auto">Rp {product.price.toLocaleString()}</p>
                    <button onClick={() => addToCart(product)} className="mt-4 w-full bg-green-500 text-white py-2 rounded text-center hover:bg-green-600 transition">Tambah Keranjang</button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button onClick={() => setPage(p => p - 1)} disabled={page <= 1} className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed">Sebelumnya</button>
                <span className="px-4 py-2 font-medium">Halaman {page} dari {totalPages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed">Berikutnya</button>
              </div>
            )}
          </>
        )}
      </section>
      
      <footer className="mt-24 bg-gray-800 text-white py-10 px-10">
        <div className="max-w-7xl mx-auto text-center">
            <p>© {new Date().getFullYear()} MDG Fashion. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}