import React from "react";
import { useAuth } from "../context/AuthContext";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const AdminPage = () => {
  const { user, isAdmin } = useAuth();

  if (!user) return <AdminLogin />;
  if (!isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: "#888" }}>
        <span style={{ fontSize: "3rem" }}>🚫</span>
        <h2 style={{ color: "#fff" }}>Access Denied</h2>
        <p>Your account is not authorized as admin.</p>
        <p style={{ fontSize: "0.85rem" }}>Signed in as: {user.email}</p>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminPage;
