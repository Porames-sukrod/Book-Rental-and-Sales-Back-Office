import React, { useState } from "react";
import BookList from "./BookList";
import CustomerList from "./CustomerList";
import RentalList from "./RentalList";
import { Book, Users, FileText, BarChart3 } from "lucide-react";
import "../css/Layout.css";

type ActiveTab = "books" | "customers" | "rentals" | "dashboard";

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "books":
        return <BookList />;
      case "customers":
        return <CustomerList />;
      case "rentals":
        return <RentalList />;
      case "dashboard":
      default:
        return (
          <div className="dashboard-container">
            <h1 className="dashboard-title">สรุปภาพรวมร้านเช่าหนังสือ</h1>
            <p className="dashboard-subtitle">
              ดูข้อมูลสำคัญและจัดการการทำงานในที่เดียว
            </p>

            <div className="quick-actions-container">
              <h2 className="section-title">การดำเนินการด่วน</h2>
              <div className="quick-actions-grid">
                <button
                  className="action-card action-card-books"
                  onClick={() => setActiveTab("books")}
                >
                  <div className="action-icon action-icon-books">
                    <Book size={24} />
                  </div>
                  <h3 className="action-title">จัดการหนังสือ</h3>
                  <p className="action-description">
                    เพิ่ม แก้ไข และจัดการสต็อกหนังสือในร้าน
                  </p>
                </button>
                <button
                  className="action-card action-card-customers"
                  onClick={() => setActiveTab("customers")}
                >
                  <div className="action-icon action-icon-customers">
                    <Users size={24} />
                  </div>
                  <h3 className="action-title">จัดการลูกค้า</h3>
                  <p className="action-description">
                    เพิ่มลูกค้าใหม่ และดูประวัติการเช่า
                  </p>
                </button>
                <button
                  className="action-card action-card-rentals"
                  onClick={() => setActiveTab("rentals")}
                >
                  <div className="action-icon action-icon-rentals">
                    <FileText size={24} />
                  </div>
                  <h3 className="action-title">จัดการการเช่า</h3>
                  <p className="action-description">
                    สร้างรายการเช่า ติดตามการคืน และจัดการค้างชำระ
                  </p>
                </button>
              </div>
            </div>

            <div className="features-section">
              <h2 className="features-title">คุณสมบัติหลัก</h2>
              <ul className="features-list">
                <li className="feature-item">
                  <Book size={20} className="feature-icon" />
                  <p>จัดการข้อมูลหนังสือและสต็อก</p>
                </li>
                <li className="feature-item">
                  <Users size={20} className="feature-icon" />
                  <p>บันทึกและแก้ไขข้อมูลลูกค้า</p>
                </li>
                <li className="feature-item">
                  <FileText size={20} className="feature-icon" />
                  <p>ติดตามสถานะการเช่าและกำหนดคืน</p>
                </li>
                <li className="feature-item">
                  <BarChart3 size={20} className="feature-icon" />
                  <p>ดูข้อมูลสรุปและรายงานเชิงสถิติ</p>
                </li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-container">
          <a href="#" className="logo">
            <div className="logo-icon">
              <Book size={24} />
            </div>
            Book Rental
          </a>
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 size={18} className="tab-icon" />
              ภาพรวม
            </button>
            <button
              className={`nav-tab ${activeTab === "books" ? "active" : ""}`}
              onClick={() => setActiveTab("books")}
            >
              <Book size={18} className="tab-icon" />
              จัดการหนังสือ
            </button>
            <button
              className={`nav-tab ${activeTab === "customers" ? "active" : ""}`}
              onClick={() => setActiveTab("customers")}
            >
              <Users size={18} className="tab-icon" />
              จัดการลูกค้า
            </button>
            <button
              className={`nav-tab ${activeTab === "rentals" ? "active" : ""}`}
              onClick={() => setActiveTab("rentals")}
            >
              <FileText size={18} className="tab-icon" />
              จัดการการเช่า
            </button>
          </div>
        </div>
      </nav>

      <main className="content-area">{renderContent()}</main>
    </div>
  );
};

export default Layout;
