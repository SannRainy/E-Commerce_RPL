import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-5 text-2xl font-bold border-b border-gray-700">Admin</div>
        <nav className="flex-1 p-5 space-y-2">
          <a href="#" className="block py-2 px-4 rounded bg-gray-700">Dashboard</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">Manage Posts</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">Transactions</a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-700">User Status</a>
        </nav>
      </div>

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800">Admin Overview</h1>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 font-semibold">User Posts</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">1,402</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 font-semibold">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">Rp 250.7M</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500 font-semibold">Users Online</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">86</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;