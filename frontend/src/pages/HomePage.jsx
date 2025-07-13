import React from 'react';

const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">ProShop</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Categories</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Deals</a>
            </div>
            <div>
              <a href="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300">
                Login
              </a>
            </div>
          </div>
        </div>
      </nav>

      <header className="relative bg-white">
        <div className="max-w-screen-xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Find Your Next Favorite Thing.
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                A marketplace built for quality, discovery, and trust.
            </p>
            <div className="mt-8 flex justify-center">
                <input type="text" placeholder="Search for products..." className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-full focus:ring-blue-500 focus:border-blue-500"/>
            </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <img src="https://via.placeholder.com/400x300" alt="Product" className="w-full h-56 object-cover"/>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800">Premium Wireless Headphones</h3>
              <p className="text-xl font-bold text-blue-600 mt-2">Rp 1.200.000</p>
              <button className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-700">View Details</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;