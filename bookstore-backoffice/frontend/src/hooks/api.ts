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

// Books API
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