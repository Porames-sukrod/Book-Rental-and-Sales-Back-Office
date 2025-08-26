import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import books from './routes/books';
// เปลี่ยนจาก './db/schema' เป็น './db/jsonDB'
import './db/jsonDB';

const app = new Hono();

// CORS middleware
app.use('/*', cors({
  origin: 'http://localhost:5173', // Vite dev server
  allowHeaders: ['Content-Type'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Routes
app.route('/api/books', books);

// Health check
app.get('/', (c) => {
  return c.json({ 
    message: 'Bookstore API is running!',
    database: 'JSON File Database',
    timestamp: new Date().toISOString()
  });
});

const port = 3000;
console.log(`🚀 Server is running on http://localhost:${port}`);
console.log(`📁 Database: JSON File`);

serve({
  fetch: app.fetch,
  port
});