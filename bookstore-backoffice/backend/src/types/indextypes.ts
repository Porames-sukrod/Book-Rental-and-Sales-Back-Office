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

export interface RentalWithDetails extends Rental {
  book_title: string;
  book_author: string;
  book_price_rent: number;
  customer_name: string;
  customer_phone: string;
  days_rented?: number;
  is_overdue?: boolean;
}

export interface RentalRequest {
  book_id: number;
  customer_id: number;
  rental_days: number;
}

export interface RentalStats {
  total_rentals: number;
  active_rentals: number;
  overdue_rentals: number;
  returned_rentals: number;
  total_revenue: number;
}