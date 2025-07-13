// HAPUS 'use client'; dari atas file ini

import axios from 'axios';
import ProductClientPage from './ProductClientPage';
import { Product, Category } from '@/types'; // Pindahkan tipe data ke file terpusat

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getData() {
  try {
    // Fetch data secara paralel
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get(`${API_URL}/products`),
      axios.get(`${API_URL}/categories`),
    ]);
    return {
      products: productsRes.data.data || [], // Sesuaikan dengan struktur paginasi baru
      categories: categoriesRes.data || [],
    };
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
    return { products: [], categories: [] }; // Kembalikan data kosong jika gagal
  }
}

export default async function ProductDashboard() {
  const { products, categories } = await getData();

  return (
    <ProductClientPage 
      initialProducts={products} 
      initialCategories={categories}
    />
  );
}