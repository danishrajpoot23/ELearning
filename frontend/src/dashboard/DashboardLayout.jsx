import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full font-sans bg-gray-100">
      {/* Sidebar */}
      <div className={`${collapsed ? 'w-20' : 'w-72'} h-full flex-shrink-0 transition-all duration-300`}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full p-5 overflow-y-auto bg-white shadow-inner">
        <Outlet /> {/* Child pages render here */}
      </div>
    </div>
  );
};

export default DashboardLayout;
