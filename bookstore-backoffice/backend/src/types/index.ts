export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  price_buy: number;
  price_rent: number;
  stock: number;
  status: 'available' | 'rented' | 'sold';
  created_at?: string;
}

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  created_at?: string;
}

export interface Rental {
  id?: number;
  book_id: number;
  customer_id: number;
  rental_date: string;
  due_date: string;
  return_date?: string;
  status: 'active' | 'returned' | 'overdue';
  created_at?: string;
}