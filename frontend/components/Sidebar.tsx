// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard/products", label: "Produk" },
  { href: "/dashboard/categories", label: "Kategori" },
  { href: "/dashboard/user", label: "User" },
  { href: "/dashboard/order", label: "Order" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-lg ${
              pathname === item.href ? " font-semibold" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

       {/* Logout section */}
      <div className="mt-10 border-t pt-6">
        <Link
          href="/" // atau bisa diganti dengan onClick function
          className="block text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-semibold"
        >
          Logout
        </Link>
      </div>
    </aside>
  );
}
