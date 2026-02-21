import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import WorksManager from "./WorksManager";
import EventsManager from "./EventsManager";
import PhotosManager from "./PhotosManager";
import AboutManager from "./AboutManager";
import ContactsManager from "./ContactsManager";
import AdminsManager from "./AdminsManager";
import styles from "./admin.module.scss";

const TABS = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "works", label: "Works", icon: "🖼" },
  { id: "photos", label: "Photos", icon: "📷" },
  { id: "events", label: "Events", icon: "📅" },
  { id: "about", label: "About", icon: "👤" },
  { id: "contacts", label: "Contacts", icon: "✉" },
  { id: "admins", label: "Admins", icon: "🔐" },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { works, events, photos } = useData();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "works": return <WorksManager />;
      case "photos": return <PhotosManager />;
      case "events": return <EventsManager />;
      case "about": return <AboutManager />;
      case "contacts": return <ContactsManager />;
      case "admins": return <AdminsManager />;
      default: return (
        <div className={styles.overview}>
          <h2>Dashboard Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>🖼</span>
              <div>
                <strong>{works.length}</strong>
                <p>Works</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📷</span>
              <div>
                <strong>{photos.length}</strong>
                <p>Photos</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statIcon}>📅</span>
              <div>
                <strong>{events.length}</strong>
                <p>Events</p>
              </div>
            </div>
          </div>
          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <div className={styles.quickGrid}>
              {TABS.filter((t) => t.id !== "overview").map((tab) => (
                <button key={tab.id} className={styles.quickBtn} onClick={() => setActiveTab(tab.id)}>
                  <span>{tab.icon}</span>
                  <span>Manage {tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.dashboard}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span>⚡</span>
          <span>Admin</span>
          <button className={styles.siteBtn} onClick={() => navigate("/")} title="Go to site">← Site</button>
        </div>
        <nav className={styles.sidebarNav}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.navActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.navIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className={styles.sidebarUser}>
          {user?.photoURL && <img src={user.photoURL} alt={user.displayName} className={styles.avatar} />}
          <div className={styles.userInfo}>
            <strong>{user?.displayName}</strong>
            <small>{user?.email}</small>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">Sign out</button>
        </div>
      </aside>
      <main className={styles.dashboardMain}>
        <div className={styles.dashboardContent}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
