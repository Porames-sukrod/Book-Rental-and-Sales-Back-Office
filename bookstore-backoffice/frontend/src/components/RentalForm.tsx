import React, { useState } from "react";
import { useBooks, useCustomers, useCreateRental } from "../hooks/api";
import "../css/RentalForm.css";

interface RentalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RentalForm: React.FC<RentalFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    book_id: "",
    customer_id: "",
    rental_days: 7,
  });

  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const createRentalMutation = useCreateRental();

  const availableBooks =
    books?.filter((book) => book.stock > 0 && book.status === "available") ||
    [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.book_id || !formData.customer_id) {
      alert("กรุณาเลือกหนังสือและลูกค้า");
      return;
    }

    try {
      await createRentalMutation.mutateAsync({
        book_id: parseInt(formData.book_id),
        customer_id: parseInt(formData.customer_id),
        rental_days: formData.rental_days,
      });
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating rental:", error);
      alert(
        error.response?.data?.error || "เกิดข้อผิดพลาดในการสร้างรายการเช่า"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rental_days" ? parseInt(value) : value,
    }));
  };

  const selectedBook = availableBooks.find(
    (book) => book.id === parseInt(formData.book_id)
  );
  const totalPrice = selectedBook
    ? selectedBook.price_rent * formData.rental_days
    : 0;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + formData.rental_days);

  if (booksLoading || customersLoading) {
    return <div className="rental-form-loading">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="rental-form">
      <div className="rental-form-field">
        <label className="rental-form-label">
          เลือกหนังสือ<span className="rental-form-required">*</span>
        </label>
        <select
          name="book_id"
          value={formData.book_id}
          onChange={handleChange}
          required
          className="rental-form-select"
        >
          <option value="">-- เลือกหนังสือ --</option>
          {availableBooks.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} ({book.stock} เล่ม)
            </option>
          ))}
        </select>
        {availableBooks.length === 0 && (
          <p className="rental-form-alert">ไม่มีหนังสือที่สามารถเช่าได้</p>
        )}
      </div>

      <div className="rental-form-field">
        <label className="rental-form-label">
          เลือกผู้เช่า<span className="rental-form-required">*</span>
        </label>
        <select
          name="customer_id"
          value={formData.customer_id}
          onChange={handleChange}
          required
          className="rental-form-select"
        >
          <option value="">-- เลือกผู้เช่า --</option>
          {customers?.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        {customers?.length === 0 && (
          <p className="rental-form-alert">ยังไม่มีข้อมูลลูกค้า</p>
        )}
      </div>

      <div className="rental-form-field">
        <label className="rental-form-label">
          จำนวนวัน<span className="rental-form-required">*</span>
        </label>
        <input
          type="number"
          name="rental_days"
          value={formData.rental_days}
          onChange={handleChange}
          required
          min="1"
          className="rental-form-input"
        />
      </div>

      <div className="rental-form-summary">
        <h3 className="rental-form-summary-title">สรุปค่าใช้จ่าย</h3>
        <div className="rental-form-summary-item">
          <span>ค่าเช่าต่อวัน:</span>
          <span>฿{selectedBook?.price_rent.toLocaleString() || "0.00"}</span>
        </div>
        <div className="rental-form-summary-item">
          <span>ระยะเวลาเช่า:</span>
          <span>{formData.rental_days} วัน</span>
        </div>
        <div className="rental-form-summary-item">
          <span>กำหนดคืน:</span>
          <span>{dueDate.toLocaleDateString("th-TH")}</span>
        </div>
        <div className="rental-form-total-price">
          <span>ค่าเช่ารวม:</span>
          <span>฿{totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="rental-form-button-container">
        <button
          type="submit"
          disabled={
            createRentalMutation.isPending ||
            availableBooks.length === 0 ||
            customers?.length === 0
          }
          className="rental-form-primary-button"
        >
          {createRentalMutation.isPending
            ? "กำลังสร้างรายการเช่า..."
            : "สร้างรายการเช่า"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rental-form-secondary-button"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
};

export default RentalForm;
