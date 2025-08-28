import React, { useState } from "react";
import { useCreateBook, useUpdateBook, type Book } from "../hooks/api";
import "../css/BookForm.css";

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

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <div className="book-form-field">
        <label className="book-form-label">ชื่อหนังสือ</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="book-form-input"
        />
      </div>

      <div className="book-form-field">
        <label className="book-form-label">ผู้แต่ง</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="book-form-input"
        />
      </div>

      <div className="book-form-field">
        <label className="book-form-label">ISBN</label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          className="book-form-input"
        />
      </div>

      <div className="book-form-grid-container">
        <div className="book-form-field">
          <label className="book-form-label">ราคาขาย (บาท)</label>
          <input
            type="number"
            name="price_buy"
            value={formData.price_buy}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="book-form-input"
          />
        </div>

        <div className="book-form-field">
          <label className="book-form-label">ราคาเช่า (บาท)</label>
          <input
            type="number"
            name="price_rent"
            value={formData.price_rent}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="book-form-input"
          />
        </div>
      </div>

      <div className="book-form-field">
        <label className="book-form-label">จำนวนสต็อก</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          className="book-form-input"
        />
      </div>

      <div className="book-form-field">
        <label className="book-form-label">สถานะ</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="book-form-select"
        >
          <option value="available">พร้อมจำหน่าย</option>
          <option value="rented">ให้เช่าแล้ว</option>
          <option value="sold">ขายแล้ว</option>
        </select>
      </div>

      <div className="book-form-button-container">
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="book-form-primary-button"
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
            className="book-form-secondary-button"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;
