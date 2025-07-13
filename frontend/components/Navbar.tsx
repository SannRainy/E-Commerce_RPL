'use client';

import Link from 'next/link';
import React, { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { CartContext } from '@/context/CartContext';
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className='w-full sticky top-0 bg-green-500 py-5 px-10 text-white z-50 shadow-md'>
      <div className='flex justify-between items-center max-w-7xl mx-auto'>
        <Link href="/" className='text-3xl font-bold'>MDG Fashion</Link>
        <div className='flex gap-6 items-center'>
          <Link href="/cart" className="relative">
            <ShoppingCartIcon className="h-7 w-7" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard/products" className="flex items-center gap-2">
                <UserCircleIcon className="h-7 w-7"/>
                Dashboard
              </Link>
              <button onClick={logout} className="font-semibold hover:underline">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="font-semibold hover:underline">Login</Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar;