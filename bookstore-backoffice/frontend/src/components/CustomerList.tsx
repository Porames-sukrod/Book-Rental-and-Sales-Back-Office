import React, { useState } from "react";
import {
  useCustomers,
  useDeleteCustomer,
  useCustomerRentals,
  type Customer,
} from "../hooks/api";
import CustomerForm from "./CustomerForm";
import {
  Edit2,
  Trash2,
  Plus,
  User,
  Phone,
  Mail,
  MapPin,
  History,
  Clock,
} from "lucide-react";
import "../css/CustomerList.css";

const CustomerRentals: React.FC<{
  customerId: number;
  onBack: () => void;
}> = ({ customerId, onBack }) => {
  const { data: rentals, isLoading, error } = useCustomerRentals(customerId);
  const rentalStatusColors = {
    active: { backgroundColor: "#dcfce7", color: "#15803d" },
    returned: { backgroundColor: "#e0f2fe", color: "#0369a1" },
    overdue: { backgroundColor: "#fee2e2", color: "#dc2626" },
  };

  const rentalStatusLabels = {
    active: "กำลังเช่า",
    returned: "คืนแล้ว",
    overdue: "เลยกำหนด",
  };

  if (isLoading) return <div className="loading-state">กำลังโหลด...</div>;
  if (error)
    return (
      <div className="error-state">
        เกิดข้อผิดพลาดในการโหลดประวัติการเช่า: {error.message}
      </div>
    );

  return (
    <div className="customer-rental-container">
      <button className="customer-rental-back-button" onClick={onBack}>
        ← กลับ
      </button>
      <h2 className="customer-rental-title">ประวัติการเช่า</h2>
      {rentals && rentals.length > 0 ? (
        <div className="customer-rental-grid">
          {rentals.map((rental) => (
            <div key={rental.id} className="customer-rental-card">
              <div className="customer-rental-header">
                <h3 className="customer-rental-book-title">
                  {rental.book_title}
                </h3>
                <span
                  className="customer-rental-status-badge"
                  style={rentalStatusColors[rental.status]}
                >
                  {rentalStatusLabels[rental.status]}
                </span>
              </div>
              <p className="customer-rental-info">
                ผู้แต่ง: {rental.book_author}
              </p>
              <p className="customer-rental-info">
                ค่าเช่า: ฿{rental.book_price_rent.toLocaleString()}
              </p>
              <p className="customer-rental-info">
                วันที่เช่า:{" "}
                {new Date(rental.rental_date).toLocaleDateString("th-TH")}
              </p>
              <p className="customer-rental-info">
                วันที่ครบกำหนด:{" "}
                {new Date(rental.due_date).toLocaleDateString("th-TH")}
              </p>
              {rental.return_date && (
                <p className="customer-rental-info">
                  วันที่คืน:{" "}
                  {new Date(rental.return_date).toLocaleDateString("th-TH")}
                </p>
              )}
              <p className="customer-rental-info">
                ระยะเวลา: {rental.days_rented} วัน
              </p>
              {rental.is_overdue && (
                <p className="customer-rental-overdue-info">⚠️ เลยกำหนดคืน</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="customer-rental-empty-state">
          ยังไม่มีประวัติการเช่าสำหรับลูกค้าคนนี้
        </div>
      )}
    </div>
  );
};

const CustomerList: React.FC = () => {
  const { data: customers, isLoading, error } = useCustomers();
  const deleteMutation = useDeleteCustomer();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );

  const handleDelete = async (id: number) => {
    if (confirm("คุณแน่ใจว่าต้องการลบข้อมูลลูกค้านี้?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error: any) {
        alert(error.response?.data?.error || "เกิดข้อผิดพลาดในการลบ");
      }
    }
  };

  if (isLoading) return <div className="loading-state">กำลังโหลด...</div>;
  if (error)
    return <div className="error-state">เกิดข้อผิดพลาด: {error.message}</div>;

  if (showAddForm) {
    return (
      <div className="customer-list-container">
        <button
          className="customer-list-back-button"
          onClick={() => setShowAddForm(false)}
        >
          ← กลับ
        </button>
        <h2 className="customer-list-add-title">เพิ่มลูกค้าใหม่</h2>
        <CustomerForm
          onSuccess={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  if (editingCustomer) {
    return (
      <div className="customer-list-container">
        <button
          className="customer-list-back-button"
          onClick={() => setEditingCustomer(null)}
        >
          ← กลับ
        </button>
        <h2 className="customer-list-edit-title">แก้ไขข้อมูลลูกค้า</h2>
        <CustomerForm
          customer={editingCustomer}
          onSuccess={() => setEditingCustomer(null)}
          onCancel={() => setEditingCustomer(null)}
        />
      </div>
    );
  }

  if (selectedCustomerId) {
    return (
      <CustomerRentals
        customerId={selectedCustomerId}
        onBack={() => setSelectedCustomerId(null)}
      />
    );
  }

  return (
    <div className="customer-list-container">
      <div className="customer-list-header">
        <h1 className="customer-list-title">จัดการลูกค้า</h1>
        <button
          className="customer-list-add-button"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} /> เพิ่มลูกค้าใหม่
        </button>
      </div>
      {customers && customers.length > 0 ? (
        <div className="customer-list-grid">
          {customers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="customer-card-header">
                <div className="customer-card-avatar">
                  <User size={24} />
                </div>
                <h3 className="customer-card-title">{customer.name}</h3>
              </div>
              <div className="customer-info-item">
                <Phone className="customer-info-icon" /> {customer.phone}
              </div>
              {customer.email && (
                <div className="customer-info-item">
                  <Mail className="customer-info-icon" /> {customer.email}
                </div>
              )}
              {customer.address && (
                <div className="customer-info-item">
                  <MapPin className="customer-info-icon" /> {customer.address}
                </div>
              )}
              {customer.created_at && (
                <div className="customer-info-item">
                  <Clock className="customer-info-icon" /> ลงทะเบียน:{" "}
                  {new Date(customer.created_at).toLocaleDateString("th-TH")}
                </div>
              )}

              <div className="customer-button-group">
                <button
                  onClick={() => setEditingCustomer(customer)}
                  className="customer-edit-button"
                >
                  <Edit2 size={14} /> แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(customer.id!)}
                  disabled={deleteMutation.isPending}
                  className="customer-delete-button"
                >
                  <Trash2 size={14} /> ลบ
                </button>
                <button
                  onClick={() => setSelectedCustomerId(customer.id!)}
                  className="customer-history-button"
                >
                  <History size={14} /> ดูประวัติเช่า
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="customer-list-empty-state">ยังไม่มีลูกค้าในระบบ</div>
      )}
    </div>
  );
};

export default CustomerList;
