'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type CustomerDetails = {
  name: string;
  address: string;
  phone: string;
};

type Order = {
  _id: string;
  productName: string;
  price: number;
  customerDetails: CustomerDetails;
  createdAt: string;
  status: 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan';
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrdersDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/orders`);
        setOrders(response.data);
      } catch (err) {
        console.error("Gagal mengambil data pesanan:", err);
        setError("Tidak dapat memuat data pesanan. Pastikan backend berjalan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order._id === orderId ? { ...order, status: newStatus } : order
    ));

    try {
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus });
      toast.success('Status pesanan berhasil diperbarui!');
    } catch (err) {
      toast.error('Gagal memperbarui status. Silakan refresh halaman.');
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Pesanan</h1>
          <p className="text-gray-600 mt-1">Kelola semua pesanan yang masuk di sini.</p>
        </header>

        {isLoading ? (
          <p className="text-center text-gray-500">Memuat data...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white border rounded-lg">
            <h3 className="text-xl font-medium text-gray-800">Belum Ada Pesanan</h3>
            <p className="text-gray-500 mt-2">Saat ini belum ada pesanan yang masuk.</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tanggal</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nama Produk</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Pelanggan</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Harga</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{order.productName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.customerDetails.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Rp {order.price.toLocaleString('id-ID')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value as Order['status'])}
                          className={`border-none rounded-md py-1 text-xs font-medium ${
                            order.status === 'Selesai' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' :
                            order.status === 'Dikirim' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10' :
                            order.status === 'Diproses' ? 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20' :
                            'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10'
                          }`}
                        >
                          <option value="Diproses">Diproses</option>
                          <option value="Dikirim">Dikirim</option>
                          <option value="Selesai">Selesai</option>
                          <option value="Dibatalkan">Dibatalkan</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
