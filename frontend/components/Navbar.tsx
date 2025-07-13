import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <div className='w-full relative top-0 bg-green-500 py-5 px-10 text-white'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Hayata Store</h1>
        <div className='flex gap-10'>
            <Link href="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar