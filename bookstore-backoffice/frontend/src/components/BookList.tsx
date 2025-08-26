import React, { useState } from "react";
import { useBooks, useDeleteBook, type Book } from "../hooks/api";
import BookForm from "./BookForm";
import { Edit2, Trash2, Plus } from "lucide-react";

const BookList: React.FC = () => {
  const { data: books, isLoading, error } = useBooks();
  const deleteMutation = useDeleteBook();
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>กำลังโหลด...</div>
    );
  if (error)
    return (
      <div style={{ color: "#dc2626", textAlign: "center", padding: "20px" }}>
        เกิดข้อผิดพลาด: {error.message}
      </div>
    );

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

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold" as const,
      color: "#1f2937",
    },
    addButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      padding: "10px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "16px",
    },
    card: {
      backgroundColor: "white",
      padding: "16px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "12px",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "bold" as const,
      color: "#1f2937",
      margin: 0,
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold" as const,
    },
    cardInfo: {
      fontSize: "14px",
      color: "#6b7280",
      margin: "4px 0",
    },
    buttonGroup: {
      display: "flex",
      gap: "8px",
      marginTop: "16px",
    },
    editButton: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "6px 12px",
      backgroundColor: "#f3f4f6",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      color: "#374151",
    },
    deleteButton: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "6px 12px",
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
    },
    emptyState: {
      textAlign: "center" as const,
      padding: "40px",
      color: "#6b7280",
    },
  };

  if (showAddForm) {
    return (
      <div style={styles.container}>
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
        >
          เพิ่มหนังสือใหม่
        </h2>
        <BookForm
          onSuccess={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  if (editingBook) {
    return (
      <div style={styles.container}>
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
        >
          แก้ไขหนังสือ
        </h2>
        <BookForm
          book={editingBook}
          onSuccess={() => setEditingBook(null)}
          onCancel={() => setEditingBook(null)}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>จัดการหนังสือ</h1>
        <button onClick={() => setShowAddForm(true)} style={styles.addButton}>
          <Plus size={20} />
          เพิ่มหนังสือใหม่
        </button>
      </div>

      <div style={styles.grid}>
        {books?.map((book) => (
          <div key={book.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>{book.title}</h3>
              <span
                style={{ ...styles.statusBadge, ...statusColors[book.status] }}
              >
                {statusLabels[book.status]}
              </span>
            </div>

            <p style={styles.cardInfo}>ผู้แต่ง: {book.author}</p>
            <p style={styles.cardInfo}>ISBN: {book.isbn}</p>
            <p style={styles.cardInfo}>
              ราคาขาย: ฿{book.price_buy.toLocaleString()}
            </p>
            <p style={styles.cardInfo}>
              ราคาเช่า: ฿{book.price_rent.toLocaleString()}
            </p>
            <p style={styles.cardInfo}>สต็อก: {book.stock} เล่ม</p>

            <div style={styles.buttonGroup}>
              <button
                onClick={() => setEditingBook(book)}
                style={styles.editButton}
              >
                <Edit2 size={14} />
                แก้ไข
              </button>
              <button
                onClick={() => handleDelete(book.id!)}
                disabled={deleteMutation.isPending}
                style={{
                  ...styles.deleteButton,
                  opacity: deleteMutation.isPending ? 0.5 : 1,
                }}
              >
                <Trash2 size={14} />
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {books?.length === 0 && (
        <div style={styles.emptyState}>ยังไม่มีหนังสือในระบบ</div>
      )}
    </div>
  );
};

export default BookList;
