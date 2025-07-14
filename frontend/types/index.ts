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
  category?: Category;
};

// KOREKSI UTAMA: Standarisasi tipe User di sini
export type User = {
  _id: string;  // ID dari MongoDB
  id: string;     // ID yang sering ada di payload JWT atau respons login
  name: string;
  email: string;
  role: 'customer' | 'admin';
};

export type CartItem = {
  product: Product;
  quantity: number;
};

