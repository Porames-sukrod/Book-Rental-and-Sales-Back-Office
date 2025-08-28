import { Hono } from 'hono';
import db from '../db/jsonDB';
import type { Customer } from '../types/indextypes';

const customers = new Hono();

customers.get('/', (c) => {
  const result = db.getAllCustomers();
  return c.json(result);
});

customers.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const result = db.getCustomerById(id);
  
  if (!result) {
    return c.json({ error: 'Customer not found' }, 404);
  }
  
  return c.json(result);
});

customers.post('/', async (c) => {
  try {
    const body = await c.req.json<Omit<Customer, 'id' | 'created_at'>>();
    

    if (!body.name || !body.phone) {
      return c.json({ error: 'Name and phone are required' }, 400);
    }
    
    const existingCustomer = db.getAllCustomers().find(c => c.phone === body.phone);
    if (existingCustomer) {
      return c.json({ error: 'Phone number already exists' }, 400);
    }
    
    const customerData = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() || '',
      address: body.address?.trim() || ''
    };
    
    const result = db.createCustomer(customerData);
    return c.json(result);
  } catch (error) {
    console.error('Error creating customer:', error);
    return c.json({ error: 'Failed to create customer' }, 400);
  }
});

customers.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json<Partial<Omit<Customer, 'id' | 'created_at'>>>();
    
    const existingCustomer = db.getCustomerById(id);
    if (!existingCustomer) {
      return c.json({ error: 'Customer not found' }, 404);
    }
    
    if (body.phone && body.phone !== existingCustomer.phone) {
      const phoneExists = db.getAllCustomers().find(c => c.phone === body.phone && c.id !== id);
      if (phoneExists) {
        return c.json({ error: 'Phone number already exists' }, 400);
      }
    }
    
    const updateData: Partial<Omit<Customer, 'id' | 'created_at'>> = {};
    
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.phone !== undefined) updateData.phone = body.phone.trim();
    if (body.email !== undefined) updateData.email = body.email.trim();
    if (body.address !== undefined) updateData.address = body.address.trim();
    
    const result = db.updateCustomer(id, updateData);
    
    if (!result) {
      return c.json({ error: 'Failed to update customer' }, 500);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error updating customer:', error);
    return c.json({ error: 'Failed to update customer' }, 400);
  }
});

customers.delete('/:id', (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    const existingCustomer = db.getCustomerById(id);
    if (!existingCustomer) {
      return c.json({ error: 'Customer not found' }, 404);
    }
    
    const activeRentals = db.getAllRentals().filter(r => 
      r.customer_id === id && r.status === 'active'
    );
    
    if (activeRentals.length > 0) {
      return c.json({ 
        error: 'Cannot delete customer with active rentals' 
      }, 400);
    }
    
    const success = db.deleteCustomer(id);
    
    if (!success) {
      return c.json({ error: 'Failed to delete customer' }, 500);
    }
    
    return c.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return c.json({ error: 'Failed to delete customer' }, 400);
  }
});

customers.get('/:id/rentals', (c) => {
  const id = parseInt(c.req.param('id'));
  
  const customer = db.getCustomerById(id);
  if (!customer) {
    return c.json({ error: 'Customer not found' }, 404);
  }
  
  const rentals = db.getRentalsByCustomerId(id);
  return c.json(rentals);
});

export default customers;