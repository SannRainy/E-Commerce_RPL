'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard/products", label: "Produk" },
  { href: "/dashboard/categories", label: "Kategori" },
  { href: "/dashboard/user", label: "User" },
  { href: "/dashboard/order", label: "Order" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useContext(AuthContext);

  return (
    <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              (pathname ?? '').startsWith(item.href)
                ? "bg-green-100 text-green-700 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-10 border-t pt-6">
        <button
          onClick={logout}
          className="w-full text-left text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-semibold"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}