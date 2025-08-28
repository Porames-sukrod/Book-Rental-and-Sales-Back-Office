import { Hono } from 'hono';
import db from '../db/jsonDB';
import type { Rental } from '../types/indextypes';

const rentals = new Hono();


rentals.get('/', (c) => {
  const result = db.getAllRentalsWithDetails();
  return c.json(result);
});


rentals.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const result = db.getRentalWithDetails(id);
  
  if (!result) {
    return c.json({ error: 'Rental not found' }, 404);
  }
  
  return c.json(result);
});


rentals.post('/', async (c) => {
  try {
    const body = await c.req.json<{
      book_id: number;
      customer_id: number;
      rental_days: number;
    }>();
    
    if (!body.book_id || !body.customer_id || !body.rental_days) {
      return c.json({ error: 'book_id, customer_id, and rental_days are required' }, 400);
    }
    
    const book = db.getBookById(body.book_id);
    if (!book) {
      return c.json({ error: 'Book not found' }, 404);
    }
    
    if (book.stock <= 0) {
      return c.json({ error: 'Book is out of stock' }, 400);
    }
    
    if (book.status !== 'available') {
      return c.json({ error: 'Book is not available for rent' }, 400);
    }
    
    const customer = db.getCustomerById(body.customer_id);
    if (!customer) {
      return c.json({ error: 'Customer not found' }, 404);
    }
    
    const rental_date = new Date().toISOString().split('T')[0];
    const due_date = new Date();
    due_date.setDate(due_date.getDate() + body.rental_days);
    
    const rentalData = {
      book_id: body.book_id,
      customer_id: body.customer_id,
      rental_date,
      due_date: due_date.toISOString().split('T')[0],
      status: 'active' as const
    };
    
    const result = db.createRental(rentalData);
    
    db.updateBook(body.book_id, { 
      stock: book.stock - 1,
      status: book.stock - 1 <= 0 ? 'rented' : 'available'
    });
    
    const rentalWithDetails = db.getRentalWithDetails(result.id!);
    
    return c.json(rentalWithDetails);
  } catch (error) {
    console.error('Error creating rental:', error);
    return c.json({ error: 'Failed to create rental' }, 400);
  }
});

rentals.put('/:id/return', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    const rental = db.getRentalById(id);
    if (!rental) {
      return c.json({ error: 'Rental not found' }, 404);
    }
    
    if (rental.status !== 'active') {
      return c.json({ error: 'Rental is not active' }, 400);
    }
    
    const return_date = new Date().toISOString().split('T')[0];
    const updatedRental = db.updateRental(id, {
      return_date,
      status: 'returned'
    });
    
    if (!updatedRental) {
      return c.json({ error: 'Failed to update rental' }, 500);
    }
    
    const book = db.getBookById(rental.book_id);
    if (book) {
      db.updateBook(rental.book_id, {
        stock: book.stock + 1,
        status: 'available'
      });
    }
    
    const rentalWithDetails = db.getRentalWithDetails(id);
    
    return c.json(rentalWithDetails);
  } catch (error) {
    console.error('Error returning book:', error);
    return c.json({ error: 'Failed to return book' }, 400);
  }
});

rentals.get('/overdue/list', (c) => {
  const today = new Date().toISOString().split('T')[0];
  const overdueRentals = db.getAllRentalsWithDetails().filter(rental => 
    rental.status === 'active' && rental.due_date < today
  );
  
  overdueRentals.forEach(rental => {
    if (rental.status === 'active') {
      db.updateRental(rental.id!, { status: 'overdue' });
    }
  });
  
  return c.json(overdueRentals.map(r => ({ ...r, status: 'overdue' })));
});

rentals.delete('/:id', (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    const rental = db.getRentalById(id);
    if (!rental) {
      return c.json({ error: 'Rental not found' }, 404);
    }
    
    if (rental.status === 'active' || rental.status === 'overdue') {
      return c.json({ error: 'Cannot delete active rental. Please return the book first.' }, 400);
    }
    
    const success = db.deleteRental(id);
    
    if (!success) {
      return c.json({ error: 'Failed to delete rental' }, 500);
    }
    
    return c.json({ message: 'Rental deleted successfully' });
  } catch (error) {
    console.error('Error deleting rental:', error);
    return c.json({ error: 'Failed to delete rental' }, 400);
  }
});

rentals.get('/stats/overview', (c) => {
  const allRentals = db.getAllRentals();
  const today = new Date().toISOString().split('T')[0];
  
  const stats = {
    total_rentals: allRentals.length,
    active_rentals: allRentals.filter(r => r.status === 'active').length,
    overdue_rentals: allRentals.filter(r => 
      r.status === 'active' && r.due_date < today
    ).length,
    returned_rentals: allRentals.filter(r => r.status === 'returned').length,
    total_revenue: allRentals
      .filter(r => r.status === 'returned')
      .reduce((sum, rental) => {
        const book = db.getBookById(rental.book_id);
        return sum + (book?.price_rent || 0);
      }, 0)
  };
  
  return c.json(stats);
});

export default rentals;