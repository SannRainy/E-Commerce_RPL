// Buat folder 'types' di root 'frontend'

export type Category = {
  _id: string;
  name: string;
};

export type Product = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: Category; // Relasi ke kategori
};

export type User = {
    _id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
};

export type CustomerDetails = {
    name: string;
    address: string;
    phone: string;
};

export type Order = {
    _id: string;
    productName: string;
    price: number;
    customerDetails: CustomerDetails;
    createdAt: string;
    status: 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan';
};