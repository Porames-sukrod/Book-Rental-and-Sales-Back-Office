import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import books from './routes/books';
import customers from './routes/customers';
import rentals from './routes/rentats';
import './db/jsonDB';

const app = new Hono();

app.use('/*', cors({
  origin: 'http://localhost:5173', 
  allowHeaders: ['Content-Type'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.route('/api/books', books);
app.route('/api/customers', customers);
app.route('/api/rentals', rentals);

app.get('/', (c) => {
  return c.json({ 
    message: 'Bookstore API is running!',
    database: 'JSON File Database',
    features: [
      'Books Management',
      'Customers Management', 
      'Rental System',
      'Real-time Stock Updates'
    ],
    timestamp: new Date().toISOString()
  });
});

const port = 3000;
console.log(` Server is running on http://localhost:${port}`);
console.log(` Database: JSON File`);
console.log(` Features: Books, Customers, Rentals Management`);

serve({
  fetch: app.fetch,
  port
});