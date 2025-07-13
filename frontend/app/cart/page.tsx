'use client';

import React, { useContext, useState } from 'react';
import { CartContext } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: '', address: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast.error('Anda harus login untuk melanjutkan checkout.');
        router.push('/login');
        return;
    }

    if (!formData.name || !formData.address || !formData.phone) {
        toast.error('Harap isi semua detail pengiriman.');
        return;
    }

    setIsSubmitting(true);
    
    const orderData = {
        items: cart.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
        })),
        customerDetails: formData
    };

    try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success('Pesanan berhasil dibuat!');
        clearCart();
        router.push('/'); // atau ke halaman riwayat pesanan
    } catch (error: any) {
        console.error("Gagal membuat pesanan:", error);
        toast.error(error.response?.data?.message || 'Gagal membuat pesanan.');
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>
      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white border rounded-lg">
            <h3 className="text-xl font-medium text-gray-800">Keranjang Anda Kosong</h3>
            <p className="text-gray-500 mt-2">Ayo, mulai belanja!</p>
            <Link href="/" className="mt-4 inline-block bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
                Kembali ke Beranda
            </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            {cart.map(item => (
              <div key={item.product._id} className="flex items-center gap-4 border-b py-4 last:border-none">
                <Image src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${item.product.imageUrl}`} alt={item.product.name} width={80} height={80} className="rounded-md object-contain bg-gray-100" />
                <div className="flex-grow">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">Rp {item.product.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value))}
                    className="w-16 text-center border rounded-md"
                    min="1"
                    max={item.product.stock}
                  />
                </div>
                <p className="font-semibold w-24 text-right">Rp {(item.product.price * item.quantity).toLocaleString()}</p>
                <button onClick={() => removeFromCart(item.product._id)} className="text-red-500 hover:text-red-700">&times;</button>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
            <div className="flex justify-between mb-4">
                <span>Subtotal</span>
                <span className="font-semibold">Rp {totalPrice.toLocaleString()}</span>
            </div>
            <hr className="my-4"/>
            <h3 className="text-lg font-semibold mb-4">Detail Pengiriman</h3>
            <form onSubmit={handleCheckout} className="space-y-4">
                <input type="text" name="name" placeholder="Nama Lengkap" onChange={handleInputChange} required className="w-full p-2 border rounded"/>
                <textarea name="address" placeholder="Alamat Lengkap" onChange={handleInputChange} required className="w-full p-2 border rounded" rows={3}></textarea>
                <input type="tel" name="phone" placeholder="Nomor Telepon" onChange={handleInputChange} required className="w-full p-2 border rounded"/>
                <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:bg-green-400">
                    {isSubmitting ? 'Memproses...' : `Checkout (Rp ${totalPrice.toLocaleString()})`}
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}