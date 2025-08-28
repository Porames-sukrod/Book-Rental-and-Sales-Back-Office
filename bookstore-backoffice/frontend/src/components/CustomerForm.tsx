import React, { useState } from "react";
import {
  useCreateCustomer,
  useUpdateCustomer,
  type Customer,
} from "../hooks/api";
import "../css/CustomerForm.css";

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Customer, "id" | "created_at">>(
    {
      name: customer?.name || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
      address: customer?.address || "",
    }
  );

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (customer?.id) {
        await updateMutation.mutateAsync({ ...formData, id: customer.id });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onSuccess?.();
    } catch (error: any) {
      console.error("Error saving customer:", error);
      alert(error.response?.data?.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div className="customer-form-field">
        <label className="customer-form-label">
          ชื่อ-นามสกุล<span className="customer-form-required">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="customer-form-input"
        />
      </div>

      <div className="customer-form-field">
        <label className="customer-form-label">
          เบอร์โทรศัพท์<span className="customer-form-required">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="customer-form-input"
        />
      </div>

      <div className="customer-form-field">
        <label className="customer-form-label">อีเมล (ไม่บังคับ)</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="customer-form-input"
        />
      </div>

      <div className="customer-form-field">
        <label className="customer-form-label">ที่อยู่ (ไม่บังคับ)</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="ที่อยู่สำหรับติดต่อ"
          className="customer-form-textarea"
        />
      </div>

      <div className="customer-form-button-container">
        <button
          type="submit"
          disabled={createMutation.isPending || updateMutation.isPending}
          className="customer-form-primary-button"
        >
          {createMutation.isPending || updateMutation.isPending
            ? "กำลังบันทึก..."
            : customer?.id
            ? "อัปเดตข้อมูล"
            : "เพิ่มลูกค้า"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="customer-form-secondary-button"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
};

export default CustomerForm;
