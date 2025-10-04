import React, { useState } from "react";
import AdminNavbar from "./AdminNavbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <AdminNavbar
        onToggleSidebar={() => setCollapsed(!collapsed)}
        user={{ name: "Admin" }}
        onSignOut={onLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar collapsed={collapsed} onLogout={onLogout} />

        {/* Outlet for child routes */}
        <main className="flex-1 pl-[0.05rem] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
