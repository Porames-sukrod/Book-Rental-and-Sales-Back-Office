import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  price_buy: number;
  price_rent: number;
  stock: number;
  status: 'available' | 'rented' | 'sold';
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

// Books API Hooks
export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE}/books`);
      return response.data as Book[];
    }
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (book: Omit<Book, 'id'>) => {
      const response = await axios.post(`${API_BASE}/books`, book);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...book }: Book) => {
      const response = await axios.put(`${API_BASE}/books/${id}`, book);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`${API_BASE}/books/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });
};

// Customers API Hooks
export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE}/customers`);
      return response.data as Customer[];
    }
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (customer: Omit<Customer, 'id' | 'created_at'>) => {
      const response = await axios.post(`${API_BASE}/customers`, customer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...customer }: Customer) => {
      const response = await axios.put(`${API_BASE}/customers/${id}`, customer);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`${API_BASE}/customers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });
};

export const useCustomerRentals = (customerId: number) => {
  return useQuery({
    queryKey: ['customers', customerId, 'rentals'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE}/customers/${customerId}/rentals`);
      return response.data as RentalWithDetails[];
    },
    enabled: !!customerId
  });
};

// Rentals API Hooks
export const useRentals = () => {
  return useQuery({
    queryKey: ['rentals'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE}/rentals`);
      return response.data as RentalWithDetails[];
    }
  });
};

export const useCreateRental = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (rental: RentalRequest) => {
      const response = await axios.post(`${API_BASE}/rentals`, rental);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['rental-stats'] });
    }
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (rentalId: number) => {
      const response = await axios.put(`${API_BASE}/rentals/${rentalId}/return`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['rental-stats'] });
    }
  });
};

export const useDeleteRental = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`${API_BASE}/rentals/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] });
      queryClient.invalidateQueries({ queryKey: ['rental-stats'] });
    }
  });
};

export const useOverdueRentals = () => {
  return useQuery({
    queryKey: ['rentals', 'overdue'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE}/rentals/overdue/list`);
      return response.data as RentalWithDetails[];
    }
  });
};

export const useRentalStats = () => {
  return useQuery({
    queryKey: ['rental-stats'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE}/rentals/stats/overview`);
      return response.data as RentalStats;
    }
  });
};