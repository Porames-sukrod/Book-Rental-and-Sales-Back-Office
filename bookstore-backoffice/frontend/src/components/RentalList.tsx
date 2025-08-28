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

const RentalList: React.FC = () => {
  const { data: rentals, isLoading, error } = useRentals();
  const { data: stats } = useRentalStats();
  const returnBookMutation = useReturnBook();
  const deleteRentalMutation = useDeleteRental();
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

  const statusColors = {
    active: { backgroundColor: "#dcfce7", color: "#15803d" },
    returned: { backgroundColor: "#e0f2fe", color: "#0369a1" },
    overdue: { backgroundColor: "#fee2e2", color: "#dc2626" },
  };

  const statusLabels = {
    active: "กำลังเช่า",
    returned: "คืนแล้ว",
    overdue: "เลยกำหนด",
  };

  const styles = {
    container: {
      maxWidth: "1400px",
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
      backgroundColor: "#7c3aed",
      color: "white",
      border: "none",
      padding: "10px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.2s",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "24px",
    },
    statCard: {
      backgroundColor: "white",
      padding: "16px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: "bold" as const,
      margin: "8px 0 4px 0",
    },
    statLabel: {
      fontSize: "14px",
      color: "#6b7280",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
      gap: "16px",
    },
    card: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
      transition: "all 0.2s",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "16px",
    },
    bookTitle: {
      fontSize: "18px",
      fontWeight: "bold" as const,
      color: "#1f2937",
      margin: 0,
      lineHeight: "1.4",
    },
    statusBadge: {
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold" as const,
      whiteSpace: "nowrap" as const,
    },
    infoSection: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginBottom: "16px",
    },
    infoItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#6b7280",
    },
    icon: {
      width: "16px",
      height: "16px",
      color: "#9ca3af",
    },
    overdueWarning: {
      backgroundColor: "#fef2f2",
      color: "#dc2626",
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "bold" as const,
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    buttonGroup: {
      display: "flex",
      gap: "8px",
    },
    button: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "8px 12px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "bold" as const,
      transition: "all 0.2s",
    },
    returnButton: {
      backgroundColor: "#10b981",
      color: "white",
    },
    deleteButton: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
    },
    emptyState: {
      textAlign: "center" as const,
      padding: "40px",
      color: "#6b7280",
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "#f3f4f6",
      color: "#374151",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      marginBottom: "16px",
    },
  };

  if (showAddForm) {
    return (
      <div style={styles.container}>
        <button onClick={() => setShowAddForm(false)} style={styles.backButton}>
          ← กลับ
        </button>
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
        >
          สร้างรายการเช่าใหม่
        </h2>
        <RentalForm
          onSuccess={() => setShowAddForm(false)}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>จัดการการเช่าหนังสือ</h1>
        <button
          onClick={() => setShowAddForm(true)}
          style={styles.addButton}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#6d28d9";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#7c3aed";
          }}
        >
          <Plus size={20} />
          เช่า-ขาย หนังสือ
        </button>
      </div>

      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#3b82f6" }}>
              {stats.total_rentals}
            </div>
            <div style={styles.statLabel}>รายการเช่าทั้งหมด</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#10b981" }}>
              {stats.active_rentals}
            </div>
            <div style={styles.statLabel}>กำลังเช่า</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#dc2626" }}>
              {stats.overdue_rentals}
            </div>
            <div style={styles.statLabel}>เลยกำหนด</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#059669" }}>
              ฿{stats.total_revenue.toLocaleString()}
            </div>
            <div style={styles.statLabel}>รายได้จากการเช่า</div>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {rentals?.map((rental) => (
          <div
            key={rental.id}
            style={styles.card}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div style={styles.cardHeader}>
              <h3 style={styles.bookTitle}>{rental.book_title}</h3>
              <span
                style={{
                  ...styles.statusBadge,
                  ...statusColors[rental.status],
                }}
              >
                {statusLabels[rental.status]}
              </span>
            </div>

            {rental.is_overdue && rental.status === "overdue" && (
              <div style={styles.overdueWarning}>
                <AlertTriangle size={14} />
                เลยกำหนดคืนแล้ว!
              </div>
            )}

            <div style={styles.infoSection}>
              <div style={styles.infoItem}>
                <BookOpen style={styles.icon} />
                <span>{rental.book_author}</span>
              </div>

              <div style={styles.infoItem}>
                <User style={styles.icon} />
                <span>{rental.customer_name}</span>
              </div>

              <div style={styles.infoItem}>
                <Calendar style={styles.icon} />
                <span>
                  เช่า:{" "}
                  {new Date(rental.rental_date).toLocaleDateString("th-TH")}
                </span>
              </div>

              <div style={styles.infoItem}>
                <Clock style={styles.icon} />
                <span>
                  ครบกำหนด:{" "}
                  {new Date(rental.due_date).toLocaleDateString("th-TH")}
                </span>
              </div>
            </div>

            {rental.return_date && (
              <div style={styles.infoItem}>
                <CheckCircle style={{ ...styles.icon, color: "#10b981" }} />
                <span>
                  คืนวันที่:{" "}
                  {new Date(rental.return_date).toLocaleDateString("th-TH")}
                </span>
              </div>
            )}

            <div
              style={{
                ...styles.infoItem,
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid #f3f4f6",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  color: "#374151",
                  margin: "10px 0",
                }}
              >
                ค่าเช่า: ฿{rental.book_price_rent.toLocaleString()} ×{" "}
                {rental.days_rented} วัน =
                <span style={{ color: "#059669" }}>
                  {" "}
                  ฿
                  {(
                    rental.book_price_rent * (rental.days_rented || 1)
                  ).toLocaleString()}
                </span>
              </span>
            </div>

            <div style={styles.buttonGroup}>
              {rental.status === "active" || rental.status === "overdue" ? (
                <button
                  onClick={() => handleReturnBook(rental.id!)}
                  disabled={returnBookMutation.isPending}
                  style={{
                    ...styles.button,
                    ...styles.returnButton,
                    opacity: returnBookMutation.isPending ? 0.5 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!returnBookMutation.isPending) {
                      e.currentTarget.style.backgroundColor = "#059669";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#10b981";
                  }}
                >
                  <CheckCircle size={14} />
                  {returnBookMutation.isPending ? "กำลังคืน..." : "คืนหนังสือ"}
                </button>
              ) : (
                <button
                  onClick={() => handleDeleteRental(rental.id!)}
                  disabled={deleteRentalMutation.isPending}
                  style={{
                    ...styles.button,
                    ...styles.deleteButton,
                    opacity: deleteRentalMutation.isPending ? 0.5 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!deleteRentalMutation.isPending) {
                      e.currentTarget.style.backgroundColor = "#fecaca";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#fee2e2";
                  }}
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
        <div style={styles.emptyState}>ยังไม่มีรายการเช่าหนังสือในระบบ</div>
      )}
    </div>
  );
};

export default RentalList;
