import React, { useState } from "react";
import {
  useRentals,
  useReturnBook,
  useDeleteRental,
  useRentalStats,
} from "../hooks/api";
import RentalForm from "./RentalForm";
import {
  Plus,
  BookOpen,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import "../css/RentalList.css";

const RentalList: React.FC = () => {
  const { data: rentals, isLoading, error } = useRentals();
  const { data: stats } = useRentalStats();
  const returnBookMutation = useReturnBook();
  const deleteRentalMutation = useDeleteRental();
  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading) return <div className="loading">กำลังโหลด...</div>;
  if (error)
    return <div className="error">เกิดข้อผิดพลาด: {error.message}</div>;

  const handleReturnBook = async (rentalId: number) => {
    if (confirm("คุณแน่ใจว่าต้องการคืนหนังสือนี้?")) {
      try {
        await returnBookMutation.mutateAsync(rentalId);
      } catch (error: any) {
        alert(error.response?.data?.error || "เกิดข้อผิดพลาดในการคืนหนังสือ");
      }
    }
  };

  const handleDeleteRental = async (rentalId: number) => {
    if (
      confirm(
        "คุณแน่ใจว่าต้องการลบรายการเช่านี้? (เฉพาะรายการที่คืนแล้วเท่านั้น)"
      )
    ) {
      try {
        await deleteRentalMutation.mutateAsync(rentalId);
      } catch (error: any) {
        alert(error.response?.data?.error || "เกิดข้อผิดพลาดในการลบ");
      }
    }
  };

  const statusLabels: Record<string, string> = {
    active: "กำลังเช่า",
    returned: "คืนแล้ว",
    overdue: "เลยกำหนด",
  };

  if (showAddForm) {
    return (
      <div className="container">
        <button onClick={() => setShowAddForm(false)} className="backButton">
          ← กลับ
        </button>
        <h2 className="formTitle">สร้างรายการเช่าใหม่</h2>
        <RentalForm
          onSuccess={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">จัดการการเช่าหนังสือ</h1>
        <button onClick={() => setShowAddForm(true)} className="addButton">
          <Plus size={20} />
          เช่า หนังสือ
        </button>
      </div>

      {stats && (
        <div className="statsGrid">
          <div className="statCard">
            <div className="statValue blue">{stats.total_rentals}</div>
            <div className="statLabel">รายการเช่าทั้งหมด</div>
          </div>
          <div className="statCard">
            <div className="statValue green">{stats.active_rentals}</div>
            <div className="statLabel">กำลังเช่า</div>
          </div>
          <div className="statCard">
            <div className="statValue red">{stats.overdue_rentals}</div>
            <div className="statLabel">เลยกำหนด</div>
          </div>
          <div className="statCard">
            <div className="statValue emerald">
              ฿{stats.total_revenue.toLocaleString()}
            </div>
            <div className="statLabel">รายได้จากการเช่า</div>
          </div>
        </div>
      )}

      <div className="grid">
        {rentals?.map((rental) => (
          <div key={rental.id} className="card">
            <div className="cardHeader">
              <h3 className="bookTitle">{rental.book_title}</h3>
              <span className={`statusBadge ${rental.status}`}>
                {statusLabels[rental.status]}
              </span>
            </div>

            {rental.is_overdue && rental.status === "overdue" && (
              <div className="overdueWarning">
                <AlertTriangle size={14} />
                เลยกำหนดคืนแล้ว!
              </div>
            )}

            <div className="infoSection">
              <div className="infoItem">
                <BookOpen className="icon" />
                <span>{rental.book_author}</span>
              </div>

              <div className="infoItem">
                <User className="icon" />
                <span>{rental.customer_name}</span>
              </div>

              <div className="infoItem">
                <Calendar className="icon" />
                <span>
                  เช่า:{" "}
                  {new Date(rental.rental_date).toLocaleDateString("th-TH")}
                </span>
              </div>

              <div className="infoItem">
                <Clock className="icon" />
                <span>
                  ครบกำหนด:{" "}
                  {new Date(rental.due_date).toLocaleDateString("th-TH")}
                </span>
              </div>
            </div>

            {rental.return_date && (
              <div className="infoItem">
                <CheckCircle className="icon green" />
                <span>
                  คืนวันที่:{" "}
                  {new Date(rental.return_date).toLocaleDateString("th-TH")}
                </span>
              </div>
            )}

            <div className="rentalPrice">
              ค่าเช่า: ฿{rental.book_price_rent.toLocaleString()} ×{" "}
              {rental.days_rented} วัน =
              <span className="totalPrice">
                {" "}
                ฿
                {(
                  rental.book_price_rent * (rental.days_rented || 1)
                ).toLocaleString()}
              </span>
            </div>

            <div className="buttonGroup">
              {rental.status === "active" || rental.status === "overdue" ? (
                <button
                  onClick={() => handleReturnBook(rental.id!)}
                  disabled={returnBookMutation.isPending}
                  className={`button returnButton ${
                    returnBookMutation.isPending ? "disabled" : ""
                  }`}
                >
                  <CheckCircle size={14} />
                  {returnBookMutation.isPending ? "กำลังคืน..." : "คืนหนังสือ"}
                </button>
              ) : (
                <button
                  onClick={() => handleDeleteRental(rental.id!)}
                  disabled={deleteRentalMutation.isPending}
                  className={`button deleteButton ${
                    deleteRentalMutation.isPending ? "disabled" : ""
                  }`}
                >
                  <Trash2 size={14} />
                  {deleteRentalMutation.isPending ? "กำลังลบ..." : "ลบรายการ"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {rentals?.length === 0 && (
        <div className="emptyState">ยังไม่มีรายการเช่าหนังสือในระบบ</div>
      )}
    </div>
  );
};

export default RentalList;
