import fs from 'fs';
import path from 'path';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  price_buy: number;
  price_rent: number;
  stock: number;
  status: 'available' | 'rented' | 'sold';
  created_at: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  created_at: string;
}

interface Rental {
  id: number;
  book_id: number;
  customer_id: number;
  rental_date: string;
  due_date: string;
  return_date?: string;
  status: 'active' | 'returned' | 'overdue';
  created_at: string;
}

interface RentalWithDetails extends Rental {
  book_title: string;
  book_author: string;
  book_price_rent: number;
  customer_name: string;
  customer_phone: string;
  days_rented?: number;
  is_overdue?: boolean;
}

interface DatabaseData {
  books: Book[];
  customers: Customer[];
  rentals: Rental[];
  nextId: {
    books: number;
    customers: number;
    rentals: number;
  };
}

class JsonDB {
  private dataPath: string;
  private data: DatabaseData;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'database.json');
    this.data = {
      books: [],
      customers: [],
      rentals: [],
      nextId: {
        books: 1,
        customers: 1,
        rentals: 1
      }
    };
    
    this.ensureDataDir();
    this.loadData();
  }

  private ensureDataDir() {
    const dir = path.dirname(this.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadData() {
    try {
      if (fs.existsSync(this.dataPath)) {
        const fileData = fs.readFileSync(this.dataPath, 'utf8');
        this.data = JSON.parse(fileData);
        
        if (!this.data.nextId) {
          this.data.nextId = {
            books: Math.max(...this.data.books.map(b => b.id), 0) + 1,
            customers: Math.max(...this.data.customers.map(c => c.id), 0) + 1,
            rentals: Math.max(...this.data.rentals.map(r => r.id), 0) + 1
          };
        }
      } else {
        this.saveData();
      }
    } catch (error) {
      console.log('Error loading data, creating new database file');
      this.saveData();
    }
  }

  private saveData() {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Books methods
  getAllBooks(): Book[] {
    return this.data.books.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getBookById(id: number): Book | undefined {
    return this.data.books.find(book => book.id === id);
  }

  createBook(bookData: Omit<Book, 'id' | 'created_at'>): Book {
    const book: Book = {
      ...bookData,
      id: this.data.nextId.books++,
      created_at: new Date().toISOString()
    };
    
    this.data.books.push(book);
    this.saveData();
    return book;
  }

  updateBook(id: number, bookData: Partial<Omit<Book, 'id' | 'created_at'>>): Book | null {
    const index = this.data.books.findIndex(book => book.id === id);
    if (index === -1) return null;

    this.data.books[index] = { ...this.data.books[index], ...bookData };
    this.saveData();
    return this.data.books[index];
  }

  deleteBook(id: number): boolean {
    const index = this.data.books.findIndex(book => book.id === id);
    if (index === -1) return false;

    // ตรวจสอบว่ามีการเช่าที่ยังไม่คืนหรือไม่
    const activeRentals = this.data.rentals.filter(r => 
      r.book_id === id && (r.status === 'active' || r.status === 'overdue')
    );
    
    if (activeRentals.length > 0) {
      return false;
    }

    this.data.books.splice(index, 1);
    this.saveData();
    return true;
  }

  // Customers methods
  getAllCustomers(): Customer[] {
    return this.data.customers.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getCustomerById(id: number): Customer | undefined {
    return this.data.customers.find(customer => customer.id === id);
  }

  createCustomer(customerData: Omit<Customer, 'id' | 'created_at'>): Customer {
    const customer: Customer = {
      ...customerData,
      id: this.data.nextId.customers++,
      created_at: new Date().toISOString()
    };
    
    this.data.customers.push(customer);
    this.saveData();
    return customer;
  }

  updateCustomer(id: number, customerData: Partial<Omit<Customer, 'id' | 'created_at'>>): Customer | null {
    const index = this.data.customers.findIndex(customer => customer.id === id);
    if (index === -1) return null;

    this.data.customers[index] = { ...this.data.customers[index], ...customerData };
    this.saveData();
    return this.data.customers[index];
  }

  deleteCustomer(id: number): boolean {
    const index = this.data.customers.findIndex(customer => customer.id === id);
    if (index === -1) return false;

    this.data.customers.splice(index, 1);
    this.saveData();
    return true;
  }

  // Rentals methods
  getAllRentals(): Rental[] {
    return this.data.rentals.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  getRentalById(id: number): Rental | undefined {
    return this.data.rentals.find(rental => rental.id === id);
  }

  getRentalsByCustomerId(customerId: number): RentalWithDetails[] {
    const customerRentals = this.data.rentals
      .filter(rental => rental.customer_id === customerId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return customerRentals.map(rental => {
      const book = this.getBookById(rental.book_id);
      const customer = this.getCustomerById(rental.customer_id);
      
      return {
        ...rental,
        book_title: book?.title || 'Unknown',
        book_author: book?.author || 'Unknown',
        book_price_rent: book?.price_rent || 0,
        customer_name: customer?.name || 'Unknown',
        customer_phone: customer?.phone || 'Unknown',
        days_rented: rental.return_date ? 
          Math.ceil((new Date(rental.return_date).getTime() - new Date(rental.rental_date).getTime()) / (1000 * 60 * 60 * 24)) :
          Math.ceil((new Date().getTime() - new Date(rental.rental_date).getTime()) / (1000 * 60 * 60 * 24)),
        is_overdue: rental.status === 'active' && new Date(rental.due_date) < new Date()
      };
    });
  }

  getAllRentalsWithDetails(): RentalWithDetails[] {
    const today = new Date().toISOString().split('T')[0];
    
    return this.data.rentals
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(rental => {
        const book = this.getBookById(rental.book_id);
        const customer = this.getCustomerById(rental.customer_id);
        
        // อัปเดตสถานะหากเลยกำหนด
        let status = rental.status;
        if (status === 'active' && rental.due_date < today) {
          status = 'overdue';
          this.updateRental(rental.id, { status: 'overdue' });
        }
        
        return {
          ...rental,
          status,
          book_title: book?.title || 'Unknown',
          book_author: book?.author || 'Unknown',
          book_price_rent: book?.price_rent || 0,
          customer_name: customer?.name || 'Unknown',
          customer_phone: customer?.phone || 'Unknown',
          days_rented: rental.return_date ? 
            Math.ceil((new Date(rental.return_date).getTime() - new Date(rental.rental_date).getTime()) / (1000 * 60 * 60 * 24)) :
            Math.ceil((new Date().getTime() - new Date(rental.rental_date).getTime()) / (1000 * 60 * 60 * 24)),
          is_overdue: status === 'overdue'
        };
      });
  }

  getRentalWithDetails(id: number): RentalWithDetails | null {
    const rental = this.getRentalById(id);
    if (!rental) return null;

    const book = this.getBookById(rental.book_id);
    const customer = this.getCustomerById(rental.customer_id);
    const today = new Date().toISOString().split('T')[0];
    
    // อัปเดตสถานะหากเลยกำหนด
    let status = rental.status;
    if (status === 'active' && rental.due_date < today) {
      status = 'overdue';
      this.updateRental(rental.id, { status: 'overdue' });
    }
    
    return {
      ...rental,
      status,
      book_title: book?.title || 'Unknown',
      book_author: book?.author || 'Unknown',
      book_price_rent: book?.price_rent || 0,
      customer_name: customer?.name || 'Unknown',
      customer_phone: customer?.phone || 'Unknown',
      days_rented: rental.return_date ? 
        Math.ceil((new Date(rental.return_date).getTime() - new Date(rental.rental_date).getTime()) / (1000 * 60 * 60 * 24)) :
        Math.ceil((new Date().getTime() - new Date(rental.rental_date).getTime()) / (1000 * 60 * 60 * 24)),
      is_overdue: status === 'overdue'
    };
  }

  createRental(rentalData: Omit<Rental, 'id' | 'created_at'>): Rental {
    const rental: Rental = {
      ...rentalData,
      id: this.data.nextId.rentals++,
      created_at: new Date().toISOString()
    };
    
    this.data.rentals.push(rental);
    this.saveData();
    return rental;
  }

  updateRental(id: number, rentalData: Partial<Omit<Rental, 'id' | 'created_at'>>): Rental | null {
    const index = this.data.rentals.findIndex(rental => rental.id === id);
    if (index === -1) return null;

    this.data.rentals[index] = { ...this.data.rentals[index], ...rentalData };
    this.saveData();
    return this.data.rentals[index];
  }

  deleteRental(id: number): boolean {
    const index = this.data.rentals.findIndex(rental => rental.id === id);
    if (index === -1) return false;

    this.data.rentals.splice(index, 1);
    this.saveData();
    return true;
  }
}

export default new JsonDB();