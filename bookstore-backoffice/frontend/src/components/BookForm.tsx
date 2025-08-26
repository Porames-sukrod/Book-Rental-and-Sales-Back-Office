import React, { useState } from "react";
import { useCreateBook, useUpdateBook, type Book } from "../hooks/api";

interface BookFormProps {
  book?: Book;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Book, "id">>({
    title: book?.title || "",
    author: book?.author || "",
    isbn: book?.isbn || "",
    price_buy: book?.price_buy || 0,
    price_rent: book?.price_rent || 0,
    stock: book?.stock || 0,
    status: book?.status || "available",
  });

  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (book?.id) {
        await updateMutation.mutateAsync({ ...formData, id: book.id });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("price") || name === "stock"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const styles = {
    form: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px",
      maxWidth: "600px",
      margin: "0 auto",
    },
    field: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "4px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "bold" as const,
      color: "#374151",
    },
    input: {
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      outline: "none",
    },
    select: {
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      outline: "none",
      backgroundColor: "white",
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    buttonContainer: {
      display: "flex",
      gap: "8px",
    },
    primaryButton: {
      flex: 1,
      padding: "10px 16px",
      backgroundColor: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
    },
    secondaryButton: {
      padding: "10px 16px",
      backgroundColor: "transparent",
      color: "#374151",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.field}>
        <label style={styles.label}>ชื่อหนังสือ</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>ผู้แต่ง</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          style={styles.input}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>ISBN</label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.gridContainer}>
        <div style={styles.field}>
          <label style={styles.label}>ราคาขาย (บาท)</label>
          <input
            type="number"
            name="price_buy"
            value={formData.price_buy}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>ราคาเช่า (บาท)</label>
          <input
            type="number"
            name="price_rent"
            value={formData.price_rent}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.field}>
        <label style={styles.label}>จำนวนสต็อก</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          style={styles.input}
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>สถานะ</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="available">พร้อมจำหน่าย</option>
          <option value="rented">ให้เช่าแล้ว</option>
          <option value="sold">ขายแล้ว</option>
        </select>
      </div>

      <div style={styles.buttonContainer}>
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          style={{
            ...styles.primaryButton,
            opacity:
              createMutation.isPending || updateMutation.isPending ? 0.5 : 1,
          }}
        >
          {createMutation.isPending || updateMutation.isPending
            ? "กำลังบันทึก..."
            : book?.id
            ? "อัปเดต"
            : "เพิ่มหนังสือ"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={styles.secondaryButton}
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;
