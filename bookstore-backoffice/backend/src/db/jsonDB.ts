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

interface DatabaseData {
  books: Book[];
  nextId: {
    books: number;
  };
}

class JsonDB {
  private dataPath: string;
  private data: DatabaseData;

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'database.json');
    this.data = {
      books: [],
      nextId: {
        books: 1
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
      } else {
        this.saveData();
      }
    } catch (error) {
      console.log('Creating new database file');
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

    this.data.books.splice(index, 1);
    this.saveData();
    return true;
  }
}

export default new JsonDB();