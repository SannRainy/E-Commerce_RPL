import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <div className="w-full bg-jade py-5 px-10 text-white">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold">
          MDG Fashion
        </Link>
        <div className="flex gap-6 text-lg">
          <Link href="/"><span className="hover:text-gray-200">Home</span></Link>
          <Link href="/"><span className="hover:text-gray-200">Kategori</span></Link>
          <Link href="/login" className="hover:text-gray-200 font-medium">Login</Link>
          <Link href="/register" className="hover:text-gray-200 font-medium">Daftar</Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
