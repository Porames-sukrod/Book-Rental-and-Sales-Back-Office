import React, { useState } from "react";
import { useBooks, useDeleteBook, type Book } from "../hooks/api";
import BookForm from "./BookForm";
import { Edit2, Trash2, Plus } from "lucide-react";
import "../css/BookList.css";

const BookList: React.FC = () => {
  const { data: books, isLoading, error } = useBooks();
  const deleteMutation = useDeleteBook();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading) return <div className="loading-state">กำลังโหลด...</div>;
  if (error)
    return <div className="error-state">เกิดข้อผิดพลาด: {error.message}</div>;

  const handleDelete = async (id: number) => {
    if (confirm("คุณแน่ใจว่าต้องการลบหนังสือนี้?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const statusColors = {
    available: { backgroundColor: "#dcfce7", color: "#15803d" },
    rented: { backgroundColor: "#fef3c7", color: "#d97706" },
    sold: { backgroundColor: "#fee2e2", color: "#dc2626" },
  };

  const statusLabels = {
    available: "พร้อมจำหน่าย",
    rented: "ให้เช่าแล้ว",
    sold: "ขายแล้ว",
  };

  if (showAddForm) {
    return (
      <div className="booklist-container">
        <button
          className="booklist-back-button"
          onClick={() => setShowAddForm(false)}
        >
          ← กลับ
        </button>
        <h2 className="booklist-add-title">เพิ่มหนังสือใหม่</h2>
        <BookForm
          onSuccess={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  if (editingBook) {
    return (
      <div className="booklist-container">
        <button
          className="booklist-back-button"
          onClick={() => setEditingBook(null)}
        >
          ← กลับ
        </button>
        <h2 className="booklist-edit-title">แก้ไขข้อมูลหนังสือ</h2>
        <BookForm
          book={editingBook}
          onSuccess={() => setEditingBook(null)}
          onCancel={() => setEditingBook(null)}
        />
      </div>
    );
  }

  return (
    <div className="booklist-container">
      <div className="booklist-header">
        <h1 className="booklist-title">จัดการหนังสือ</h1>
        <button
          className="booklist-add-button"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} />
          เพิ่มหนังสือใหม่
        </button>
      </div>

      {books && books.length > 0 ? (
        <div className="booklist-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-card-header">
                <h3 className="book-card-title">{book.title}</h3>
                <span
                  className="book-status-badge"
                  style={statusColors[book.status]}
                >
                  {statusLabels[book.status]}
                </span>
              </div>

              <p className="book-card-info">ผู้แต่ง: {book.author}</p>
              <p className="book-card-info">ISBN: {book.isbn}</p>
              <p className="book-card-info">
                ราคาขาย: ฿{book.price_buy.toLocaleString()}
              </p>
              <p className="book-card-info">
                ราคาเช่า: ฿{book.price_rent.toLocaleString()}
              </p>
              <p className="book-card-info">สต็อก: {book.stock} เล่ม</p>

              <div className="book-button-group">
                <button
                  onClick={() => setEditingBook(book)}
                  className="book-edit-button"
                >
                  <Edit2 size={14} />
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(book.id!)}
                  disabled={deleteMutation.isPending}
                  className="book-delete-button"
                >
                  <Trash2 size={14} />
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="booklist-empty-state">ยังไม่มีหนังสือในระบบ</div>
      )}
    </div>
  );
};

export default BookList;
