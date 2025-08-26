import { Hono } from 'hono';
import db from '../db/jsonDB'; // เปลี่ยนจาก '../db/schema'
import type { Book } from '../types';

const books = new Hono();

// ดูหนังสือทั้งหมด
books.get('/', (c) => {
  const result = db.getAllBooks();
  return c.json(result);
});

// ดูหนังสือตาม ID
books.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const result = db.getBookById(id);
  
  if (!result) {
    return c.json({ error: 'Book not found' }, 404);
  }
  
  return c.json(result);
});

// เพิ่มหนังสือใหม่
books.post('/', async (c) => {
  try {
    const body = await c.req.json<Omit<Book, 'id' | 'created_at'>>();
    
    if (!body.title || !body.author) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    const bookData = {
      title: body.title,
      author: body.author,
      isbn: body.isbn || '',
      price_buy: Number(body.price_buy) || 0,
      price_rent: Number(body.price_rent) || 0,
      stock: Number(body.stock) || 0,
      status: body.status || 'available' as const
    };
    
    const result = db.createBook(bookData);
    return c.json(result);
  } catch (error) {
    console.error('Error creating book:', error);
    return c.json({ error: 'Failed to create book' }, 400);
  }
});

// แก้ไขหนังสือ
books.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json<Partial<Omit<Book, 'id' | 'created_at'>>>();
    
    const result = db.updateBook(id, body);
    
    if (!result) {
      return c.json({ error: 'Book not found' }, 404);
    }
    
    return c.json(result);
  } catch (error) {
    console.error('Error updating book:', error);
    return c.json({ error: 'Failed to update book' }, 400);
  }
});

// ลบหนังสือ
books.delete('/:id', (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    
    const success = db.deleteBook(id);
    
    if (!success) {
      return c.json({ error: 'Book not found' }, 404);
    }
    
    return c.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return c.json({ error: 'Failed to delete book' }, 400);
  }
});

export default books;